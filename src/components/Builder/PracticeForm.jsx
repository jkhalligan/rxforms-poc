import React from 'react';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { practiceFields } from '../../config/fields';
import { samplePractice } from '../../utils/sampleData';
import { formatPhone } from '../../utils/validation';

export function PracticeForm({ practices, updatePractice, addPractice, removePractice }) {
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Practice Information</h2>
        <p className="text-gray-500 mt-1">Tell us where your practice is located.</p>
      </div>

      <div className="bg-primary-light p-4 rounded-xl border border-blue-100">
        <Checkbox 
          label="Prefill with sample data" 
          description="Use Tucson, AZ test data"
          onChange={handlePrefill}
        />
      </div>

      <div className="space-y-4">
        {practices.map((practice, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                Location {index + 1}
                {index === 0 && <span className="text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded-full uppercase font-bold">Primary</span>}
              </h3>
              {index > 0 && (
                <button 
                  onClick={() => removePractice(index)}
                  className="text-error text-sm font-medium hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            
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
      </div>

      {practices.length < 2 && (
        <button 
          onClick={addPractice} 
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-primary font-semibold hover:border-primary hover:bg-primary-light transition-all"
        >
          + Add another location
        </button>
      )}
    </div>
  );
}