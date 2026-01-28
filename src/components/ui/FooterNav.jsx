import React from 'react';

export function FooterNav({ currentStep, onBack, onContinue, backLabel, continueLabel, continueDisabled }) {
  if (currentStep === 'review') {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-border py-4 px-6 z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center">
        {onBack ? (
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
            ← {backLabel || 'BACK'}
          </button>
        ) : (
          <div /> 
        )}
        <button 
          onClick={onContinue} 
          disabled={continueDisabled}
          className="px-8 py-3 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {continueLabel || 'CONTINUE'} →
        </button>
      </div>
    </footer>
  );
}
