/**
 * NubHQ Accessibility Utilities
 * Hooks and components for better a11y
 */

import { useEffect, useRef, useCallback, useState } from 'react';

// ============================================================
// FOCUS MANAGEMENT
// ============================================================

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function useFocusTrap(isActive = true) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const getFocusableElements = () => 
      container.querySelectorAll(focusableSelectors);

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    // Focus first element on mount
    const focusable = getFocusableElements();
    focusable[0]?.focus();

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
}

/**
 * Return focus to trigger element when component unmounts
 */
export function useReturnFocus() {
  const triggerRef = useRef(document.activeElement);

  useEffect(() => {
    return () => {
      triggerRef.current?.focus();
    };
  }, []);

  return triggerRef;
}

/**
 * Focus first error in form
 */
export function useFocusOnError(errors, isSubmitted) {
  useEffect(() => {
    if (!isSubmitted || Object.keys(errors).length === 0) return;

    const firstErrorField = Object.keys(errors)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    element?.focus();
  }, [errors, isSubmitted]);
}

// ============================================================
// KEYBOARD NAVIGATION
// ============================================================

/**
 * Arrow key navigation for lists/grids
 */
export function useArrowNavigation(itemCount, options = {}) {
  const {
    loop = true,
    orientation = 'vertical', // vertical, horizontal, both
    onSelect,
    initialIndex = 0,
  } = options;

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleKeyDown = useCallback((e) => {
    let newIndex = activeIndex;

    const isVertical = orientation === 'vertical' || orientation === 'both';
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';

    switch (e.key) {
      case 'ArrowUp':
        if (isVertical) {
          e.preventDefault();
          newIndex = activeIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (isVertical) {
          e.preventDefault();
          newIndex = activeIndex + 1;
        }
        break;
      case 'ArrowLeft':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = activeIndex - 1;
        }
        break;
      case 'ArrowRight':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = activeIndex + 1;
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemCount - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect?.(activeIndex);
        return;
      default:
        return;
    }

    // Handle wrapping
    if (loop) {
      if (newIndex < 0) newIndex = itemCount - 1;
      if (newIndex >= itemCount) newIndex = 0;
    } else {
      newIndex = Math.max(0, Math.min(itemCount - 1, newIndex));
    }

    setActiveIndex(newIndex);
  }, [activeIndex, itemCount, loop, orientation, onSelect]);

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    getItemProps: (index) => ({
      role: 'option',
      'aria-selected': index === activeIndex,
      tabIndex: index === activeIndex ? 0 : -1,
    }),
  };
}

/**
 * Escape key handler
 */
export function useEscapeKey(onEscape, isActive = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onEscape, isActive]);
}

// ============================================================
// SCREEN READER UTILITIES
// ============================================================

/**
 * Live region announcements
 */
export function useAnnounce() {
  const announce = useCallback((message, priority = 'polite') => {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', priority);
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    el.textContent = message;
    
    document.body.appendChild(el);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(el);
    }, 1000);
  }, []);

  return announce;
}

/**
 * Announce loading state changes
 */
export function useLoadingAnnounce(isLoading, loadingMessage = 'Loading...', loadedMessage = 'Content loaded') {
  const announce = useAnnounce();
  const wasLoading = useRef(false);

  useEffect(() => {
    if (isLoading && !wasLoading.current) {
      announce(loadingMessage, 'polite');
    } else if (!isLoading && wasLoading.current) {
      announce(loadedMessage, 'polite');
    }
    wasLoading.current = isLoading;
  }, [isLoading, loadingMessage, loadedMessage, announce]);
}

// ============================================================
// REDUCED MOTION
// ============================================================

/**
 * Respect prefers-reduced-motion setting
 */
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}

// ============================================================
// COMPONENTS
// ============================================================

/**
 * Screen reader only content
 */
export function ScreenReaderOnly({ children, as: Component = 'span' }) {
  return (
    <Component
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Skip to main content link
 */
export function SkipLink({ href = '#main-content', children = 'Skip to main content' }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--nub-primary)] focus:text-white focus:rounded-lg focus:font-bold"
    >
      {children}
    </a>
  );
}

/**
 * Live region container
 */
export function LiveRegion({ children, priority = 'polite' }) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// ============================================================
// A11Y TESTING HELPERS (dev only)
// ============================================================

export function checkAccessibility(element) {
  const issues = [];

  // Check for alt text on images
  const images = element.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      issues.push({
        element: img,
        issue: 'Image missing alt text',
        severity: 'error',
      });
    }
  });

  // Check for button labels
  const buttons = element.querySelectorAll('button');
  buttons.forEach((btn) => {
    if (!btn.textContent?.trim() && !btn.getAttribute('aria-label')) {
      issues.push({
        element: btn,
        issue: 'Button missing accessible label',
        severity: 'error',
      });
    }
  });

  // Check for form labels
  const inputs = element.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id;
    const hasLabel = id && element.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel) {
      issues.push({
        element: input,
        issue: 'Form input missing label',
        severity: 'error',
      });
    }
  });

  // Check color contrast (basic)
  // This would need a more sophisticated implementation

  return issues;
}

// Dev mode: Log a11y issues
if (import.meta?.env?.DEV) {
  window.__checkA11y = () => {
    const issues = checkAccessibility(document.body);
    if (issues.length > 0) {
      console.group('♿ Accessibility Issues');
      issues.forEach(({ element, issue, severity }) => {
        const method = severity === 'error' ? 'error' : 'warn';
        console[method](issue, element);
      });
      console.groupEnd();
    } else {
      console.log('♿ No accessibility issues found!');
    }
    return issues;
  };
}
