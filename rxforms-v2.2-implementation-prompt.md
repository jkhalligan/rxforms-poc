# RxForms POC v2.2 - Implementation Prompt

## Overview

This prompt addresses:
1. Bug fixes from v2.1 (modal z-index, background color, border consistency)
2. Merge Review + Order into single "Review & Add to Cart" step
3. Simplify sidebar pricing in Steps 1-2
4. Smart defaults for paper type and production time

---

## Part 1: Bug Fixes

### 1A. Page Background Color

Change body/page background to `#F2F2F2` to make white cards pop.

```css
body {
  background-color: #F2F2F2;
}

/* Or using CSS variable */
:root {
  --color-bg-page: #F2F2F2;
}
```

### 1B. Consistent Card Header Styling

The Practice step has a blue left border accent on "Location 1" but Prescriber step doesn't have this on the accordion. Make consistent.

**Option A: Remove blue border from Practice step** (simpler, cleaner)
```css
/* Remove the blue left border accent */
.location-card-header {
  border-left: none;
}
```

**Option B: Add subtle accent to both** (if you want visual distinction)
```css
.form-card-header,
.accordion-header {
  /* Subtle left accent only when expanded/active */
}

.accordion--expanded .accordion-header {
  border-left: 3px solid var(--color-primary);
}
```

**Recommendation:** Option A — remove the blue border for cleaner look. The card structure itself provides enough visual hierarchy.

### 1C. Modal Z-Index Fix

The zoom modal is being overlapped by header/footer. Fix z-index stacking:

```css
/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Footer nav */
.footer-nav {
  position: fixed;
  bottom: 0;
  z-index: 100;
}

/* Modal overlay - must be higher than header/footer */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000; /* Higher than header/footer */
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  position: relative;
  z-index: 1001;
  background: white;
  border-radius: 0.75rem;
  max-width: 900px;
  width: 100%;
  max-height: calc(100vh - 4rem);
  overflow: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}
```

### 1D. Modal Content Cutoff

The preview is being cut off. Ensure the modal preview maintains aspect ratio and is fully visible:

```css
.modal-preview {
  margin: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  aspect-ratio: 1.294; /* 5.5 / 4.25 */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Ensure SVG scales properly */
.modal-preview svg {
  width: 100%;
  height: 100%;
}
```

Also, add some padding to the modal content to prevent edge cutoff:

```css
.modal-content {
  margin: 1rem; /* Breathing room from viewport edges */
}
```

---

## Part 2: Simplify Sidebar Pricing (Steps 1-2)

### Current State
Full pricing expandable with quantity matrix visible.

### New State
Simpler, less overwhelming — just show starting price with security level context.

```jsx
// In PreviewPanel.jsx for Steps 1-2 only
<div className="pricing-simple">
  <div className="pricing-amount">
    Starting at <strong>${currentPrice}</strong>
  </div>
  <div className="pricing-context">
    for 8 pads · {securityLevelName}
  </div>
</div>
```

```css
.pricing-simple {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.pricing-amount {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.pricing-amount strong {
  font-size: 1.25rem;
  color: var(--color-text-primary);
}

.pricing-context {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}
```

**Remove:** The expandable pricing table from Steps 1-2. It will appear on the final step where it's relevant.

---

## Part 3: Merge Review + Order Steps

### Navigation Update

Change from 4 steps to 3 steps:

```jsx
const steps = [
  { id: 'practice', label: 'Practice' },
  { id: 'prescribers', label: 'Prescribers' },
  { id: 'review', label: 'Review & Order' }, // Merged step
];
```

### New Component: ReviewAndOrder.jsx

```jsx
import { useState } from 'react';

function ReviewAndOrder({
  practices,
  prescribers,
  padOptions,
  securityLevel,
  onBack,
  onAddToCart,
}) {
  const [quantity, setQuantity] = useState(8);
  const [paperType, setPaperType] = useState('carbonless-2'); // Default: 2-part (81% of orders)
  const [productionTime, setProductionTime] = useState('standard');
  const [proofApproved, setProofApproved] = useState(false);
  const [editingPaper, setEditingPaper] = useState(false);
  const [editingProduction, setEditingProduction] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pricing calculation
  const basePrice = arizonaPricing[securityLevel].prices[quantity];
  const paperModifier = paperType === 'carbonless-2' ? 25 : 0;
  const productionModifier = productionTime === 'rush' ? 35 : 0;
  const totalPrice = basePrice + paperModifier + productionModifier;

  const quantities = [8, 16, 24, 40, 80];

  const handleAddToCart = () => {
    if (!proofApproved) return;
    onAddToCart({
      practices,
      prescribers,
      padOptions,
      securityLevel,
      quantity,
      paperType,
      productionTime,
      totalPrice,
    });
  };

  return (
    <div className="review-order-container">
      {/* Left Column - Proof */}
      <div className="review-proof-column">
        <div className="proof-section">
          <h2 className="section-title">Review Your Proof</h2>
          <p className="section-subtitle">
            Please verify all details are correct before adding to cart.
          </p>

          {/* Large Preview */}
          <div
            className={`proof-preview preview-bg--${securityLevel}`}
            onClick={() => setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Click to enlarge preview"
          >
            <PrescriptionPadSVG
              practices={practices}
              prescribers={prescribers}
              padOptions={padOptions}
              securityLevel={securityLevel}
            />
            <div className="proof-zoom-hint">
              <ZoomInIcon />
              <span>Click to enlarge</span>
            </div>
          </div>

          {/* Approval Checkbox */}
          <label className="approval-checkbox">
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

          {/* Edit Design Link */}
          <button className="edit-design-link" onClick={onBack}>
            ← Edit Design
          </button>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="order-summary-column">
        <div className="order-summary-card">
          <h3 className="order-summary-title">Order Summary</h3>

          {/* Product Info */}
          <div className="order-product-info">
            <div className="product-badge">
              {securityLevel === 'maximum-security' && 'Maximum Security'}
              {securityLevel === 'minimum-security' && 'Minimum Security'}
              {securityLevel === 'no-security' && 'Standard'}
            </div>
            <p className="product-details">
              Arizona · {prescribers.filter(p => p.name).length} Prescriber
              {prescribers.filter(p => p.name).length !== 1 ? 's' : ''}
              {padOptions.startingNumber !== '0001' && ` · Starting #${padOptions.startingNumber}`}
            </p>
          </div>

          <div className="order-divider" />

          {/* Quantity Selection */}
          <div className="order-section">
            <label className="order-section-label">Quantity (Pads)</label>
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

          <div className="order-divider" />

          {/* Paper Type - Pre-selected with Edit */}
          <div className="order-section">
            <div className="order-option-row">
              <span className="order-option-label">Paper</span>
              {!editingPaper ? (
                <div className="order-option-value">
                  <span>{paperType === 'carbonless-2' ? '2-Part Carbonless' : 'Single Ply'}</span>
                  <button 
                    className="edit-link"
                    onClick={() => setEditingPaper(true)}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="order-option-edit">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="paperType"
                      value="carbonless-2"
                      checked={paperType === 'carbonless-2'}
                      onChange={() => setPaperType('carbonless-2')}
                    />
                    <span>2-Part Carbonless</span>
                    <span className="option-meta">50 scripts/pad · +$25</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="paperType"
                      value="single"
                      checked={paperType === 'single'}
                      onChange={() => setPaperType('single')}
                    />
                    <span>Single Ply</span>
                    <span className="option-meta">100 scripts/pad</span>
                  </label>
                  <button 
                    className="done-link"
                    onClick={() => setEditingPaper(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Production Time - Pre-selected with Edit */}
          <div className="order-section">
            <div className="order-option-row">
              <span className="order-option-label">Production</span>
              {!editingProduction ? (
                <div className="order-option-value">
                  <span>{productionTime === 'standard' ? 'Standard (5-7 days)' : 'Rush (2-3 days)'}</span>
                  <button 
                    className="edit-link"
                    onClick={() => setEditingProduction(true)}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="order-option-edit">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="productionTime"
                      value="standard"
                      checked={productionTime === 'standard'}
                      onChange={() => setProductionTime('standard')}
                    />
                    <span>Standard</span>
                    <span className="option-meta">5-7 business days</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="productionTime"
                      value="rush"
                      checked={productionTime === 'rush'}
                      onChange={() => setProductionTime('rush')}
                    />
                    <span>Rush</span>
                    <span className="option-meta">2-3 business days · +$35</span>
                  </label>
                  <button 
                    className="done-link"
                    onClick={() => setEditingProduction(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="order-divider" />

          {/* Price Breakdown */}
          <div className="price-breakdown">
            <div className="price-line">
              <span>{quantity} Pads ({securityLevel === 'maximum-security' ? 'Max' : securityLevel === 'minimum-security' ? 'Min' : 'Std'} Security)</span>
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
            <span>Total</span>
            <span className="total-amount">${totalPrice}</span>
          </div>

          {/* Add to Cart Button */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!proofApproved}
          >
            <LockIcon className="lock-icon" />
            Add to Cart · ${totalPrice}
          </button>

          {!proofApproved && (
            <p className="cart-hint">
              Please approve your proof above to continue
            </p>
          )}

          {/* Download PDF */}
          <button className="download-proof-link" onClick={handleDownloadPDF}>
            <DownloadIcon />
            Download PDF Proof
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {isModalOpen && (
        <PreviewModal
          practices={practices}
          prescribers={prescribers}
          padOptions={padOptions}
          securityLevel={securityLevel}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
```

### Styles for ReviewAndOrder

```css
/* Container - Two column layout */
.review-order-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  padding-bottom: 2rem;
}

/* Left Column - Proof */
.review-proof-column {
  /* No sticky - let it flow naturally */
}

.proof-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.section-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

/* Proof Preview */
.proof-preview {
  position: relative;
  aspect-ratio: 1.294;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.15s;
}

.proof-preview:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.proof-preview svg {
  width: 100%;
  height: 100%;
}

.proof-zoom-hint {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 2rem;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.15s;
}

.proof-preview:hover .proof-zoom-hint {
  opacity: 1;
}

.proof-zoom-hint svg {
  width: 14px;
  height: 14px;
}

/* Background classes for security levels */
.preview-bg--maximum-security {
  background-image: url('/assets/backgrounds/maximum-security.png');
}

.preview-bg--minimum-security {
  background-image: url('/assets/backgrounds/minimum-security.png');
}

.preview-bg--no-security {
  background-image: url('/assets/backgrounds/no-security.png');
}

/* Approval Checkbox */
.approval-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #FAFAFA;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
}

.approval-checkbox input {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  accent-color: var(--color-primary);
}

.approval-text {
  display: flex;
  flex-direction: column;
}

.approval-label {
  font-weight: 500;
  color: var(--color-text-primary);
}

.approval-subtext {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

/* Edit Design Link */
.edit-design-link {
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  padding: 0;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
}

.edit-design-link:hover {
  color: var(--color-primary);
}

/* Right Column - Order Summary */
.order-summary-column {
  /* Sticky on desktop */
  position: sticky;
  top: 5rem;
  align-self: start;
}

.order-summary-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.order-summary-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

/* Product Info */
.order-product-info {
  margin-bottom: 1rem;
}

.product-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.product-details {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
}

/* Dividers */
.order-divider {
  height: 1px;
  background: var(--color-border);
  margin: 1rem 0;
}

/* Order Sections */
.order-section {
  margin-bottom: 0.5rem;
}

.order-section-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

/* Quantity Buttons */
.quantity-buttons {
  display: flex;
  gap: 0.5rem;
}

.quantity-btn {
  flex: 1;
  padding: 0.75rem 0.5rem;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.quantity-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.quantity-btn--selected {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* Order Option Row (Paper/Production) */
.order-option-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.order-option-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.order-option-value {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: right;
}

.order-option-value span {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.edit-link,
.done-link {
  padding: 0;
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.75rem;
  cursor: pointer;
}

.edit-link:hover,
.done-link:hover {
  text-decoration: underline;
}

/* Expanded Edit Options */
.order-option-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--color-bg-subtle);
  border-radius: 0.375rem;
  margin-top: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.radio-option input {
  accent-color: var(--color-primary);
}

.option-meta {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-left: auto;
}

/* Price Breakdown */
.price-breakdown {
  margin-bottom: 0.75rem;
}

.price-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  padding: 0.25rem 0;
}

.price-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
  margin-bottom: 1rem;
}

.price-total span:first-child {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

/* Add to Cart Button */
.add-to-cart-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.add-to-cart-btn:disabled {
  background: #CBD5E1;
  cursor: not-allowed;
}

.lock-icon {
  width: 16px;
  height: 16px;
}

.cart-hint {
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.75rem;
}

/* Download PDF Link */
.download-proof-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
}

.download-proof-link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.download-proof-link svg {
  width: 16px;
  height: 16px;
}

/* Mobile Responsive */
@media (max-width: 900px) {
  .review-order-container {
    grid-template-columns: 1fr;
  }

  .order-summary-column {
    position: relative;
    top: 0;
  }
}
```

---

## Part 4: Remove Footer Nav on Final Step

Since the merged step has inline navigation (Edit Design link, Add to Cart button), remove the fixed footer on this step:

```jsx
// In App.jsx or layout component
{currentStep !== 'review' && (
  <FooterNav
    onBack={handleBack}
    onContinue={handleContinue}
    // ...
  />
)}
```

Or conditionally render nothing in footer for review step:

```jsx
// FooterNav.jsx
if (currentStep === 'review') {
  return null;
}
```

---

## Part 5: Update App.jsx Flow

```jsx
// Update steps
const steps = [
  { id: 'practice', label: 'Practice' },
  { id: 'prescribers', label: 'Prescribers' },
  { id: 'review', label: 'Review & Order' },
];

// Remove 'order' step from navigation logic
// The 'review' step now handles everything

// Handle Add to Cart
const handleAddToCart = (orderData) => {
  console.log('Adding to cart:', orderData);
  // In real implementation: redirect to checkout
  // For POC: show success message or modal
  alert(`Added to cart! Total: $${orderData.totalPrice}`);
};

// Render
{currentStep === 'review' && (
  <ReviewAndOrder
    practices={practices}
    prescribers={prescribers}
    padOptions={padOptions}
    securityLevel={securityLevel}
    onBack={() => setCurrentStep('prescribers')}
    onAddToCart={handleAddToCart}
  />
)}
```

---

## Part 6: Optional Trust Elements

If desired, add subtle trust signals:

### Lock Icon on Button
Already included in the Add to Cart button spec above.

### Secure Order Text (Optional)
```jsx
<p className="secure-text">
  <LockIcon /> Secure checkout powered by Stripe
</p>
```

```css
.secure-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

.secure-text svg {
  width: 12px;
  height: 12px;
}
```

### Since 1998 Badge (Optional)
```jsx
<div className="trust-badge">
  Trusted by medical professionals since 1998
</div>
```

---

## Testing Checklist

### Bug Fixes
- [ ] Page background is #F2F2F2
- [ ] White cards pop against gray background
- [ ] Blue border accent is consistent (or removed) across steps
- [ ] Modal overlay covers entire viewport including header/footer
- [ ] Modal content is fully visible, not cut off
- [ ] ESC key closes modal
- [ ] Clicking overlay closes modal

### Merged Review + Order Step
- [ ] Only 3 steps in navigation (Practice, Prescribers, Review & Order)
- [ ] Large proof preview displays correctly
- [ ] Click on proof opens zoom modal
- [ ] Approval checkbox enables Add to Cart button
- [ ] Quantity buttons work correctly
- [ ] Paper type defaults to 2-Part Carbonless
- [ ] Paper type "Edit" expands inline options
- [ ] Production time defaults to Standard
- [ ] Production time "Edit" expands inline options
- [ ] Price breakdown updates dynamically
- [ ] Total updates with quantity and options
- [ ] Add to Cart button shows padlock icon
- [ ] Add to Cart disabled until proof approved
- [ ] Download PDF Proof link works
- [ ] "Edit Design" returns to Prescribers step
- [ ] No footer nav on final step

### Sidebar Simplification (Steps 1-2)
- [ ] Pricing shows only "Starting at $X for 8 pads"
- [ ] No expandable pricing table in Steps 1-2
- [ ] Security level toggle still works
- [ ] Security level hint text displays

---

## Files to Create/Modify

### Create
- `src/components/ReviewAndOrder/ReviewAndOrder.jsx`
- `src/components/ReviewAndOrder/ReviewAndOrder.css` (or add to main CSS)

### Modify
- `src/App.jsx` — Update steps array, add ReviewAndOrder, remove Order step
- `src/App.css` — Add new styles, fix modal z-index, add page background
- `src/components/Preview/PreviewPanel.jsx` — Simplify pricing for Steps 1-2
- `src/components/Preview/PreviewModal.jsx` — Fix z-index and overflow
- `src/components/Header/Header.jsx` — Update to 3 steps (if steps defined there)
- `src/components/FooterNav/FooterNav.jsx` — Hide on review step

### Delete (or deprecate)
- `src/components/Order/OrderOptions.jsx` — Functionality merged into ReviewAndOrder
- `src/components/Review/ProofApproval.jsx` — Functionality merged into ReviewAndOrder

---

## Color Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#006FFF` | Buttons, links, active states |
| `--color-primary-hover` | `#0059CC` | Button hover states |
| `--color-primary-light` | `#E6F0FF` | Light backgrounds, badges |
| `--color-bg-page` | `#F2F2F2` | Page background |
| `--color-bg-card` | `#FFFFFF` | Cards, panels, modals |
| `--color-bg-subtle` | `#FAFAFA` | Input backgrounds, subtle sections |
| `--color-text-primary` | `#1A1A2E` | Headings, body text |
| `--color-text-secondary` | `#4A5568` | Secondary text |
| `--color-text-muted` | `#9CA3AF` | Hints, labels |
| `--color-border` | `#E2E8F0` | Card borders, dividers |
