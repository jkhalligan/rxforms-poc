import React, { useRef } from 'react';
import { exportPrescriptionPadPDF, getSvgElement } from '../../utils/pdfExport';
import { PrescriptionPadSVG } from '../Preview/PrescriptionPadSVG';

const CheckCircleIcon = () => (
  <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export function ConfirmationStep({
  orderNumber,
  estimatedDelivery,
  practices,
  prescribers,
  padOptions,
  securityLevel,
  onStartNewOrder,
}) {
  const svgRef = useRef();
  const userEmail = 'jere@example.com'; // In a real app, this would come from user state

  const handleDownloadPDF = async () => {
    const svgElement = getSvgElement(svgRef);
    if (svgElement) {
      await exportPrescriptionPadPDF(svgElement, `RxPad-Order-${orderNumber}.pdf`);
    }
  };

  return (
    <div className="checkout-step-content">
      <div className="confirmation-container">
        <div className="confirmation-icon">
          <CheckCircleIcon />
        </div>

        <h1 className="confirmation-title">Order Confirmed</h1>

        <div className="confirmation-order-number">
          Order #{orderNumber}
        </div>

        <p className="confirmation-message">
          Your prescription pads are being prepared.
          <br />
          <strong>Estimated delivery: {estimatedDelivery}</strong>
        </p>

        <div className="confirmation-email">
          <EmailIcon />
          <span>Confirmation sent to: {userEmail}</span>
        </div>

        <div className="confirmation-actions">
          <button
            className="btn btn-secondary"
            onClick={handleDownloadPDF}
          >
            <DownloadIcon />
            Download PDF Proof
          </button>
          <button
            className="btn btn-primary"
            onClick={onStartNewOrder}
          >
            Start New Order
          </button>
        </div>
      </div>

      {/* Hidden SVG for PDF export */}
      <div ref={svgRef} className="hidden" aria-hidden="true">
        <PrescriptionPadSVG
          practices={practices}
          prescribers={prescribers}
          padOptions={padOptions}
          securityLevel={securityLevel}
        />
      </div>
    </div>
  );
}
