import React, { useState } from 'react';

export function HelpExpander() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-blue-100 rounded-lg overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-blue-50 text-left text-sm font-medium text-blue-900 flex justify-between items-center hover:bg-blue-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">?</span>
          Which should I choose?
        </span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white text-xs text-gray-600 space-y-4 border-t border-blue-100 animate-in slide-in-from-top-2 duration-200">
          <div>
            <p className="font-bold text-gray-800 mb-1">Prescribing controlled substances (Schedule II-V)?</p>
            <p>→ <span className="text-rxforms-blue font-bold">Maximum Security</span> is required by law in most states (including AZ).</p>
          </div>
          
          <div>
            <p className="font-bold text-gray-800 mb-1">General prescriptions for Medicaid patients?</p>
            <p>→ <span className="text-rxforms-blue font-bold">Minimum Security</span> meets federal tamper-resistant requirements.</p>
          </div>
          
          <div>
            <p className="font-bold text-gray-800 mb-1">Private-pay patients, non-controlled only?</p>
            <p>→ <span className="text-rxforms-blue font-bold">Standard</span> pads are sufficient and most economical.</p>
          </div>
          
          <div className="bg-gray-50 p-2 rounded italic">
            Not sure? Maximum Security works for all prescription types and offers the highest protection.
          </div>
        </div>
      )}
    </div>
  );
}
