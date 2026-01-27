import React from 'react';

export function FooterNav({ onBack, onContinue, backLabel, continueLabel, continueDisabled }) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-100">
      <div className="max-w-[1200px] mx-auto flex justify-between">
        {onBack ? (
          <button onClick={onBack} className="btn btn-secondary">
            ← {backLabel || 'Back'}
          </button>
        ) : (
          <div /> 
        )}
        <button 
          onClick={onContinue} 
          disabled={continueDisabled}
          className="btn btn-primary"
        >
          {continueLabel || 'Continue'} →
        </button>
      </div>
    </footer>
  );
}
