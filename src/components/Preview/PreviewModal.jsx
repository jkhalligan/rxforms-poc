import React, { useEffect } from 'react';
import { PrescriptionPadSVG } from './PrescriptionPadSVG';

export function PreviewModal({ practices, prescribers, padOptions, securityLevel, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Preview Your Prescription Pad</h3>
          <button 
            className="modal-close" 
            onClick={onClose} 
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div 
            className={`modal-preview-container preview-bg--${securityLevel} shadow-lg border border-gray-100 relative ${getBackgroundClass()}`}
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
        </div>
        
        <div className="modal-footer">
          <p>
            This preview shows exactly how your prescription pad will appear. 
            Security backgrounds are for demonstration.
          </p>
        </div>
      </div>
    </div>
  );
}