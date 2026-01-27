import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { prescriberFields } from '../../config/fields';
import { samplePrescriber } from '../../utils/sampleData';
import { validateDEA } from '../../utils/validation';

import { PadOptions } from './PadOptions';

export function PrescriberForm({ prescribers, updatePrescriber, addPrescriber, removePrescriber, padOptions, setPadOptions, onContinue, onBack }) {
  const [errors, setErrors] = useState({});

  const handlePrefill = (e) => {
    if (e.target.checked) {
      updatePrescriber(0, samplePrescriber);
    }
  };

  const handleInputChange = (index, fieldId, value, type) => {
    const val = type === 'checkbox' ? !prescribers[index][fieldId] : value;
    updatePrescriber(index, { [fieldId]: val });

    if (fieldId === 'deaNumber') {
      const result = validateDEA(value);
      setErrors(prev => ({
        ...prev,
        [`${index}-deaNumber`]: result.valid ? null : result.message
      }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Prescriber Details</h2>
        <p className="text-gray-500 mt-1">Add up to 2 prescribers for this pad.</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
        <Checkbox 
          label="Prefill with sample data" 
          description="Use Sarah Chen, MD"
          onChange={handlePrefill}
        />
      </div>

      {prescribers.map((prescriber, index) => (
        <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
          {index > 0 && (
            <button 
              onClick={() => removePrescriber(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          )}
          <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-2">
            Prescriber {index + 1}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriberFields.map((field) => (
              field.type === 'checkbox' ? (
                <Checkbox
                  key={field.id}
                  label={field.label}
                  checked={prescriber[field.id] || false}
                  onChange={() => handleInputChange(index, field.id, null, 'checkbox')}
                  className="md:col-span-2 mt-2"
                />
              ) : (
                <Input
                  key={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={prescriber[field.id] || ''}
                  onChange={(e) => handleInputChange(index, field.id, e.target.value)}
                  error={errors[`${index}-${field.id}`]}
                  className={field.id === 'name' ? 'md:col-span-1' : field.id === 'credentials' ? 'md:col-span-1' : ''}
                />
              )
            ))}
          </div>
        </div>
      ))}

      {prescribers.length < 2 && (
        <Button variant="outline" onClick={addPrescriber} className="w-full py-4 border-dashed border-2">
          + Add another prescriber
        </Button>
      )}

      <PadOptions padOptions={padOptions} setPadOptions={setPadOptions} />

      <div className="pt-4 flex items-center gap-4">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onContinue} className="flex-[2]">
          Continue to Review
        </Button>
      </div>
    </div>
  );
}
