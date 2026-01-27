import React from 'react';

export function Checkbox({ label, description, className = '', ...props }) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className="w-4 h-4 text-rxforms-blue border-gray-300 rounded focus:ring-rxforms-blue"
          {...props}
        />
      </div>
      <div className="text-sm">
        <label className="font-medium text-gray-700">
          {label}
        </label>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
    </div>
  );
}
