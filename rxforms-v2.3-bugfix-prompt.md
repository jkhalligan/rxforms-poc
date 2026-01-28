# RxForms POC v2.3 - Bug Fix Prompt

## Overview

This prompt addresses styling bugs discovered in v2.2. The core functionality is working, but CSS/styling issues need to be fixed.

---

## 1. Apply Color Palette Consistently

The specified colors from v2.1 were not fully applied. Ensure these CSS variables are defined at the root level and used throughout:

```css
:root {
  /* Primary - RxForms brand blue */
  --color-primary: #006FFF;
  --color-primary-hover: #0059CC;
  --color-primary-light: #E6F0FF;
  
  /* Backgrounds */
  --color-bg-page: #F2F2F2;
  --color-bg-card: #FFFFFF;
  --color-bg-subtle: #FAFAFA;
  
  /* Text */
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #4A5568;
  --color-text-muted: #9CA3AF;
  
  /* Borders */
  --color-border: #E2E8F0;
  --color-border-light: #F1F5F9;
  
  /* Status */
  --color-success: #059669;
  --color-error: #DC2626;
}

/* Apply page background */
body {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
}

/* Buttons using primary color */
.btn-primary,
button[type="submit"],
.continue-btn {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
}

/* Links */
a,
.edit-link,
.text-link {
  color: var(--color-primary);
}

/* Active nav step */
.progress-step--current {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}
```

**Verification:** After applying, the page background should be light gray (#F2F2F2), and all blue elements should be #006FFF.

---

## 2. Fix Review & Order Step Layout

### 2A. Quantity Buttons Bug

**Problem:** Buttons showing as "816244080" instead of separate buttons.

**Cause:** Likely missing CSS for the quantity button container, or buttons not rendering as flex children.

```jsx
// Ensure the JSX structure is correct:
<div className="quantity-buttons">
  {[8, 16, 24, 40, 80].map((qty) => (
    <button
      key={qty}
      className={`quantity-btn ${quantity === qty ? 'quantity-btn--selected' : ''}`}
      onClick={() => setQuantity(qty)}
    >
      {qty}
    </button>
  ))}
</div>
```

```css
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
  min-width: 48px;
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
```

### 2B. Text Running Together

**Problem:** "2-Part CarbonlessEdit" and "8 Pads$135" have no spacing.

**Fix:** Add proper spacing in JSX and CSS:

```jsx
// Paper option display
<div className="order-option-value">
  <span>2-Part Carbonless</span>
  <button className="edit-link">Edit</button>
</div>

// Price breakdown
<div className="price-line">
  <span>8 Pads</span>
  <span>${basePrice}</span>
</div>
```

```css
.order-option-value {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Space between value and Edit link */
}

.price-line {
  display: flex;
  justify-content: space-between;
  padding: 0.375rem 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.price-line span:last-child {
  font-weight: 500;
}
```

### 2C. Approval Checkbox Text

**Problem:** "printingChanges" running together.

**Fix:** Ensure line break or proper structure:

```jsx
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
```

```css
.approval-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
}

.approval-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.approval-label {
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.approval-subtext {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
```

### 2D. Lock Icon & Add to Cart Button

**Problem:** Lock icon is huge and disconnected from button styling.

**Fix:**

```jsx
<button
  className="add-to-cart-btn"
  onClick={handleAddToCart}
  disabled={!proofApproved}
>
  <LockIcon className="btn-icon" />
  <span>Add to Cart · ${totalPrice}</span>
</button>
```

```css
.add-to-cart-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
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

.add-to-cart-btn .btn-icon {
  width: 18px;
  height: 18px;
}
```

If using an SVG or icon component, ensure it's sized correctly:

```jsx
// If using Lucide or similar
import { Lock } from 'lucide-react';

<Lock size={18} />
```

### 2E. Order Summary Card Styling

**Problem:** Right column lacks proper card styling.

```css
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
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}
```

---

## 3. Fix Modal Z-Index (Footer Still Showing)

**Problem:** The footer "CONTINUE" button is visible behind/over the modal.

**Fix:** Increase modal z-index and ensure body scroll is locked:

```css
/* Modal must be above everything */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999; /* Very high to ensure it's on top */
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  position: relative;
  z-index: 10000;
  background: white;
  border-radius: 0.75rem;
  max-width: 900px;
  width: 100%;
  max-height: calc(100vh - 4rem);
  overflow: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

/* Header and footer should be lower */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.footer-nav {
  position: fixed;
  bottom: 0;
  z-index: 100;
}
```

**Also add body scroll lock when modal is open:**

```jsx
// In PreviewModal.jsx or wherever modal state is managed
useEffect(() => {
  if (isModalOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  
  return () => {
    document.body.style.overflow = '';
  };
}, [isModalOpen]);
```

---

## 4. Review & Order Step - Overall Structure Fix

The entire Review & Order step needs proper container structure:

```jsx
function ReviewAndOrder({ /* props */ }) {
  return (
    <div className="review-order-layout">
      {/* Left Column - Proof */}
      <div className="review-proof-section">
        <div className="proof-card">
          <h2 className="proof-title">Review Your Proof</h2>
          <p className="proof-subtitle">
            Please verify all details are correct before adding to cart.
          </p>
          
          {/* Preview */}
          <div 
            className={`proof-preview preview-bg--${securityLevel}`}
            onClick={() => setIsModalOpen(true)}
          >
            <PrescriptionPadSVG {...props} />
          </div>
          
          {/* Approval */}
          <label className="approval-checkbox">
            <input type="checkbox" checked={proofApproved} onChange={...} />
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
          
          {/* Product badge */}
          <div className="product-info">
            <span className="security-badge">Maximum Security</span>
            <p className="product-meta">Arizona · 1 Prescriber</p>
          </div>
          
          <div className="divider" />
          
          {/* Quantity */}
          <div className="order-field">
            <label className="field-label">Quantity (Pads)</label>
            <div className="quantity-buttons">
              {[8, 16, 24, 40, 80].map((qty) => (
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
          
          {/* Paper */}
          <div className="order-field">
            <div className="field-row">
              <span className="field-label">Paper</span>
              <div className="field-value">
                <span>{paperType === 'carbonless-2' ? '2-Part Carbonless' : 'Single Ply'}</span>
                <button className="edit-link" onClick={() => setEditingPaper(true)}>
                  Edit
                </button>
              </div>
            </div>
            {/* Expanded edit UI if editingPaper */}
          </div>
          
          {/* Production */}
          <div className="order-field">
            <div className="field-row">
              <span className="field-label">Production</span>
              <div className="field-value">
                <span>{productionTime === 'standard' ? 'Standard (5-7 days)' : 'Rush (2-3 days)'}</span>
                <button className="edit-link" onClick={() => setEditingProduction(true)}>
                  Edit
                </button>
              </div>
            </div>
          </div>
          
          <div className="divider" />
          
          {/* Price breakdown */}
          <div className="price-breakdown">
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
            <span>Total</span>
            <span className="total-amount">${totalPrice}</span>
          </div>
          
          {/* Add to Cart */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!proofApproved}
          >
            <Lock size={18} />
            <span>Add to Cart · ${totalPrice}</span>
          </button>
          
          {!proofApproved && (
            <p className="approval-hint">
              Please approve your proof above to continue
            </p>
          )}
          
          {/* Download PDF */}
          <button className="download-link">
            <Download size={16} />
            Download PDF Proof
          </button>
        </div>
      </div>
    </div>
  );
}
```

```css
/* Layout */
.review-order-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Left column */
.proof-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.proof-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.proof-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.proof-preview {
  aspect-ratio: 1.294;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-design-link {
  display: inline-block;
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

/* Right column */
.order-summary-section {
  position: sticky;
  top: 5rem;
  align-self: start;
}

/* Dividers */
.divider {
  height: 1px;
  background: var(--color-border);
  margin: 1rem 0;
}

/* Fields */
.order-field {
  margin-bottom: 0.5rem;
}

.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-row .field-label {
  margin-bottom: 0;
}

.field-value {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.field-value span {
  font-weight: 500;
  color: var(--color-text-primary);
}

.edit-link {
  padding: 0;
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.75rem;
  cursor: pointer;
}

.edit-link:hover {
  text-decoration: underline;
}

/* Price */
.price-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border);
  margin-top: 0.5rem;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

/* Hint text */
.approval-hint {
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.75rem;
}

/* Download link */
.download-link {
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
}

.download-link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Security badge */
.security-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 1rem;
}

.product-meta {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 900px) {
  .review-order-layout {
    grid-template-columns: 1fr;
  }
  
  .order-summary-section {
    position: relative;
    top: 0;
  }
}
```

---

## Testing Checklist

- [ ] Page background is #F2F2F2 (light gray)
- [ ] Primary blue is #006FFF (check buttons, links, active states)
- [ ] White cards pop against gray background
- [ ] Quantity buttons display as 5 separate clickable buttons: 8, 16, 24, 40, 80
- [ ] "2-Part Carbonless" and "Edit" have proper spacing
- [ ] Price breakdown shows "8 Pads" and "$135" on same line with space
- [ ] Total shows as "Total" and "$160" properly spaced
- [ ] Approval checkbox text wraps properly on two lines
- [ ] Lock icon is small (18px) and inline with button text
- [ ] Add to Cart button is properly styled (blue, full width)
- [ ] Modal covers entire screen including header and footer
- [ ] Modal preview is not cut off
- [ ] Body scroll is locked when modal is open
- [ ] Order summary card has white background and border

---

## Files to Modify

1. `src/App.css` or `src/index.css` — Add/verify CSS variables at :root
2. `src/components/ReviewAndOrder/ReviewAndOrder.jsx` — Fix JSX structure
3. `src/components/ReviewAndOrder/ReviewAndOrder.css` — Fix all styling
4. `src/components/Preview/PreviewModal.jsx` — Fix z-index, add scroll lock
5. Verify Tailwind config if using Tailwind — ensure custom colors are defined
