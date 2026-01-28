import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { practiceFields } from '../../config/fields';
import { samplePractice } from '../../utils/sampleData';
import { formatPhone } from '../../utils/validation';

export function PracticeForm({ practices, updatePractice, addPractice, removePractice }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Practice Information</h2>
          <p className="text-gray-500 mt-1">Tell us where your practice is located.</p>
        </div>
        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors pb-1">
          <input 
            type="checkbox" 
            className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary"
            onChange={handlePrefill}
          />
          Prefill Demo
        </label>
      </div>

      <div className="space-y-3">
        {practices.map((practice, index) => {
          const isExpanded = expandedIndex === index;
          
          return (
            <div 
              key={index} 
              className={`accordion ${isExpanded ? 'accordion--expanded' : ''}`}
            >
              <button
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                  isExpanded ? 'bg-primary-light/30' : 'bg-bg-subtle hover:bg-gray-100'
                }`}
                onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
              >
                <span className={`flex-1 font-bold ${isExpanded ? 'text-primary' : 'text-gray-900'}`}>
                  {practice.name || `Location ${index + 1}`}
                  {index === 0 && <span className="ml-3 text-[9px] bg-primary-light text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Primary</span>}
                </span>
                <span className={`transform transition-transform text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
              </button>
              
              {isExpanded && (
                <div className="p-5 bg-white border-t border-border-light">
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
                  {practices.length > 1 && (
                    <button 
                      onClick={() => removePractice(index)}
                      className="text-error text-[10px] font-bold uppercase tracking-widest hover:underline mt-4"
                    >
                      Remove this location
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {practices.length < 2 && (
          <button 
            onClick={addPractice} 
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg text-primary font-bold hover:border-primary hover:bg-primary-light transition-all text-xs tracking-widest"
          >
            + ADD ANOTHER LOCATION
          </button>
        )}
      </div>
    </div>
  );
}
