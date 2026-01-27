# RxForms POC — Implementation Specification v2

## Overview

This document specifies UX/UI improvements for the RxForms prescription pad customizer POC. The current implementation has solid foundations but requires refinements to layout consistency, component patterns, and PDF output.

**Key Changes:**
1. Unified two-column layout across all steps
2. Compact progress header (breadcrumb style)
3. Prescriber accordion pattern with validation gating
4. Side-by-side prescriber rendering in SVG (when 2+)
5. Black & white PDF output
6. Collapsible pricing table
7. Consistent page widths

---

## Asset Requirements

### Background Images

Place in `public/assets/backgrounds/`:

| Filename | Description | Format | Dimensions |
|----------|-------------|--------|------------|
| `maximum-security.png` | Security paper with watermarks, Rx symbol, beige tint | PNG | 1650 × 1275 px |
| `minimum-security.png` | Lighter security paper pattern | PNG | 1650 × 1275 px |
| `no-security.png` | Plain white or subtle paper texture | PNG | 1650 × 1275 px |

**Aspect ratio:** 5.5" × 4.25" (1.294:1)
**Resolution:** 300 DPI equivalent for print preview quality
**Color:** These are for screen preview only; PDF output ignores backgrounds

### Logo

Place in `public/assets/logo/`:

| Filename | Description | Format |
|----------|-------------|--------|
| `rxforms-logo.png` | RxForms branding for pad footer | PNG with transparency, ~100px wide |

---

## Layout Architecture

### Unified Two-Column Grid

All four steps use identical container structure:

```jsx
// Layout wrapper used by all steps
function StepLayout({ children, preview }) {
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
```

```css
.step-container {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: calc(100vh - 120px); /* Account for header + footer nav */
}

.step-preview {
  position: sticky;
  top: 1.5rem;
  align-self: start;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
}

/* Mobile: stack columns */
@media (max-width: 1024px) {
  .step-container {
    grid-template-columns: 1fr;
  }
  
  .step-preview {
    position: relative;
    top: 0;
    order: -1; /* Preview above form on mobile */
    max-height: 50vh;
  }
}
```

### Step-Specific Content

| Step | Left Column | Right Column |
|------|-------------|--------------|
| 1. Practice | Practice form, location accordions | Preview, Security toggle, Price summary |
| 2. Prescribers | Prescriber accordions, Pad options | Preview, Security toggle, Price summary |
| 3. Review | Verification checklist, Approval checkbox | Preview (larger), Security display, Price |
| 4. Order | Quantity, Paper type, Production time | Preview thumbnail, Order summary, Actions |

---

## Header & Navigation

### Compact Progress Header

Replace the current circle-step progress bar with a breadcrumb-style header:

```jsx
function Header({ currentStep, completedSteps, onStepClick }) {
  const steps = [
    { id: 'practice', label: 'Practice' },
    { id: 'prescribers', label: 'Prescribers' },
    { id: 'review', label: 'Review' },
    { id: 'order', label: 'Order' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="header-logo">
          <span className="logo-icon">Rx</span>
          <span className="logo-text">RxForms <span className="logo-suffix">POC</span></span>
        </div>

        {/* Progress breadcrumb */}
        <nav className="progress-nav" aria-label="Form progress">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isClickable = isCompleted;

            return (
              <React.Fragment key={step.id}>
                {index > 0 && <span className="progress-separator">›</span>}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable && !isCurrent}
                  className={cn(
                    'progress-step',
                    isCurrent && 'progress-step--current',
                    isCompleted && 'progress-step--completed',
                    !isClickable && !isCurrent && 'progress-step--disabled'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted && !isCurrent && (
                    <CheckIcon className="progress-check" aria-hidden="true" />
                  )}
                  {step.label}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Product context */}
        <div className="header-context">
          Arizona Prescription Pads
        </div>
      </div>
    </header>
  );
}
```

```css
.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.logo-icon {
  background: #2563eb;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.logo-suffix {
  color: #9ca3af;
  font-weight: 400;
}

.progress-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-separator {
  color: #d1d5db;
  font-size: 0.875rem;
}

.progress-step {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.progress-step--current {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.progress-step--completed {
  color: #374151;
}

.progress-step--completed:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.progress-step--disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.progress-check {
  width: 0.875rem;
  height: 0.875rem;
  color: #059669;
}

.header-context {
  color: #6b7280;
  font-size: 0.875rem;
}
```

**Height savings:** ~50px compared to current design

### Fixed Footer Navigation

```jsx
function FooterNav({ onBack, onContinue, backLabel, continueLabel, continueDisabled }) {
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
        <button 
          onClick={onContinue} 
          disabled={continueDisabled}
          className="btn btn-primary"
        >
          {continueLabel || 'Continue'} →
        </button>
      </div>
    </footer>
  );
}
```

```css
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  z-index: 100;
}

.footer-nav-content {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

/* Add padding to main content to account for fixed footer */
.step-container {
  padding-bottom: 5rem;
}
```

---

## Component Specifications

### Preview Panel

The right column preview panel structure:

```jsx
function PreviewPanel({ 
  practices, 
  prescribers, 
  padOptions, 
  securityLevel, 
  setSecurityLevel,
  isReviewStep = false 
}) {
  const [pricingExpanded, setPricingExpanded] = useState(false);
  const currentPrice = arizonaPricing[securityLevel].prices[8]; // Base price for 8 pads

  return (
    <div className="preview-panel">
      <h2 className="preview-title">
        <span className="preview-title-indicator" />
        Live Preview
      </h2>

      {/* Preview container with background */}
      <div 
        className={cn(
          'preview-container',
          `preview-container--${securityLevel}`,
          isReviewStep && 'preview-container--large'
        )}
      >
        <PrescriptionPadSVG
          practices={practices}
          prescribers={prescribers}
          padOptions={padOptions}
          securityLevel={securityLevel}
        />
      </div>

      {/* Security Level Toggle */}
      <div className="security-section">
        <label className="security-label">Security Level</label>
        <div className="security-toggle">
          {['maximum-security', 'minimum-security', 'no-security'].map((level) => (
            <button
              key={level}
              onClick={() => setSecurityLevel(level)}
              className={cn(
                'security-option',
                securityLevel === level && 'security-option--selected'
              )}
            >
              {level === 'maximum-security' && 'Maximum'}
              {level === 'minimum-security' && 'Minimum'}
              {level === 'no-security' && 'Standard'}
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary (collapsed by default) */}
      <div className="pricing-section">
        <button 
          className="pricing-summary"
          onClick={() => setPricingExpanded(!pricingExpanded)}
        >
          <span className="pricing-amount">Starting at ${currentPrice}</span>
          <span className="pricing-context">for 8 pads</span>
          <span className={cn('pricing-expand-icon', pricingExpanded && 'pricing-expand-icon--open')}>
            ▾
          </span>
        </button>

        {pricingExpanded && (
          <div className="pricing-table-container">
            <PricingTable 
              securityLevel={securityLevel} 
              onSelectLevel={setSecurityLevel}
            />
            <HelpExpander />
          </div>
        )}
      </div>
    </div>
  );
}
```

```css
.preview-panel {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.preview-title-indicator {
  width: 4px;
  height: 1.25rem;
  background: #2563eb;
  border-radius: 2px;
}

.preview-container {
  position: relative;
  aspect-ratio: 1.294; /* 5.5 / 4.25 */
  margin: 1rem;
  border-radius: 0.25rem;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
}

.preview-container--maximum-security {
  background-image: url('/assets/backgrounds/maximum-security.png');
}

.preview-container--minimum-security {
  background-image: url('/assets/backgrounds/minimum-security.png');
}

.preview-container--no-security {
  background-image: url('/assets/backgrounds/no-security.png');
}

.preview-container--large {
  margin: 1.5rem;
}

/* Empty state */
.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  padding: 2rem;
}

.security-section {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.security-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.security-toggle {
  display: flex;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.security-option {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
}

.security-option--selected {
  background: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  font-weight: 500;
}

.pricing-section {
  border-top: 1px solid #e5e7eb;
}

.pricing-summary {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.pricing-summary:hover {
  background: #f9fafb;
}

.pricing-amount {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.pricing-context {
  font-size: 0.875rem;
  color: #6b7280;
}

.pricing-expand-icon {
  margin-left: auto;
  transition: transform 0.2s;
}

.pricing-expand-icon--open {
  transform: rotate(180deg);
}

.pricing-table-container {
  padding: 0 1rem 1rem;
}
```

### Empty State Preview

When no data has been entered:

```jsx
function PrescriptionPadSVG({ practices, prescribers, padOptions, securityLevel }) {
  const hasPracticeData = practices[0]?.name;
  const hasPrescriberData = prescribers[0]?.name;
  
  if (!hasPracticeData && !hasPrescriberData) {
    return (
      <div className="preview-empty">
        <div>
          <p>Fill in the form to see your preview</p>
          <p className="preview-empty-hint">Your prescription pad will appear here</p>
        </div>
      </div>
    );
  }
  
  // ... render SVG
}
```

---

## Prescriber Accordion Component

### Accordion Structure

```jsx
function PrescriberAccordions({ 
  prescribers, 
  setPrescribers, 
  expandedIndex, 
  setExpandedIndex,
  maxPrescribers = 6 
}) {
  const canAddPrescriber = () => {
    if (prescribers.length >= maxPrescribers) return false;
    // Check if current prescriber (last one) has required fields
    const current = prescribers[prescribers.length - 1];
    return current?.name && current?.credentials;
  };

  const addPrescriber = () => {
    if (!canAddPrescriber()) return;
    const newIndex = prescribers.length;
    setPrescribers([...prescribers, {}]);
    setExpandedIndex(newIndex);
  };

  const removePrescriber = (index) => {
    if (prescribers.length <= 1) return;
    const updated = prescribers.filter((_, i) => i !== index);
    setPrescribers(updated);
    // Adjust expanded index if needed
    if (expandedIndex >= updated.length) {
      setExpandedIndex(updated.length - 1);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const getAccordionLabel = (prescriber, index) => {
    if (prescriber.name && prescriber.credentials) {
      return `${prescriber.name}, ${prescriber.credentials}`;
    }
    if (prescriber.name) {
      return prescriber.name;
    }
    return `Prescriber ${index + 1}`;
  };

  const getValidationStatus = (prescriber) => {
    const hasRequired = prescriber.name && prescriber.credentials;
    const hasErrors = prescriber.deaError; // From DEA validation
    if (hasErrors) return 'error';
    if (hasRequired) return 'complete';
    return 'incomplete';
  };

  return (
    <div className="prescriber-accordions">
      {prescribers.map((prescriber, index) => {
        const isExpanded = expandedIndex === index;
        const status = getValidationStatus(prescriber);
        
        return (
          <div 
            key={index} 
            className={cn(
              'accordion',
              isExpanded && 'accordion--expanded',
              `accordion--${status}`
            )}
          >
            <button
              className="accordion-header"
              onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
              aria-expanded={isExpanded}
            >
              <div className="accordion-status">
                {status === 'complete' && <CheckCircleIcon className="status-icon status-icon--complete" />}
                {status === 'error' && <AlertCircleIcon className="status-icon status-icon--error" />}
                {status === 'incomplete' && <CircleIcon className="status-icon status-icon--incomplete" />}
              </div>
              <span className="accordion-label">{getAccordionLabel(prescriber, index)}</span>
              <ChevronIcon className={cn('accordion-chevron', isExpanded && 'accordion-chevron--open')} />
            </button>
            
            {isExpanded && (
              <div className="accordion-content">
                <PrescriberFields
                  prescriber={prescriber}
                  onChange={(updated) => {
                    const newPrescribers = [...prescribers];
                    newPrescribers[index] = updated;
                    setPrescribers(newPrescribers);
                  }}
                />
                {prescribers.length > 1 && (
                  <button 
                    onClick={() => removePrescriber(index)}
                    className="btn-remove"
                  >
                    Remove this prescriber
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add prescriber button */}
      <button
        onClick={addPrescriber}
        disabled={!canAddPrescriber()}
        className={cn(
          'btn-add-prescriber',
          !canAddPrescriber() && 'btn-add-prescriber--disabled'
        )}
      >
        + Add another prescriber
        <span className="prescriber-count">({prescribers.length} of {maxPrescribers})</span>
      </button>
      
      {!canAddPrescriber() && prescribers.length < maxPrescribers && (
        <p className="add-prescriber-hint">
          Complete required fields (name, credentials) to add another prescriber
        </p>
      )}
    </div>
  );
}
```

```css
.prescriber-accordions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.accordion {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: border-color 0.15s;
}

.accordion--expanded {
  border-color: #2563eb;
}

.accordion--error {
  border-color: #fca5a5;
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.accordion-header:hover {
  background: #f3f4f6;
}

.accordion--expanded .accordion-header {
  background: #eff6ff;
}

.accordion-status {
  flex-shrink: 0;
}

.status-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.status-icon--complete {
  color: #059669;
}

.status-icon--error {
  color: #dc2626;
}

.status-icon--incomplete {
  color: #d1d5db;
}

.accordion-label {
  flex: 1;
  font-weight: 500;
}

.accordion-chevron {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  transition: transform 0.2s;
}

.accordion-chevron--open {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-remove {
  margin-top: 1rem;
  padding: 0.5rem 0;
  color: #dc2626;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-remove:hover {
  text-decoration: underline;
}

.btn-add-prescriber {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;
}

.btn-add-prescriber:hover:not(:disabled) {
  border-color: #2563eb;
  background: #eff6ff;
}

.btn-add-prescriber--disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.prescriber-count {
  color: #9ca3af;
  font-weight: 400;
}

.add-prescriber-hint {
  text-align: center;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}
```

---

## SVG Prescriber Layout

### Side-by-Side Rendering for Multiple Prescribers

```jsx
function renderPrescribers(prescribers, yStart = 58) {
  const validPrescribers = prescribers.filter(p => p.name);
  
  if (validPrescribers.length === 0) {
    return (
      <text x="198" y={yStart + 10} textAnchor="middle" fontSize="11" fill="#9ca3af">
        Prescriber Name, MD
      </text>
    );
  }
  
  if (validPrescribers.length === 1) {
    const p = validPrescribers[0];
    return (
      <g className="prescriber-single">
        <text x="198" y={yStart + 10} textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="Arial">
          {p.name}{p.credentials ? `, ${p.credentials}` : ''}
        </text>
        <text x="198" y={yStart + 22} textAnchor="middle" fontSize="8" fontFamily="Arial">
          {formatPrescriberDetails(p)}
        </text>
      </g>
    );
  }
  
  if (validPrescribers.length === 2) {
    // Two prescribers: side by side
    return (
      <g className="prescribers-dual">
        {validPrescribers.map((p, i) => {
          const xPos = i === 0 ? 100 : 296;
          return (
            <g key={i}>
              <text x={xPos} y={yStart + 10} textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="Arial">
                {p.name}{p.credentials ? `, ${p.credentials}` : ''}
              </text>
              <text x={xPos} y={yStart + 20} textAnchor="middle" fontSize="6" fontFamily="Arial">
                {formatPrescriberDetails(p)}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
  
  if (validPrescribers.length <= 4) {
    // 3-4 prescribers: 2x2 grid
    const positions = [
      { x: 100, y: yStart },
      { x: 296, y: yStart },
      { x: 100, y: yStart + 24 },
      { x: 296, y: yStart + 24 },
    ];
    
    return (
      <g className="prescribers-grid">
        {validPrescribers.map((p, i) => {
          const pos = positions[i];
          return (
            <g key={i}>
              <text x={pos.x} y={pos.y + 10} textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="Arial">
                {p.name}{p.credentials ? `, ${p.credentials}` : ''}
              </text>
              <text x={pos.x} y={pos.y + 18} textAnchor="middle" fontSize="5" fontFamily="Arial">
                {formatPrescriberDetails(p)}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
  
  // 5-6 prescribers: 3x2 grid
  const positions = [
    { x: 70, y: yStart },
    { x: 198, y: yStart },
    { x: 326, y: yStart },
    { x: 70, y: yStart + 22 },
    { x: 198, y: yStart + 22 },
    { x: 326, y: yStart + 22 },
  ];
  
  return (
    <g className="prescribers-grid-large">
      {validPrescribers.map((p, i) => {
        const pos = positions[i];
        return (
          <g key={i}>
            <text x={pos.x} y={pos.y + 8} textAnchor="middle" fontSize="7" fontWeight="bold" fontFamily="Arial">
              {p.name}{p.credentials ? `, ${p.credentials}` : ''}
            </text>
            <text x={pos.x} y={pos.y + 15} textAnchor="middle" fontSize="4.5" fontFamily="Arial">
              {formatPrescriberDetails(p)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function formatPrescriberDetails(p) {
  const parts = [];
  if (!p.hideLicense && p.licenseNumber) {
    parts.push(`Lic# ${p.licenseNumber}`);
  }
  if (p.deaNumber) {
    parts.push(`DEA# ${p.deaNumber}`);
  }
  return parts.join('  ');
}
```

---

## PDF Export — Black & White

### Updated pdfExport.js

```javascript
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

/**
 * Convert SVG to black and white by replacing all colors
 */
function convertToBlackAndWhite(svgElement) {
  const clone = svgElement.cloneNode(true);
  
  // Colors to preserve as-is
  const preserveColors = ['none', 'transparent', '#fff', '#ffffff', 'white'];
  
  // Process all elements
  const processElement = (el) => {
    // Handle fill attribute
    const fill = el.getAttribute('fill');
    if (fill && !preserveColors.includes(fill.toLowerCase())) {
      // Exception: warning band text should be white on black
      if (el.closest('.warning-band') && el.tagName === 'text') {
        el.setAttribute('fill', '#ffffff');
      } else {
        el.setAttribute('fill', '#000000');
      }
    }
    
    // Handle stroke attribute
    const stroke = el.getAttribute('stroke');
    if (stroke && !preserveColors.includes(stroke.toLowerCase())) {
      el.setAttribute('stroke', '#000000');
    }
    
    // Handle inline styles
    const style = el.getAttribute('style');
    if (style) {
      let newStyle = style;
      
      // Replace fill colors (but not fill: none or fill: white)
      newStyle = newStyle.replace(
        /fill:\s*(?!none|transparent|white|#fff|#ffffff)[^;]+/gi, 
        'fill: #000000'
      );
      
      // Replace stroke colors
      newStyle = newStyle.replace(
        /stroke:\s*(?!none|transparent)[^;]+/gi, 
        'stroke: #000000'
      );
      
      el.setAttribute('style', newStyle);
    }
    
    // Handle rect fill for warning band background
    if (el.tagName === 'rect' && el.closest('.warning-band')) {
      el.setAttribute('fill', '#000000');
    }
  };
  
  clone.querySelectorAll('*').forEach(processElement);
  
  return clone;
}

/**
 * Export prescription pad SVG to PDF
 * @param {SVGElement} svgElement - The SVG element to export
 * @param {string} filename - Output filename
 * @returns {Promise<boolean>}
 */
export async function exportPrescriptionPadPDF(svgElement, filename = 'prescription-pad.pdf') {
  // Dimensions: 5.5" x 4.25" at 72 DPI
  const width = 5.5 * 72;  // 396 points
  const height = 4.25 * 72; // 306 points
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [width, height],
  });
  
  // Convert to black and white
  const bwSvg = convertToBlackAndWhite(svgElement);
  
  // Render SVG to PDF
  await pdf.svg(bwSvg, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });
  
  pdf.save(filename);
  return true;
}

/**
 * Get SVG element reference for export
 * Usage: Pass a ref to PrescriptionPadSVG component
 */
export function getSvgElement(ref) {
  if (!ref.current) {
    console.error('SVG ref is not attached');
    return null;
  }
  return ref.current.querySelector('svg') || ref.current;
}
```

### Usage in Component

```jsx
import { useRef } from 'react';
import { exportPrescriptionPadPDF, getSvgElement } from '../utils/pdfExport';

function OrderOptions({ practices, prescribers, padOptions, securityLevel }) {
  const svgRef = useRef();
  
  const handleDownloadPDF = async () => {
    const svgElement = getSvgElement(svgRef);
    if (svgElement) {
      await exportPrescriptionPadPDF(svgElement, 'prescription-pad-proof.pdf');
    }
  };
  
  return (
    <div>
      {/* Hidden SVG for PDF export (rendered without background) */}
      <div ref={svgRef} style={{ position: 'absolute', left: '-9999px' }}>
        <PrescriptionPadSVG
          practices={practices}
          prescribers={prescribers}
          padOptions={padOptions}
          securityLevel={securityLevel}
        />
      </div>
      
      <button onClick={handleDownloadPDF}>
        Download PDF Proof
      </button>
    </div>
  );
}
```

---

## Form Validation

### Validation Strategy

- **Format errors:** Validate on blur (DEA format, phone format)
- **Required fields:** Validate on "Continue" click
- **Real-time feedback:** Show validation state in accordion headers

```javascript
// utils/validation.js

export function validateDEA(dea) {
  if (!dea) return { valid: true, message: '' }; // Optional field
  
  const pattern = /^[A-Z]{2}\d{7}$/i;
  if (!pattern.test(dea)) {
    return { 
      valid: false, 
      message: 'Format: 2 letters + 7 digits (e.g., AB1234567)' 
    };
  }
  
  // Checksum validation
  const normalized = dea.toUpperCase();
  const digits = normalized.slice(2).split('').map(Number);
  const sum = (digits[0] + digits[2] + digits[4]) + 2 * (digits[1] + digits[3] + digits[5]);
  const checkDigit = sum % 10;
  
  if (checkDigit !== digits[6]) {
    return { valid: false, message: 'Invalid DEA checksum' };
  }
  
  return { valid: true, message: '' };
}

export function validateNPI(npi) {
  if (!npi) return { valid: true, message: '' };
  
  if (!/^\d{10}$/.test(npi)) {
    return { valid: false, message: 'NPI must be 10 digits' };
  }
  
  return { valid: true, message: '' };
}

export function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function validatePractice(practice) {
  const errors = {};
  if (!practice.name?.trim()) errors.name = 'Practice name is required';
  if (!practice.address?.trim()) errors.address = 'Address is required';
  if (!practice.city?.trim()) errors.city = 'City is required';
  if (!practice.state?.trim()) errors.state = 'State is required';
  if (!practice.zip?.trim()) errors.zip = 'ZIP is required';
  if (!practice.phone?.trim()) errors.phone = 'Phone is required';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePrescriber(prescriber) {
  const errors = {};
  if (!prescriber.name?.trim()) errors.name = 'Name is required';
  if (!prescriber.credentials?.trim()) errors.credentials = 'Credentials required';
  
  // DEA format validation (if provided)
  if (prescriber.deaNumber) {
    const deaResult = validateDEA(prescriber.deaNumber);
    if (!deaResult.valid) errors.deaNumber = deaResult.message;
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
}
```

---

## Design Tokens

### Colors

```css
:root {
  /* Primary */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-light: #eff6ff;
  
  /* Neutral */
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
  --color-border: #e5e7eb;
  --color-border-light: #f3f4f6;
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  
  /* Status */
  --color-success: #059669;
  --color-success-light: #d1fae5;
  --color-error: #dc2626;
  --color-error-light: #fee2e2;
  --color-warning: #d97706;
  --color-warning-light: #fef3c7;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

### Typography

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: 1.5;
  color: var(--color-text);
}

h1, h2, h3 {
  font-weight: 600;
  line-height: 1.25;
}
```

---

## Checklist for Implementation

### Phase 1: Critical Fixes
- [ ] PDF exports in black & white only
- [ ] Prescribers render side-by-side in SVG when 2+
- [ ] All pages use consistent max-width container

### Phase 2: Layout Unification
- [ ] Replace progress bar with compact breadcrumb header
- [ ] Implement fixed footer navigation
- [ ] Apply two-column grid to all steps
- [ ] Move pricing table to collapsible section in sidebar

### Phase 3: Prescriber UX
- [ ] Convert prescriber forms to accordion pattern
- [ ] Implement validation gating for "Add prescriber"
- [ ] Add status indicators to accordion headers
- [ ] Support up to 6 prescribers with responsive grid in SVG

### Phase 4: Polish
- [ ] Empty state preview message
- [ ] Form validation on blur for format errors
- [ ] Validation summary on Continue click
- [ ] Add preview thumbnail to Order step
- [ ] Consistent color tokens throughout

---

## Testing Checklist

After implementation, verify:

- [ ] Progress header fits in ~48px height
- [ ] Two-column layout consistent across all 4 steps
- [ ] Preview stays in right column on all steps
- [ ] Prescriber accordion expands/collapses correctly
- [ ] Cannot add prescriber until current one has name + credentials
- [ ] Up to 6 prescribers supported
- [ ] SVG renders 1 prescriber centered
- [ ] SVG renders 2 prescribers side-by-side
- [ ] SVG renders 3-4 prescribers in 2x2 grid
- [ ] SVG renders 5-6 prescribers in 3x2 grid
- [ ] PDF downloads in pure black & white
- [ ] PDF has no background image
- [ ] Pricing table collapses by default
- [ ] Security toggle updates preview and price
- [ ] Mobile layout stacks columns
- [ ] Form validation shows errors on blur
- [ ] Continue button validates required fields
