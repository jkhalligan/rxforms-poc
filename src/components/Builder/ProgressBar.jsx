import React from 'react';

const steps = [
  { id: 'practice', label: 'Practice' },
  { id: 'prescribers', label: 'Prescribers' },
  { id: 'review', label: 'Review' },
  { id: 'order', label: 'Order' },
];

export function ProgressBar({ currentStep, onStepClick }) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-center py-4" aria-label="Progress">
          <ol className="flex items-center space-x-8 lg:space-x-12">
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <li key={step.id} className="relative">
                  <button
                    onClick={() => (isCompleted || isCurrent) && onStepClick(step.id)}
                    className={`flex flex-col items-center group ${
                      isCompleted || isCurrent ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                          isCurrent
                            ? 'bg-rxforms-blue text-white ring-4 ring-blue-50'
                            : isCompleted
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </span>
                    </span>
                    <span
                      className={`mt-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        isCurrent ? 'text-rxforms-blue' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                  {index !== steps.length - 1 && (
                    <div className="absolute top-4 -right-10 lg:-right-14 w-4 lg:w-8 h-px bg-gray-200" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
