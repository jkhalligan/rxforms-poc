import React from 'react';
import { Input } from '../ui/Input';
import { practiceFields } from '../../config/fields';
import { samplePractice } from '../../utils/sampleData';
import { formatPhone } from '../../utils/validation';

export function PracticeForm({ practices, updatePractice, addPractice, removePractice }) {
  const handlePrefill = (e) => {
    if (e.target.checked) {
      updatePractice(0, samplePractice);
    } else {
      updatePractice(0, { name: '', address: '', city: '', state: 'AZ', zip: '', phone: '', fax: '' });
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

      <div className="space-y-4">
        {practices.map((practice, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-border shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">Location {index + 1}</h3>
                {index === 0 && (
                  <span className="text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">Primary</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                    onChange={handlePrefill}
                  />
                  Prefill Demo
                </label>
                {index > 0 && (
                  <button 
                    onClick={() => removePractice(index)}
                    className="text-error text-[10px] font-bold uppercase tracking-widest hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
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
          className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg text-primary font-bold hover:border-primary hover:bg-primary-light transition-all text-sm"
        >
          + ADD ANOTHER LOCATION
        </button>
      )}
    </div>
  );
}