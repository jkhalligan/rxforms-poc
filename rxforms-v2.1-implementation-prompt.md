# RxForms POC v2.1 - Implementation Prompt: Critical Fixes & Polish

## Overview

This prompt addresses critical bugs and visual polish for the RxForms POC. The Order step redesign will be handled separately in the next iteration.

**Scope:**
1. Fix background images not loading in preview
2. Remove Rx symbol from SVG/PDF (replace with simple "Rx" text)
3. Move "Prefill with sample data" to a subtle utility position
4. Add preview zoom/modal functionality
5. Apply color palette aligned with current RxForms site
6. Improve "Live Preview" header treatment
7. Ensure consistent styling across all steps

---

## 1. Fix Background Images

**Problem:** Security paper backgrounds aren't displaying in the preview panel.

**Investigation & Fix:**
- Check that images exist at `/public/assets/backgrounds/`
- Verify the CSS background-image paths resolve correctly
- The paths should be `/assets/backgrounds/maximum-security.png` (Vite serves from public without the `/public` prefix)

```javascript
// In PreviewPanel.jsx or CSS, ensure paths are:
background-image: url('/assets/backgrounds/maximum-security.png');
background-image: url('/assets/backgrounds/minimum-security.png');
background-image: url('/assets/backgrounds/no-security.png');
```

If images don't exist, create placeholder backgrounds:
- `maximum-security.png` — Beige/tan with subtle security pattern, watermark hints
- `minimum-security.png` — Lighter security pattern
- `no-security.png` — Plain white or very light gray

---

## 2. Remove Rx Symbol from SVG/PDF

**Problem:** The ℞ Unicode character renders as "!" in PDF export.

**Fix:** Replace the Rx symbol with simple styled "Rx" text that will render correctly:

```jsx
// In PrescriptionPadSVG.jsx, replace:
<text x="20" y="200" fontSize="36" fontFamily="Times New Roman" fontWeight="bold">
  ℞
</text>

// With:
<text x="20" y="200" fontSize="32" fontFamily="Times New Roman, serif" fontWeight="bold" fontStyle="italic">
  Rx
</text>
```

This ensures PDF compatibility while maintaining the visual intent.

---

## 3. Move "Prefill with Sample Data"

**Current:** Full-width banner above form that pushes content down.

**New Position:** Inline with the section card header, right-aligned as a subtle utility.

```jsx
// PracticeForm.jsx - new header structure
<div className="form-section">
  <div className="form-section-header">
    <div>
      <h2 className="form-section-title">Location 1</h2>
      <span className="badge-primary">PRIMARY</span>
    </div>
    <label className="prefill-toggle">
      <input 
        type="checkbox" 
        checked={useSampleData}
        onChange={handlePrefill}
      />
      <span className="prefill-label">Prefill demo</span>
    </label>
  </div>
  {/* Form fields */}
</div>
```

```css
.form-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.prefill-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  cursor: pointer;
}

.prefill-toggle input {
  width: 14px;
  height: 14px;
}

.prefill-label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

Apply same pattern to PrescriberForm.

---

## 4. Add Preview Zoom Modal

**Feature:** Click on preview to open a larger modal view for detailed inspection.

```jsx
// PreviewPanel.jsx
import { useState } from 'react';

function PreviewPanel({ practices, prescribers, padOptions, securityLevel, setSecurityLevel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="preview-panel">
        <div className="preview-header">
          <span className="preview-label">Your Prescription Pad</span>
          <span className="preview-hint">Click to enlarge</span>
        </div>

        <div 
          className={`preview-container preview-container--${securityLevel}`}
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
          <div className="preview-zoom-overlay">
            <ZoomIcon className="zoom-icon" />
          </div>
        </div>

        {/* Security toggle and pricing... */}
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
    </>
  );
}
```

```jsx
// PreviewModal.jsx
function PreviewModal({ practices, prescribers, padOptions, securityLevel, onClose }) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Preview Your Prescription Pad</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <div className={`modal-preview preview-container--${securityLevel}`}>
          <PrescriptionPadSVG
            practices={practices}
            prescribers={prescribers}
            padOptions={padOptions}
            securityLevel={securityLevel}
          />
        </div>
        
        <div className="modal-footer">
          <p className="modal-hint">
            This preview shows exactly how your prescription pad will appear. 
            Security backgrounds are for demonstration.
          </p>
        </div>
      </div>
    </div>
  );
}
```

```css
.preview-container {
  position: relative;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.preview-container:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-zoom-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  transition: background 0.15s;
  pointer-events: none;
}

.preview-container:hover .preview-zoom-overlay {
  background: rgba(0, 0, 0, 0.05);
}

.zoom-icon {
  width: 32px;
  height: 32px;
  color: white;
  opacity: 0;
  transition: opacity 0.15s;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.preview-container:hover .zoom-icon {
  opacity: 0.8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-preview {
  margin: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  aspect-ratio: 1.294;
  background-size: cover;
  background-position: center;
}

.modal-footer {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.modal-hint {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}
```

---

## 5. Color Palette Update (RxForms Brand Alignment)

Apply colors derived from the current RxForms site:

```css
:root {
  /* Primary - matches RxForms blue */
  --color-primary: #006FFF;
  --color-primary-hover: #0059CC;
  --color-primary-light: #E6F0FF;
  
  /* Backgrounds - matches RxForms gray/white pattern */
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
  
  /* Footer/Dark */
  --color-dark: #1A1A2E;
  --color-dark-secondary: #2D2D44;
  
  /* Status */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  
  /* Accent (gold for CTAs - keep from current POC) */
  --color-accent: #D4A843;
  --color-accent-hover: #C49A3A;
}
```

**Apply to layout:**

```css
/* Body/Page background */
body {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
}

/* Header */
.header {
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
}

/* Cards/Panels */
.form-section,
.preview-panel,
.accordion {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

/* Primary buttons */
.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

/* Footer navigation */
.footer-nav {
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border);
}

/* Progress steps - current */
.progress-step--current {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* Logo icon */
.logo-icon {
  background: var(--color-primary);
}
```

---

## 6. Improve Preview Header

**Current:** "Live Preview" with blue bar feels generic.

**New:** More sophisticated, subtle treatment.

```jsx
// In PreviewPanel.jsx
<div className="preview-header">
  <span className="preview-label">Your Prescription Pad</span>
  <button 
    className="preview-enlarge-btn"
    onClick={() => setIsModalOpen(true)}
    aria-label="Enlarge preview"
  >
    <ExpandIcon /> Enlarge
  </button>
</div>
```

```css
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.preview-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.preview-enlarge-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
}

.preview-enlarge-btn:hover {
  background: var(--color-bg-card);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.preview-enlarge-btn svg {
  width: 14px;
  height: 14px;
}
```

---

## 7. Consistent Styling Across Steps

Ensure all four steps use the same visual patterns:

**Step container consistency:**
```css
.step-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  padding-bottom: 6rem; /* Space for fixed footer */
}

/* Same preview panel width on all steps */
.preview-panel {
  width: 100%;
}

/* Consistent card styling */
.content-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  overflow: hidden;
}

.content-card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-bg-subtle);
}

.content-card-body {
  padding: 1.25rem;
}
```

**Review step - adjust emphasis:**
- Keep the same two-column layout for consistency
- But make the checklist items less prominent
- Add clearer visual connection between checklist and preview

```css
/* Review step checklist - more subtle */
.verification-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.verification-icon {
  width: 18px;
  height: 18px;
  color: var(--color-success);
}

/* Approval checkbox - more prominent */
.approval-checkbox {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.approval-checkbox label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
}

.approval-checkbox input {
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.approval-subtext {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}
```

---

## 8. Minor Polish Items

**A. Remove redundant "Complete Order" from footer on Order step**
- The inline CTA is sufficient
- Footer should only show "Back" on Order step

**B. Improve empty state in preview**
```jsx
<div className="preview-empty">
  <div className="preview-empty-icon">
    <FileIcon />
  </div>
  <p className="preview-empty-title">Your preview will appear here</p>
  <p className="preview-empty-hint">Start filling in the form to see your prescription pad</p>
</div>
```

```css
.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.preview-empty-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  opacity: 0.5;
}

.preview-empty-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.preview-empty-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
```

**C. Security toggle - add subtle descriptions**
```jsx
<div className="security-toggle-container">
  <label className="security-label">Security Level</label>
  <div className="security-toggle">
    {/* Toggle buttons */}
  </div>
  <p className="security-hint">
    {securityLevel === 'maximum-security' && 'Required for controlled substances'}
    {securityLevel === 'minimum-security' && 'Meets federal Medicaid requirements'}
    {securityLevel === 'no-security' && 'For non-controlled prescriptions'}
  </p>
</div>
```

---

## Testing Checklist

After implementation, verify:

- [ ] Background images load correctly for all three security levels
- [ ] Rx renders as "Rx" (not ℞) in both preview and PDF
- [ ] PDF downloads without exclamation point
- [ ] Prefill checkbox is inline with card header, not blocking
- [ ] Click on preview opens zoom modal
- [ ] Modal displays larger preview with correct background
- [ ] ESC key and overlay click close modal
- [ ] Colors match RxForms brand (blue `#006FFF`, gray `#F2F2F2`)
- [ ] All steps have consistent page background
- [ ] All cards have consistent white background with borders
- [ ] Preview panel is same width on all steps
- [ ] Security level toggle shows contextual hint
- [ ] Empty preview state displays properly

---

## Files to Modify

1. `src/App.jsx` — Color variables, layout consistency
2. `src/App.css` or CSS module — Updated color palette, modal styles
3. `src/components/Preview/PreviewPanel.jsx` — Zoom modal, header update
4. `src/components/Preview/PreviewModal.jsx` — New component
5. `src/components/Preview/PrescriptionPadSVG.jsx` — Replace ℞ with Rx
6. `src/components/Builder/PracticeForm.jsx` — Move prefill inline
7. `src/components/Builder/PrescriberForm.jsx` — Move prefill inline
8. Verify/fix background image paths

---

## Color Reference Summary

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#006FFF` | Buttons, links, active states |
| `--color-primary-hover` | `#0059CC` | Button hover states |
| `--color-primary-light` | `#E6F0FF` | Light backgrounds, badges |
| `--color-bg-page` | `#F2F2F2` | Page background |
| `--color-bg-card` | `#FFFFFF` | Cards, panels, modals |
| `--color-text-primary` | `#1A1A2E` | Headings, body text |
| `--color-accent` | `#D4A843` | Gold CTA buttons |

---

This prompt addresses the critical fixes and polish. The Order step redesign will be handled in the next iteration after these changes are validated.
