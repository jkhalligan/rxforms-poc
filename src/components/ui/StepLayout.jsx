import React from 'react';

export function StepLayout({ children, preview }) {
  return (
    <div className="step-container">
      <div className="step-content">
        {children}
      </div>
      <div className="step-preview">
        {preview}
      </div>
    </div>
  );
}
