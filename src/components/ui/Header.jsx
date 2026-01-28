import React from 'react';

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export function Header({ currentStep, completedSteps, onStepClick }) {
  const steps = [
    { id: 'practice', label: 'Practice' },
    { id: 'prescribers', label: 'Prescribers' },
    { id: 'review', label: 'Review & Order' },
  ];

  return (
    <header className="bg-white border-b border-border py-3 px-6 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <span className="bg-primary text-white px-2 py-1 rounded text-xs">Rx</span>
          <span className="tracking-tight">RxForms <span className="text-gray-300 font-normal">POC</span></span>
        </div>

        {/* Progress breadcrumb */}
        <nav className="flex items-center gap-1" aria-label="Form progress">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isClickable = isCompleted;

            return (
              <React.Fragment key={step.id}>
                {index > 0 && <span className="text-gray-200 text-sm px-1">›</span>}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable && !isCurrent}
                  className={`
                    px-3 py-1.5 rounded text-[13px] transition-all flex items-center gap-1.5
                    ${isCurrent ? 'bg-primary-light text-primary font-bold' : ''}
                    ${isCompleted && !isCurrent ? 'text-gray-700 hover:bg-gray-50' : ''}
                    ${!isClickable && !isCurrent ? 'text-gray-300 cursor-not-allowed' : ''}
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted && !isCurrent && (
                    <CheckIcon className="w-3.5 h-3.5 text-success" />
                  )}
                  {step.label}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Product context */}
        <div className="hidden md:block text-gray-400 font-bold text-[11px] uppercase tracking-widest">
          Arizona Rx Pads
        </div>
      </div>
    </header>
  );
}
