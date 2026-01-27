import React from 'react';
import { Input } from '../ui/Input';
import { padOptionsFields } from '../../config/fields';

export function PadOptions({ padOptions, setPadOptions }) {
  const field = padOptionsFields[0];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        Pad Options
      </h3>
      <Input
        label={field.label}
        placeholder={field.placeholder}
        helpText={field.helpText}
        value={padOptions.startingNumber || ''}
        onChange={(e) => setPadOptions({ ...padOptions, startingNumber: e.target.value })}
      />
    </div>
  );
}
