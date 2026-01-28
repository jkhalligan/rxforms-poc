import React, { useState, useRef, useEffect } from 'react';
import { PrescriptionPadSVG } from '../Preview/PrescriptionPadSVG';
import { PreviewModal } from '../Preview/PreviewModal';
import { arizonaPricing } from '../../config/pricing';
import { exportPrescriptionPadPDF, getSvgElement } from '../../utils/pdfExport';

const ZoomInIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export function ReviewAndOrder({
  practices,
  prescribers,
  padOptions,
  securityLevel,
  onBack,
  onProceedToCheckout,
}) {
  const [quantity, setQuantity] = useState(8);
  const [paperType, setPaperType] = useState('carbonless-2');
  const [productionTime, setProductionTime] = useState('standard');
  const [proofApproved, setProofApproved] = useState(false);
  const [editingPaper, setEditingPaper] = useState(false);
  const [editingProduction, setEditingProduction] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState(true);
  const [proofProgress, setProofProgress] = useState(0);
  const svgRef = useRef();

  // Simulate proof generation with progress bar
  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 30; // Update every 30ms for smooth animation
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProofProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsGeneratingProof(false), 100);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const basePrice = arizonaPricing[securityLevel].prices[quantity];
  const paperModifier = paperType === 'carbonless-2' ? 25 : 0;
  const productionModifier = productionTime === 'rush' ? 35 : 0;
  const totalPrice = basePrice + paperModifier + productionModifier;

  const quantities = [8, 16, 24, 40, 80];

  const handleProceedToCheckout = () => {
    if (!proofApproved) return;
    onProceedToCheckout({
      practices,
      prescribers,
      padOptions,
      securityLevel,
      quantity,
      paperType,
      productionTime,
      basePrice,
      totalPrice,
    });
  };


  const handleDownloadPDF = async () => {
    const svgElement = getSvgElement(svgRef);
    if (svgElement) {
      await exportPrescriptionPadPDF(svgElement, `RxPad-Proof-${securityLevel}.pdf`);
    }
  };

  const prescriberCount = prescribers.filter(p => p.name).length;

  return (
    <div className="review-order-layout">
      {/* Left Column - Proof */}
      <div className="review-proof-section">
        <div className="proof-card">
          <h2 className="proof-title text-2xl font-bold text-gray-900">Review Your Proof</h2>
          <p className="proof-subtitle text-gray-500 mt-1 mb-6">
            Please verify all details are correct before adding to cart.
          </p>

          <div
            className={`proof-preview preview-bg--${securityLevel} group`}
            onClick={() => !isGeneratingProof && setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Click to enlarge preview"
          >
            {isGeneratingProof ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95">
                <div className="text-center space-y-4 px-8">
                  <div className="text-lg font-semibold text-gray-700">Generating Proof</div>
                  <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-100 ease-linear"
                      style={{ width: `${proofProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <PrescriptionPadSVG
                  practices={practices}
                  prescribers={prescribers}
                  padOptions={padOptions}
                  securityLevel={securityLevel}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/70 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomInIcon />
                  <span>Click to enlarge</span>
                </div>
              </>
            )}
          </div>

          <label className={`approval-checkbox ${proofApproved ? 'is-approved' : ''}`}>
            <input
              type="checkbox"
              checked={proofApproved}
              onChange={(e) => setProofApproved(e.target.checked)}
            />
            <div className="approval-text">
              <span className="approval-label">
                I confirm this proof is accurate and ready for printing
              </span>
              <span className="approval-subtext">
                Changes cannot be made after the order is placed
              </span>
            </div>
          </label>

          <button className="edit-design-link" onClick={onBack}>
            ← Edit Design
          </button>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="order-summary-section">
        <div className="order-summary-card">
          <h3 className="order-summary-title">Order Summary</h3>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="security-badge">
                {securityLevel === 'maximum-security' && 'Maximum Security'}
                {securityLevel === 'minimum-security' && 'Minimum Security'}
                {securityLevel === 'no-security' && 'Standard'}
              </span>
              {!showChangeConfirm && (
                <button
                  className="change-link"
                  onClick={() => setShowChangeConfirm(true)}
                >
                  CHANGE
                </button>
              )}
            </div>
            <p className="product-meta">
              Arizona · {prescriberCount} Prescriber{prescriberCount !== 1 ? 's' : ''}
            </p>

            {showChangeConfirm && (
              <div className="change-confirm">
                <p className="change-confirm-text">
                  This will take you back one step, where you can change your pad type. No changes will be lost.
                </p>
                <div className="change-confirm-actions">
                  <button
                    className="confirm-btn confirm-btn--secondary"
                    onClick={() => setShowChangeConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm-btn confirm-btn--primary"
                    onClick={() => {
                      setShowChangeConfirm(false);
                      onBack();
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="divider" />

          {/* Quantity Selection */}
          <div className="order-field">
            <label className="field-label">Quantity (Pads)</label>
            <div className="quantity-buttons">
              {quantities.map((qty) => (
                <button
                  key={qty}
                  className={`quantity-btn ${quantity === qty ? 'quantity-btn--selected' : ''}`}
                  onClick={() => setQuantity(qty)}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Paper Type */}
          <div className="order-field">
            <div className="field-row">
              <span className="field-label">Paper</span>
              {!editingPaper ? (
                <div className="order-option-value">
                  <span>{paperType === 'carbonless-2' ? '2-Part Carbonless' : 'Single Ply'}</span>
                  <button className="edit-link" onClick={() => setEditingPaper(true)}>
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2 w-full p-3 bg-bg-subtle rounded-lg">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="paperType"
                      value="carbonless-2"
                      checked={paperType === 'carbonless-2'}
                      onChange={() => setPaperType('carbonless-2')}
                      className="accent-primary"
                    />
                    <span className="flex-1">2-Part Carbonless</span>
                    <span className="text-[10px] text-text-muted">+$25</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="paperType"
                      value="single"
                      checked={paperType === 'single'}
                      onChange={() => setPaperType('single')}
                      className="accent-primary"
                    />
                    <span className="flex-1">Single Ply</span>
                  </label>
                  <button className="edit-link text-right mt-1" onClick={() => setEditingPaper(false)}>Done</button>
                </div>
              )}
            </div>
          </div>

          {/* Production Time */}
          <div className="order-field">
            <div className="field-row">
              <span className="field-label">Production</span>
              {!editingProduction ? (
                <div className="order-option-value">
                  <span>{productionTime === 'standard' ? 'Standard (5-7 days)' : 'Rush (2-3 days)'}</span>
                  <button className="edit-link" onClick={() => setEditingProduction(true)}>
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2 w-full p-3 bg-bg-subtle rounded-lg">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="productionTime"
                      value="standard"
                      checked={productionTime === 'standard'}
                      onChange={() => setProductionTime('standard')}
                      className="accent-primary"
                    />
                    <span className="flex-1">Standard (5-7 days)</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="productionTime"
                      value="rush"
                      checked={productionTime === 'rush'}
                      onChange={() => setProductionTime('rush')}
                      className="accent-primary"
                    />
                    <span className="flex-1">Rush (2-3 days)</span>
                    <span className="text-[10px] text-text-muted">+$35</span>
                  </label>
                  <button className="edit-link text-right mt-1" onClick={() => setEditingProduction(false)}>Done</button>
                </div>
              )}
            </div>
          </div>

          <div className="divider" />

          {/* Price Breakdown */}
          <div className="mb-4">
            <div className="price-line">
              <span>{quantity} Pads</span>
              <span>${basePrice}</span>
            </div>
            {paperModifier > 0 && (
              <div className="price-line">
                <span>2-Part Carbonless</span>
                <span>+${paperModifier}</span>
              </div>
            )}
            {productionModifier > 0 && (
              <div className="price-line">
                <span>Rush Production</span>
                <span>+${productionModifier}</span>
              </div>
            )}
          </div>

          <div className="price-total">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="total-amount">${totalPrice}</span>
          </div>

          {/* Proceed to Checkout Button */}
          <button
            className="add-to-cart-btn"
            onClick={handleProceedToCheckout}
            disabled={!proofApproved}
          >
            <LockIcon className="btn-icon" />
            <span>Proceed to Checkout</span>
          </button>

          {!proofApproved && (
            <p className="approval-hint">
              Please approve your proof above to continue
            </p>
          )}

          <button className="download-link" onClick={handleDownloadPDF}>
            <DownloadIcon className="w-4 h-4" />
            Download PDF Proof
          </button>
        </div>
      </div>

      {isModalOpen && (
        <PreviewModal
          practices={practices}
          prescribers={prescribers}
          padOptions={padOptions}
          securityLevel={securityLevel}
          onClose={() => setIsModalOpen(false)}
        />
      )}

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
