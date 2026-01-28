import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { prescriberFields } from '../../config/fields';
import { samplePrescriber } from '../../utils/sampleData';
import { validatePrescriber } from '../../utils/validation';
import { PadOptions } from './PadOptions';

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const AlertCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const CircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
  </svg>
);

export function PrescriberForm({ prescribers, updatePrescriber, addPrescriber, removePrescriber, padOptions, setPadOptions }) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const maxPrescribers = 6;

  const handlePrefill = (e) => {
    if (e.target.checked) {
      updatePrescriber(0, samplePrescriber);
    } else {
      updatePrescriber(0, { name: '', credentials: '', specialty: '', licenseNumber: '', npiNumber: '', deaNumber: '' });
    }
  };

  const canAddPrescriber = () => {
    if (prescribers.length >= maxPrescribers) return false;
    const current = prescribers[prescribers.length - 1];
    return current?.name?.trim() && current?.credentials?.trim();
  };

  const getValidationStatus = (prescriber) => {
    const { valid, errors } = validatePrescriber(prescriber);
    if (Object.keys(errors).length > 0 && (prescriber.name || prescriber.credentials)) {
      if (errors.deaNumber || errors.npiNumber) return 'error';
    }
    if (valid) return 'complete';
    return 'incomplete';
  };

  const getAccordionLabel = (prescriber, index) => {
    if (prescriber.name && prescriber.credentials) {
      return `${prescriber.name}, ${prescriber.credentials}`;
    }
    return prescriber.name || `Prescriber ${index + 1}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescriber Details</h2>
          <p className="text-gray-500 mt-1">Add up to 6 prescribers for this pad.</p>
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
        {prescribers.map((prescriber, index) => {
          const isExpanded = expandedIndex === index;
          const status = getValidationStatus(prescriber);
          const { errors } = validatePrescriber(prescriber);
          
          return (
            <div 
              key={index} 
              className={`accordion ${isExpanded ? 'accordion--expanded' : ''} ${status === 'error' ? 'accordion--error' : ''}`}
            >
              <button
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                  isExpanded ? 'bg-primary-light/30' : 'bg-bg-subtle hover:bg-gray-100'
                }`}
                onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
              >
                <div className="flex-shrink-0">
                  {status === 'complete' && <CheckCircleIcon className="w-5 h-5 text-success" />}
                  {status === 'error' && <AlertCircleIcon className="w-5 h-5 text-error" />}
                  {status === 'incomplete' && <CircleIcon className="w-5 h-5 text-gray-300" />}
                </div>
                <span className={`flex-1 font-bold ${isExpanded ? 'text-primary' : 'text-gray-900'}`}>
                  {getAccordionLabel(prescriber, index)}
                </span>
                <span className={`transform transition-transform text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
              </button>
              
              {isExpanded && (
                <div className="p-5 bg-white border-t border-border-light space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prescriberFields.map((field) => (
                      field.type === 'checkbox' ? (
                        <Checkbox
                          key={field.id}
                          label={field.label}
                          checked={prescriber[field.id] || false}
                          onChange={(e) => updatePrescriber(index, { [field.id]: e.target.checked })}
                          className="md:col-span-2 mt-2"
                        />
                      ) : (
                        <Input
                          key={field.id}
                          label={field.label}
                          placeholder={field.placeholder}
                          type={field.type}
                          value={prescriber[field.id] || ''}
                          onChange={(e) => updatePrescriber(index, { [field.id]: e.target.value })}
                          error={errors[field.id]}
                          className={field.id === 'name' || field.id === 'credentials' ? 'md:col-span-1' : ''}
                        />
                      )
                    ))}
                  </div>
                  {prescribers.length > 1 && (
                    <button 
                      onClick={() => removePrescriber(index)}
                      className="text-error text-[10px] font-bold uppercase tracking-widest hover:underline pt-2"
                    >
                      Remove this prescriber
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={addPrescriber}
          disabled={!canAddPrescriber()}
          className={`w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg font-bold transition-all text-xs tracking-widest ${
            canAddPrescriber() 
              ? 'border-gray-200 text-primary hover:border-primary hover:bg-primary-light' 
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          + ADD ANOTHER PRESCRIBER
          <span className="text-[10px] font-normal opacity-70">({prescribers.length} of {maxPrescribers})</span>
        </button>
        
        {!canAddPrescriber() && prescribers.length < maxPrescribers && (
          <p className="text-center text-[10px] text-gray-400 mt-2">
            Complete required fields (name, credentials) to add another prescriber
          </p>
        )}
      </div>

      <div className="static-card">
        <PadOptions padOptions={padOptions} setPadOptions={setPadOptions} />
      </div>
    </div>
  );
}