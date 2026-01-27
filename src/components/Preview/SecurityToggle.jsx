import React from 'react';

export function SecurityToggle({ securityLevel, setSecurityLevel }) {
  const options = [
    { id: 'maximum-security', label: 'Maximum' },
    { id: 'minimum-security', label: 'Minimum' },
    { id: 'no-security', label: 'Standard' },
  ];

  return (
    <div className="flex p-1 bg-gray-100 rounded-lg">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => setSecurityLevel(option.id)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            securityLevel === option.id
              ? 'bg-white text-rxforms-blue shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
