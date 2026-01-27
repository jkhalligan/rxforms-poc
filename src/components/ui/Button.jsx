import React from 'react';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-rxforms-blue text-white hover:bg-blue-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    outline: 'bg-transparent text-rxforms-blue border border-rxforms-blue hover:bg-blue-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
