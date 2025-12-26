import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'font-semibold transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none border-3 border-black';

  const variants = {
    primary: 'bg-brand-orange text-white shadow-brutal hover:bg-orange-700',
    secondary: 'bg-white text-brand-dark shadow-brutal hover:bg-gray-100',
    ghost: 'bg-transparent text-white border-white/20 hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
