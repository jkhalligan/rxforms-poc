import React, { useState } from 'react';
import { PrescriptionPadSVG } from './PrescriptionPadSVG';
import { SecurityToggle } from './SecurityToggle';
import { HelpExpander } from '../ui/HelpExpander';
import { PreviewModal } from './PreviewModal';
import { arizonaPricing } from '../../config/pricing';

const ExpandIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const ZoomIcon = () => (
  <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
  </svg>
);

export function PreviewPanel({ 
  practices, 
  prescribers, 
  padOptions, 
  securityLevel, 
  setSecurityLevel,
}) {
  const [showSecurityHelp, setShowSecurityHelp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentPrice = arizonaPricing[securityLevel].prices[8]; 
  const securityLevelName = arizonaPricing[securityLevel].name;

  const getBackgroundClass = () => {
    switch (securityLevel) {
      case 'maximum-security': return 'bg-[#f5e6d3] bg-diagonal-pattern-rich';
      case 'minimum-security': return 'bg-[#faf3e8] bg-diagonal-pattern-light';
      default: return 'bg-white';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm transition-all">
        <div className="flex items-center justify-between p-3.5 border-b border-border">
          <span className="text-sm font-bold text-gray-900 leading-tight">Your Arizona Prescription Pad</span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded-md hover:bg-white hover:border-primary hover:text-primary transition-all"
          >
            <ExpandIcon /> ENLARGE
          </button>
        </div>

        <div 
          className={`relative aspect-[1.294] m-4 rounded-sm overflow-hidden shadow-sm border border-gray-100 cursor-pointer group ${getBackgroundClass()}`}
          style={{
            backgroundImage: securityLevel !== 'no-security' ? `url('/assets/backgrounds/${securityLevel}.png')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={() => setIsModalOpen(true)}
        >
          {securityLevel === 'maximum-security' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-[120px] font-serif font-bold">Rx</span>
            </div>
          )}
          
          <div className="relative z-10 w-full h-full p-2 group-hover:scale-[1.01] transition-transform duration-300">
            <PrescriptionPadSVG 
              practices={practices} 
              prescribers={prescribers} 
              padOptions={padOptions} 
              securityLevel={securityLevel} 
            />
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIcon />
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Security Level</label>
          <SecurityToggle securityLevel={securityLevel} setSecurityLevel={setSecurityLevel} />
          
          <p className="mt-2 text-[11px] text-gray-500 italic">
            {securityLevel === 'maximum-security' && 'Required for controlled substances (Schedule II-V)'}
            {securityLevel === 'minimum-security' && 'Meets federal Medicaid tamper-resistant requirements'}
            {securityLevel === 'no-security' && 'For non-controlled, non-Medicaid prescriptions'}
          </p>

          <button 
            className="w-full mt-3 py-1.5 text-[11px] font-bold text-primary hover:underline transition-all"
            onClick={() => setShowSecurityHelp(!showSecurityHelp)}
          >
            {showSecurityHelp ? '− HIDE GUIDANCE' : '+ HELP ME DECIDE'}
          </button>

          {showSecurityHelp && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-md text-[11px] space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div>
                <strong className="block text-gray-900 mb-0.5">Maximum Security</strong>
                <span className="text-gray-600 leading-normal">Required by law for controlled substances. Includes microprint, sequential numbering, and tamper-evident features.</span>
              </div>
              <div>
                <strong className="block text-gray-900 mb-0.5">Minimum Security</strong>
                <span className="text-gray-600 leading-normal">Meets federal requirements for Medicaid prescriptions. Good for general practice without controlled substances.</span>
              </div>
              <div>
                <strong className="block text-gray-900 mb-0.5">Standard</strong>
                <span className="text-gray-600 leading-normal">For private-pay patients and non-controlled prescriptions. Most economical option.</span>
              </div>
              <p className="pt-2 border-t border-gray-200 italic text-gray-400 text-[10px]">Not sure? Maximum Security works for all prescription types.</p>
            </div>
          )}
        </div>

        <div className="border-t border-border py-4 px-6 text-center bg-gray-50/50">
          <div className="text-sm text-gray-500">
            Starting at <strong className="text-lg text-gray-900">${currentPrice}</strong>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            for 8 pads · {securityLevelName}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PreviewModal
          practices={practices}
          prescribers={prescribers}
          padOptions={padOptions}
          securityLevel={securityLevel}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
