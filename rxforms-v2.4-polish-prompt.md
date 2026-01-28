# RxForms POC v2.4 - Final Polish & UX Refinements

## Overview

This prompt addresses the final round of polish items identified in v2.3 review.

**Changes:**
1. Remove "POC" from header logo
2. Fix background color (ensure #F2F2F2 is applied)
3. Clarify card border behavior (accordions vs static cards)
4. Add attention-drawing animation to approval checkbox
5. Relocate/redesign state indicator ("Arizona")
6. Enhance security level selection UX
7. Fix modal sizing and z-index issues

---

## 1. Remove "POC" from Header

```jsx
// In Header.jsx, change:
<span className="logo-text">RxForms <span className="logo-suffix">POC</span></span>

// To:
<span className="logo-text">RxForms</span>
```

And remove the `.logo-suffix` CSS if no longer needed.

---

## 2. Fix Background Color

The background color is not being applied consistently. Ensure this is set at the highest level:

```css
/* In index.css or App.css - at the TOP of the file */
:root {
  --color-bg-page: #F2F2F2;
}

/* Apply to html and body to ensure coverage */
html {
  background-color: #F2F2F2;
  background-color: var(--color-bg-page);
}

body {
  background-color: #F2F2F2;
  background-color: var(--color-bg-page);
  min-height: 100vh;
}

/* If using Tailwind, you may need to override in tailwind.config.js */
/* Or add this with !important as a last resort */
body {
  background-color: #F2F2F2 !important;
}

/* Also ensure the main content area has transparent background */
.app-container,
.main-content,
#root {
  background-color: transparent;
}
```

**Verification:** The space around the white cards should be visibly gray (#F2F2F2), not white.

---

## 3. Card Border Behavior - Clarification

**Design Rule:**
- **Accordions (expandable, can have multiples):** Blue left border when expanded, red when has errors
- **Static cards (always visible, single instance):** No colored border, just standard gray border

**What should be accordions:**
- **Locations** — Can have multiple (up to 2), so accordion pattern with blue border
- **Prescribers** — Can have multiple (up to 6), so accordion pattern with blue border

**What should be static cards:**
- **Pad Options** — Single instance, always visible, no accordion needed

**Implementation:**

```css
/* Static cards - no accent border */
.form-card,
.pad-options-card,
.order-summary-card,
.proof-card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

/* Accordions - accent border when expanded */
.accordion {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: border-color 0.15s;
}

.accordion--expanded {
  border-left: 3px solid var(--color-primary);
}

.accordion--error {
  border-left: 3px solid var(--color-error);
}
```

**Note:** The Location cards on Step 1 should follow the same accordion pattern as Prescribers on Step 2. If there's only one location, it's expanded by default. The blue border indicates "this is the active/expanded item."
```

---

## 4. Approval Checkbox Animation

Add a subtle pulsing animation to draw attention to the unchecked approval box:

```css
/* Pulsing border animation */
@keyframes pulse-attention {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 111, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(0, 111, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 111, 255, 0);
  }
}

.approval-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #FAFAFA;
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

/* Unchecked state - animated to draw attention */
.approval-checkbox:not(.is-approved) {
  border-color: var(--color-primary);
  animation: pulse-attention 2s ease-out infinite;
}

/* Hover state when unchecked */
.approval-checkbox:not(.is-approved):hover {
  background: var(--color-primary-light);
}

/* Checked/approved state - no animation, green accent */
.approval-checkbox.is-approved {
  border-color: var(--color-success);
  background: #F0FDF4; /* Light green */
  animation: none;
}
```

```jsx
// In ReviewAndOrder.jsx
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
```

---

## 5. Relocate State Indicator

**Remove** from header right side. **Add** to preview panel title.

```jsx
// In Header.jsx - REMOVE:
<div className="header-context">
  ARIZONA RX PADS
</div>

// In PreviewPanel.jsx - UPDATE title:
<div className="preview-header">
  <span className="preview-label">Your Arizona Prescription Pad</span>
  <button className="preview-enlarge-btn" onClick={onEnlarge}>
    <ExpandIcon size={14} />
    Enlarge
  </button>
</div>
```

**Alternative for Review step** (where we don't show the preview panel):

The state is already shown in the Order Summary as "Arizona · 1 Prescriber", which is sufficient context.

---

## 6. Enhance Security Level Selection UX

### 6A. Keep sidebar toggle as-is, add "Help me decide" expandable

The current toggle works well. Don't add tooltips. Just add an expandable help section below:

```jsx
// In PreviewPanel.jsx
<div className="security-section">
  <label className="security-label">Security Level</label>
  
  <div className="security-toggle">
    {['maximum-security', 'minimum-security', 'no-security'].map((level) => (
      <button
        key={level}
        className={`security-option ${securityLevel === level ? 'security-option--selected' : ''}`}
        onClick={() => setSecurityLevel(level)}
      >
        {level === 'maximum-security' && 'Maximum'}
        {level === 'minimum-security' && 'Minimum'}
        {level === 'no-security' && 'Standard'}
      </button>
    ))}
  </div>
  
  <p className="security-hint">
    {securityLevel === 'maximum-security' && 'Required for controlled substances (Schedule II-V)'}
    {securityLevel === 'minimum-security' && 'Meets federal Medicaid tamper-resistant requirements'}
    {securityLevel === 'no-security' && 'For non-controlled, non-Medicaid prescriptions'}
  </p>
  
  {/* Help me decide - expandable */}
  <button 
    className="help-expand-btn"
    onClick={() => setShowSecurityHelp(!showSecurityHelp)}
  >
    {showSecurityHelp ? '− Hide guidance' : '+ Help me decide'}
  </button>
  
  {showSecurityHelp && (
    <div className="security-help-panel">
      <ul>
        <li>
          <strong>Maximum Security</strong>
          <span>Required by law for prescribing controlled substances. Includes microprint, sequential numbering, and tamper-evident features.</span>
        </li>
        <li>
          <strong>Minimum Security</strong>
          <span>Meets federal requirements for Medicaid prescriptions. Good for general practice without controlled substances.</span>
        </li>
        <li>
          <strong>Standard</strong>
          <span>For private-pay patients and non-controlled prescriptions. Most economical option.</span>
        </li>
      </ul>
      <p className="help-note">Not sure? Maximum Security works for all prescription types.</p>
    </div>
  )}
</div>
```

```css
.help-expand-btn {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.75rem;
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.8125rem;
  cursor: pointer;
  text-align: center;
}

.help-expand-btn:hover {
  text-decoration: underline;
}

.security-help-panel {
  margin-top: 0.75rem;
  padding: 1rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.8125rem;
}

.security-help-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.security-help-panel li {
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--color-border-light);
}

.security-help-panel li:last-child {
  border-bottom: none;
}

.security-help-panel li strong {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.security-help-panel li span {
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.help-note {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-style: italic;
}
```

### 6B. Add security level indicator next to Continue button (Steps 1-2)

Show the current selection in the footer navigation area:

```jsx
// In FooterNav.jsx
function FooterNav({ onBack, onContinue, backLabel, continueLabel, continueDisabled, securityLevel }) {
  return (
    <footer className="footer-nav">
      <div className="footer-nav-content">
        {onBack ? (
          <button onClick={onBack} className="btn btn-secondary">
            ← {backLabel || 'Back'}
          </button>
        ) : (
          <div /> /* Spacer */
        )}
        
        <div className="footer-right">
          {securityLevel && (
            <span className="security-indicator">
              {securityLevel === 'maximum-security' && 'Maximum Security selected'}
              {securityLevel === 'minimum-security' && 'Minimum Security selected'}
              {securityLevel === 'no-security' && 'Standard selected'}
            </span>
          )}
          <button 
            onClick={onContinue} 
            disabled={continueDisabled}
            className="btn btn-primary"
          >
            {continueLabel || 'Continue'} →
          </button>
        </div>
      </div>
    </footer>
  );
}
```

```css
.footer-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.security-indicator {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
```

### 6C. Add background highlight to selected security option

Make the selected option more visually distinct:

```css
.security-option {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--color-text-secondary);
}

.security-option:hover:not(.security-option--selected) {
  background: var(--color-bg-subtle);
}

.security-option--selected {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
  /* Add subtle border to make it pop */
  box-shadow: inset 0 0 0 1px var(--color-primary);
}
```

### 6D. Review step - Change links back to edit, doesn't change proof in place

On the Review & Order step, the security level is displayed but changing it returns to the previous step:

```jsx
// In ReviewAndOrder.jsx - in Order Summary section
<div className="order-product-info">
  <div className="security-badge-row">
    <span className="security-badge">
      {securityLevel === 'maximum-security' && 'Maximum Security'}
      {securityLevel === 'minimum-security' && 'Minimum Security'}
      {securityLevel === 'no-security' && 'Standard'}
    </span>
    <button 
      className="change-link"
      onClick={handleChangeSecurityLevel}
    >
      Change
    </button>
  </div>
  
  <p className="product-details">
    Arizona · {prescriberCount} Prescriber{prescriberCount !== 1 ? 's' : ''}
  </p>
</div>

// Handler - goes back to edit, doesn't change in place
const handleChangeSecurityLevel = () => {
  // Navigate back to Prescribers step (or Practice step)
  // User can change security level there and return
  onBack(); // This should go to Prescribers step
};
```

```css
.security-badge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.security-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 1rem;
}

.change-link {
  padding: 0;
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.75rem;
  cursor: pointer;
}

.change-link:hover {
  text-decoration: underline;
}
```

**Key principle:** The Review step is for PROOFING what was decided. If they want to change the security level, they go back to where that decision is made. This keeps the proof stable and prevents confusion about "wait, did my proof just change?"
```

---

## 7. Fix Modal Sizing and Z-Index

### Complete modal CSS rewrite:

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* Modal Content Container */
.modal-content {
  position: relative;
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 750px; /* Slightly smaller to fit laptops */
  max-height: calc(100vh - 3rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

/* Modal Header - Fixed at top */
.modal-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: white;
  z-index: 10; /* Above content */
}

.modal-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-subtle);
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s;
}

.modal-close:hover {
  background: var(--color-border);
}

/* Modal Body - Contains the preview */
.modal-body {
  flex: 1;
  padding: 1.5rem;
  overflow: hidden; /* No scroll - preview must fit */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Preview Container - Maintains aspect ratio */
.modal-preview-container {
  width: 100%;
  max-width: 100%;
  aspect-ratio: 1.294; /* 5.5 / 4.25 */
  border-radius: 0.5rem;
  overflow: hidden;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Background classes */
.modal-preview-container.preview-bg--maximum-security {
  background-image: url('/assets/backgrounds/maximum-security.png');
}

.modal-preview-container.preview-bg--minimum-security {
  background-image: url('/assets/backgrounds/minimum-security.png');
}

.modal-preview-container.preview-bg--no-security {
  background-image: url('/assets/backgrounds/no-security.png');
}

/* SVG inside preview */
.modal-preview-container svg {
  width: 100%;
  height: 100%;
}

/* Modal Footer */
.modal-footer {
  flex-shrink: 0;
  padding: 0.875rem 1.5rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-subtle);
}

.modal-footer p {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
}

/* Responsive - smaller screens */
@media (max-height: 700px) {
  .modal-content {
    max-width: 600px;
  }
  
  .modal-body {
    padding: 1rem;
  }
}
```

### Modal Component Update:

```jsx
function PreviewModal({ practices, prescribers, padOptions, securityLevel, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Preview Your Prescription Pad</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className={`modal-preview-container preview-bg--${securityLevel}`}>
            <PrescriptionPadSVG
              practices={practices}
              prescribers={prescribers}
              padOptions={padOptions}
              securityLevel={securityLevel}
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <p>
            This preview shows exactly how your prescription pad will appear. 
            Security backgrounds are for demonstration.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] "POC" removed from header logo
- [ ] Page background is #F2F2F2 (gray visible around white cards)
- [ ] Location cards use accordion pattern with blue left border when expanded
- [ ] Prescriber accordion has blue left border when expanded
- [ ] Prescriber accordion has red left border when has validation errors
- [ ] Pad Options card has NO colored border (static card)
- [ ] Approval checkbox pulses with blue glow when unchecked
- [ ] Approval checkbox turns green border when checked, animation stops
- [ ] "ARIZONA RX PADS" removed from header right side
- [ ] Preview panel title reads "Your Arizona Prescription Pad"
- [ ] Security toggle has "+ Help me decide" expandable section
- [ ] Clicking "Help me decide" expands guidance panel
- [ ] Selected security option has blue background highlight
- [ ] Footer shows "Maximum Security selected" (or equivalent) next to Continue button
- [ ] Review step shows security badge with "Change" link
- [ ] Clicking "Change" navigates BACK to previous step (doesn't change proof in place)
- [ ] Modal has proper z-index (covers header/footer completely)
- [ ] Modal preview fits without scrolling on laptop screens
- [ ] Modal header stays fixed at top
- [ ] Modal can be closed with ESC key
- [ ] Modal can be closed by clicking overlay
- [ ] Body scroll is disabled when modal is open

---

## Files to Modify

1. `src/components/Header/Header.jsx` — Remove "POC" text, remove Arizona badge
2. `src/index.css` or `src/App.css` — Fix background color, add modal styles, accordion styles
3. `src/components/Preview/PreviewPanel.jsx` — Add Arizona to title, add "Help me decide" expandable
4. `src/components/Preview/PreviewModal.jsx` — Complete rewrite of modal CSS
5. `src/components/ReviewAndOrder/ReviewAndOrder.jsx` — Add approval animation class, security "Change" goes back
6. `src/components/Builder/PracticeForm.jsx` — Convert Location cards to accordion pattern
7. `src/components/Builder/PrescriberForm.jsx` — Ensure accordions have proper border logic
8. `src/components/FooterNav/FooterNav.jsx` — Add security level indicator text
