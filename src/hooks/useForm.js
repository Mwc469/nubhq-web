/**
 * NubHQ Form Utilities
 * Validation, auto-save, and form state management
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { storage, debounce } from '@/lib/apiUtils';

// ============================================================
// FORM STATE HOOK
// ============================================================

/**
 * Manage form state with validation
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Object} validators - Validation functions { field: (value, allValues) => error | null }
 * @param {Object} options - { onSubmit, onValidChange, validateOnChange, validateOnBlur }
 */
export function useForm(initialValues = {}, validators = {}, options = {}) {
  const {
    onSubmit,
    onValidChange,
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const validator = validators[name];
    if (!validator) return null;
    return validator(value, values);
  }, [validators, values]);

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validators).forEach((name) => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validators, values, validateField]);

  // Set field value
  const setValue = useCallback((name, value) => {
    setValues(prev => {
      const newValues = { ...prev, [name]: value };
      
      // Validate on change
      if (validateOnChange) {
        const error = validateField(name, value);
        setErrors(prev => ({
          ...prev,
          [name]: error,
        }));
      }

      return newValues;
    });
  }, [validateOnChange, validateField]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setValue(name, newValue);
  }, [setValue]);

  // Handle blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    if (validateOnBlur) {
      const error = validateField(name, values[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateOnBlur, validateField, values]);

  // Handle submit
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    setSubmitCount(prev => prev + 1);

    // Mark all fields as touched
    const allTouched = Object.keys(validators).reduce(
      (acc, name) => ({ ...acc, [name]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate
    const isValid = validateAll();
    if (!isValid) return;

    // Submit
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validators, validateAll, onSubmit]);

  // Reset form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setSubmitCount(0);
  }, [initialValues]);

  // Check if form is valid
  const isValid = Object.keys(errors).every(k => !errors[k]);
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  // Notify on valid changes
  useEffect(() => {
    if (isValid && isDirty) {
      onValidChange?.(values);
    }
  }, [isValid, isDirty, values, onValidChange]);

  // Get field props
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] ?? '',
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': touched[name] && !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  }), [values, handleChange, handleBlur, touched, errors]);

  // Get error props
  const getErrorProps = useCallback((name) => ({
    id: `${name}-error`,
    role: 'alert',
    'aria-live': 'polite',
  }), []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    submitCount,
    setValue,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validateField,
    validateAll,
    getFieldProps,
    getErrorProps,
    getError: (name) => touched[name] ? errors[name] : null,
  };
}

// ============================================================
// AUTO-SAVE HOOK
// ============================================================

/**
 * Auto-save form to local storage
 */
export function useAutoSave(key, values, options = {}) {
  const {
    debounceMs = 1000,
    enabled = true,
    onSave,
    onRestore,
  } = options;

  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Save function
  const save = useCallback(() => {
    if (!enabled) return;
    
    storage.saveDraft(key, values);
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    onSave?.(values);
  }, [key, values, enabled, onSave]);

  // Debounced save
  const debouncedSave = useCallback(
    debounce(save, debounceMs),
    [save, debounceMs]
  );

  // Auto-save on changes
  useEffect(() => {
    if (!enabled) return;
    setHasUnsavedChanges(true);
    debouncedSave();
    
    return () => {
      debouncedSave.cancel?.();
    };
  }, [values, debouncedSave, enabled]);

  // Restore saved draft
  const restore = useCallback(() => {
    const draft = storage.getDraft(key);
    if (draft?.value) {
      onRestore?.(draft.value);
      return draft;
    }
    return null;
  }, [key, onRestore]);

  // Clear saved draft
  const clear = useCallback(() => {
    storage.clearDraft(key);
    setLastSaved(null);
    setHasUnsavedChanges(false);
  }, [key]);

  // Check for existing draft on mount
  const hasSavedDraft = useCallback(() => {
    const draft = storage.getDraft(key);
    return !!draft?.value;
  }, [key]);

  return {
    lastSaved,
    hasUnsavedChanges,
    save,
    restore,
    clear,
    hasSavedDraft,
  };
}

// ============================================================
// FIELD ARRAY HOOK
// ============================================================

/**
 * Manage array of form fields (e.g., dynamic inputs)
 */
export function useFieldArray(initialItems = []) {
  const [items, setItems] = useState(initialItems);
  const idCounter = useRef(0);

  const append = useCallback((item) => {
    const id = `item_${++idCounter.current}`;
    setItems(prev => [...prev, { ...item, __id: id }]);
  }, []);

  const prepend = useCallback((item) => {
    const id = `item_${++idCounter.current}`;
    setItems(prev => [{ ...item, __id: id }, ...prev]);
  }, []);

  const remove = useCallback((index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const move = useCallback((from, to) => {
    setItems(prev => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }, []);

  const update = useCallback((index, item) => {
    setItems(prev => prev.map((p, i) => i === index ? { ...p, ...item } : p));
  }, []);

  const replace = useCallback((newItems) => {
    setItems(newItems.map((item, i) => ({
      ...item,
      __id: item.__id || `item_${++idCounter.current}`,
    })));
  }, []);

  return {
    items,
    append,
    prepend,
    remove,
    move,
    update,
    replace,
    fields: items.map((item, index) => ({
      ...item,
      key: item.__id,
      index,
    })),
  };
}

// ============================================================
// VALIDATORS
// ============================================================

export const validators = {
  required: (message = 'This field is required') => (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Must be at most ${max} characters`;
    }
    return null;
  },

  pattern: (regex, message = 'Invalid format') => (value) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  },

  email: (message = 'Invalid email') => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  url: (message = 'Invalid URL') => (value) => {
    try {
      if (value) new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  match: (fieldName, message) => (value, allValues) => {
    if (value !== allValues[fieldName]) {
      return message || `Must match ${fieldName}`;
    }
    return null;
  },

  custom: (fn) => fn,

  // Combine multiple validators
  compose: (...validators) => (value, allValues) => {
    for (const validator of validators) {
      const error = validator(value, allValues);
      if (error) return error;
    }
    return null;
  },
};

// ============================================================
// CAPTION VALIDATORS (NUB-specific)
// ============================================================

export const captionValidators = {
  // Caption length for different platforms
  instagram: validators.compose(
    validators.required('Caption is required'),
    validators.maxLength(2200, 'Instagram captions must be under 2,200 characters')
  ),

  twitter: validators.compose(
    validators.required('Tweet is required'),
    validators.maxLength(280, 'Tweets must be under 280 characters')
  ),

  tiktok: validators.compose(
    validators.required('Caption is required'),
    validators.maxLength(4000, 'TikTok captions must be under 4,000 characters')
  ),

  // Check for banned hashtags
  noBannedHashtags: (message = 'Contains banned hashtags') => (value) => {
    const banned = ['#followforfollow', '#f4f', '#likeforlike', '#l4l'];
    const lower = (value || '').toLowerCase();
    
    for (const tag of banned) {
      if (lower.includes(tag)) {
        return `${message}: ${tag}`;
      }
    }
    return null;
  },

  // Check for NUB voice alignment (placeholder)
  voiceCheck: (minScore = 5) => (value) => {
    // This would call the voice check API
    // For now, just a placeholder
    return null;
  },
};

export default useForm;
