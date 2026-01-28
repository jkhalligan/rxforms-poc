import React, { useEffect } from 'react';
import { PrescriptionPadSVG } from './PrescriptionPadSVG';

export function PreviewModal({ practices, prescribers, padOptions, securityLevel, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const getBackgroundClass = () => {
    switch (securityLevel) {
      case 'maximum-security': return 'bg-[#f5e6d3] bg-diagonal-pattern-rich';
      case 'minimum-security': return 'bg-[#faf3e8] bg-diagonal-pattern-light';
      default: return 'bg-white';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-lg font-bold text-gray-900">Preview Your Prescription Pad</h3>
          <button 
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" 
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div 
          className={`modal-preview shadow-lg border border-gray-100 relative ${getBackgroundClass()}`}
          style={{
            backgroundImage: securityLevel !== 'no-security' ? `url('/assets/backgrounds/${securityLevel}.png')` : 'none',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        >
          {securityLevel === 'maximum-security' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-[160px] font-serif font-bold">Rx</span>
            </div>
          )}
          <div className="relative z-10 w-full h-full p-6">
            <PrescriptionPadSVG
              practices={practices}
              prescribers={prescribers}
              padOptions={padOptions}
              securityLevel={securityLevel}
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <p className="text-sm text-gray-500 text-center">
            This preview shows exactly how your prescription pad will appear. 
            Security backgrounds are for demonstration.
          </p>
        </div>
      </div>
    </div>
  );
}
