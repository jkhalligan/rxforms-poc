import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { practiceFields } from '../../config/fields';
import { samplePractice } from '../../utils/sampleData';
import { formatPhone } from '../../utils/validation';

export function PracticeForm({ practices, updatePractice, addPractice, removePractice, onContinue }) {
  const handlePrefill = (e) => {
    if (e.target.checked) {
      updatePractice(0, samplePractice);
    }
  };

  const handleInputChange = (index, fieldId, value) => {
    let formattedValue = value;
    if (fieldId === 'phone' || fieldId === 'fax') {
      formattedValue = formatPhone(value);
    }
    updatePractice(index, { [fieldId]: formattedValue });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Practice Information</h2>
        <p className="text-gray-500 mt-1">Tell us where your practice is located.</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
        <Checkbox 
          label="Prefill with sample data" 
          description="Use Tucson, AZ test data"
          onChange={handlePrefill}
        />
      </div>

      {practices.map((practice, index) => (
        <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
          {index > 0 && (
            <button 
              onClick={() => removePractice(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          )}
          <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-2">
            Location {index + 1}
            {index === 0 && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">Primary</span>}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practiceFields.map((field) => (
              <Input
                key={field.id}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                value={practice[field.id] || ''}
                onChange={(e) => handleInputChange(index, field.id, e.target.value)}
                className={field.id === 'name' || field.id === 'address' ? 'md:col-span-2' : ''}
              />
            ))}
          </div>
        </div>
      ))}

      {practices.length < 2 && (
        <Button variant="outline" onClick={addPractice} className="w-full py-4 border-dashed border-2">
          + Add another location
        </Button>
      )}

      <div className="pt-4 flex justify-end">
        <Button onClick={onContinue} className="w-full md:w-auto">
          Continue to Prescribers
        </Button>
      </div>
    </div>
  );
}
