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
    { id: 'review', label: 'Review' },
    { id: 'order', label: 'Order' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 sticky top-0 z-100">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="bg-primary text-white px-2 py-1 rounded-md text-sm">Rx</span>
          <span>RxForms <span className="text-gray-400 font-normal">POC</span></span>
        </div>

        {/* Progress breadcrumb */}
        <nav className="flex items-center gap-2" aria-label="Form progress">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isClickable = isCompleted;

            return (
              <React.Fragment key={step.id}>
                {index > 0 && <span className="text-gray-300 text-sm">›</span>}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable && !isCurrent}
                  className={`
                    px-3 py-1.5 rounded-md text-sm transition-all flex items-center gap-1.5
                    ${isCurrent ? 'bg-primary-light text-primary font-semibold' : ''}
                    ${isCompleted && !isCurrent ? 'text-gray-700 hover:bg-gray-100' : ''}
                    ${!isClickable && !isCurrent ? 'text-gray-400 cursor-not-allowed' : ''}
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
        <div className="hidden md:block text-gray-500 text-sm">
          Arizona Prescription Pads
        </div>
      </div>
    </header>
  );
}
