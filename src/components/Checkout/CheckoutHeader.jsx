import React from 'react';

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export function CheckoutHeader({ checkoutStep }) {
  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmation', label: 'Confirmation' },
  ];

  const getStepStatus = (stepId) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === checkoutStep);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <header className="checkout-header">
      <div className="checkout-header-content">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <span className="bg-primary text-white px-2 py-1 rounded text-xs">Rx</span>
          <span className="tracking-tight">RxForms</span>
        </div>

        {/* Checkout Progress */}
        <nav className="checkout-progress" aria-label="Checkout progress">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);

            return (
              <React.Fragment key={step.id}>
                {index > 0 && <span className="checkout-separator">›</span>}
                <div
                  className={`checkout-step checkout-step--${status}`}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  {status === 'completed' && (
                    <span className="checkout-check">
                      <CheckIcon />
                    </span>
                  )}
                  <span>{step.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Empty space for balance */}
        <div className="checkout-spacer" />
      </div>
    </header>
  );
}
