import React from 'react';
import { PrescriptionPadSVG } from './PrescriptionPadSVG';
import { SecurityToggle } from './SecurityToggle';
import { HelpExpander } from '../ui/HelpExpander';

export function PreviewPanel({ practices, prescribers, padOptions, securityLevel, setSecurityLevel }) {
  const getBackgroundClass = () => {
    switch (securityLevel) {
      case 'maximum-security':
        return 'bg-[#f5e6d3] bg-diagonal-pattern-rich';
      case 'minimum-security':
        return 'bg-[#faf3e8] bg-diagonal-pattern-light';
      case 'no-security':
        default:
        return 'bg-white';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span className="w-2 h-6 bg-rxforms-blue rounded-full"></span>
        Live Preview
      </h2>
      
      <div className={`relative aspect-[5.5/4.25] w-full border border-gray-200 shadow-sm overflow-hidden rounded-sm ${getBackgroundClass()}`}>
        {/* Background Watermark for Maximum Security */}
        {securityLevel === 'maximum-security' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-[120px] font-serif font-bold">℞</span>
          </div>
        )}
        
        <div className="relative z-10 w-full h-full p-2">
          <PrescriptionPadSVG 
            practices={practices} 
            prescribers={prescribers} 
            padOptions={padOptions} 
            securityLevel={securityLevel} 
          />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Security Level</h3>
          <SecurityToggle securityLevel={securityLevel} setSecurityLevel={setSecurityLevel} />
        </div>

        <HelpExpander />

        <PricingTable securityLevel={securityLevel} setSecurityLevel={setSecurityLevel} />
      </div>
    </div>
  );
}
