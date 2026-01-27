import React, { useState } from 'react';
import { PrescriptionPadSVG } from './PrescriptionPadSVG';
import { SecurityToggle } from './SecurityToggle';
import { PricingTable } from './PricingTable';
import { HelpExpander } from '../ui/HelpExpander';
import { arizonaPricing } from '../../config/pricing';

export function PreviewPanel({ 
  practices, 
  prescribers, 
  padOptions, 
  securityLevel, 
  setSecurityLevel,
  isReviewStep = false 
}) {
  const [pricingExpanded, setPricingExpanded] = useState(false);
  const currentPrice = arizonaPricing[securityLevel].prices[8]; 

  const getBackgroundClass = () => {
    switch (securityLevel) {
      case 'maximum-security':
        return 'bg-[#f5e6d3] bg-diagonal-pattern-rich';
      case 'minimum-security':
        return 'bg-[#faf3e8] bg-diagonal-pattern-light';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <h2 className="flex items-center gap-2 p-4 text-base font-semibold border-b border-gray-200">
        <span className="w-1 h-5 bg-primary rounded-sm" />
        Live Preview
      </h2>

      <div 
        className={`relative aspect-[1.294] m-4 rounded-sm overflow-hidden shadow-sm border border-gray-100 ${getBackgroundClass()} ${isReviewStep ? 'm-6' : ''}`}
      >
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

      <div className="border-t border-gray-200 p-4">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Security Level</label>
        <SecurityToggle securityLevel={securityLevel} setSecurityLevel={setSecurityLevel} />
      </div>

      <div className="border-t border-gray-200">
        <button 
          className="w-full flex items-center gap-2 p-4 text-left hover:bg-gray-50 transition-colors"
          onClick={() => setPricingExpanded(!pricingExpanded)}
        >
          <span className="text-lg font-bold text-gray-900">Starting at ${currentPrice}</span>
          <span className="text-sm text-gray-500">for 8 pads</span>
          <span className={`ml-auto transform transition-transform ${pricingExpanded ? 'rotate-180' : ''}`}>▾</span>
        </button>

        {pricingExpanded && (
          <div className="p-4 pt-0 space-y-4">
            <PricingTable securityLevel={securityLevel} setSecurityLevel={setSecurityLevel} />
            <HelpExpander />
          </div>
        )}
      </div>
    </div>
  );
}