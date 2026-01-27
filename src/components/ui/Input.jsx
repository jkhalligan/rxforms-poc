import React from 'react';

export function Input({ label, error, helpText, className = '', ...props }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-rxforms-blue focus:border-rxforms-blue sm:text-sm transition-colors ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      {helpText && !error && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}
