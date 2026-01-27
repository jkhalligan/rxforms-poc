# RxForms POC Implementation Plan

## Overview

Build a proof-of-concept web-to-print prescription pad customizer demonstrating:
- Progressive form builder with live SVG preview
- Security level toggle that swaps background in real-time
- PDF generation of print-ready output (foreground only, no background)
- Modern, best-in-class UX

**Stack:** React + Vite, deployed to Vercel
**PDF Generation:** svg2pdf.js + jsPDF (client-side)

---

## Project Setup

```bash
npm create vite@latest rxforms-poc -- --template react
cd rxforms-poc
npm install jspdf svg2pdf.js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### File Structure

```
rxforms-poc/
├── src/
│   ├── components/
│   │   ├── Builder/
│   │   │   ├── PracticeForm.jsx
│   │   │   ├── PrescriberForm.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── PadOptions.jsx
│   │   ├── Preview/
│   │   │   ├── PrescriptionPadSVG.jsx
│   │   │   ├── PreviewPanel.jsx
│   │   │   ├── SecurityToggle.jsx
│   │   │   └── PricingTable.jsx
│   │   ├── Review/
│   │   │   └── ProofApproval.jsx
│   │   ├── Order/
│   │   │   └── OrderOptions.jsx
│   │   └── ui/
│   │       ├── Input.jsx
│   │       ├── Checkbox.jsx
│   │       ├── Button.jsx
│   │       └── HelpExpander.jsx
│   ├── config/
│   │   ├── fields.js
│   │   ├── arizona.js
│   │   └── pricing.js
│   ├── hooks/
│   │   └── useFormState.js
│   ├── utils/
│   │   ├── pdfExport.js
│   │   ├── validation.js
│   │   └── sampleData.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
│   └── assets/
│       ├── backgrounds/
│       │   ├── maximum-security.png
│       │   ├── minimum-security.png
│       │   └── no-security.png
│       └── logo/
│           └── rxforms-logo.png
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Asset Requirements

Place the following assets in `public/assets/`:

### Backgrounds (`public/assets/backgrounds/`)
- `maximum-security.png` — Security paper background for Maximum tier (beige with watermarks, Rx symbol)
- `minimum-security.png` — Security paper background for Minimum tier
- `no-security.png` — Plain/white background or simple paper texture

**Format:** PNG, dimensions matching 5.5" × 4.25" aspect ratio (recommend 1650 × 1275 px for good screen quality)

### Logo (`public/assets/logo/`)
- `rxforms-logo.png` — RxForms logo for pad footer (transparent background preferred)

**Format:** PNG with transparency, approximately 100px wide

---

## Configuration Files

### src/config/pricing.js

```javascript
export const arizonaPricing = {
  'maximum-security': {
    name: 'Maximum Security',
    description: 'Required for controlled substances (Schedule II-V)',
    prices: {
      8: 135,
      16: 210,
      24: 295,
      40: 450,
      80: 775,
    },
  },
  'minimum-security': {
    name: 'Minimum Security',
    description: 'Meets federal Medicaid tamper-resistant requirements',
    prices: {
      8: 95,
      16: 155,
      24: 215,
      40: 325,
      80: 595,
    },
  },
  'no-security': {
    name: 'Standard (No Security)',
    description: 'For non-controlled, non-Medicaid prescriptions',
    prices: {
      8: 55,
      16: 85,
      24: 125,
      40: 195,
      80: 295,
    },
  },
};

export const quantities = [8, 16, 24, 40, 80];

export const paperTypes = [
  { id: 'single', name: 'Single Ply', description: '100 scripts per pad', priceModifier: 0 },
  { id: 'carbonless-2', name: '2-Part Carbonless', description: '50 scripts per pad', priceModifier: 25 },
];

export const productionTimes = [
  { id: 'standard', name: 'Standard', description: '5-7 business days', priceModifier: 0 },
  { id: 'rush', name: 'Rush', description: '2-3 business days', priceModifier: 35 },
];
```

### src/config/fields.js

```javascript
export const practiceFields = [
  { id: 'name', label: 'Practice Name', type: 'text', placeholder: 'Practice Name' },
  { id: 'address', label: 'Address', type: 'text', placeholder: 'Street Address' },
  { id: 'city', label: 'City', type: 'text', placeholder: 'City' },
  { id: 'state', label: 'State', type: 'text', placeholder: 'State', defaultValue: 'AZ' },
  { id: 'zip', label: 'ZIP', type: 'text', placeholder: 'ZIP Code' },
  { id: 'phone', label: 'Telephone', type: 'tel', placeholder: '(555) 555-5555' },
  { id: 'fax', label: 'Fax', type: 'tel', placeholder: '(555) 555-5555' },
];

export const prescriberFields = [
  { id: 'name', label: 'Prescriber Name', type: 'text', placeholder: 'Dr. Jane Smith' },
  { id: 'credentials', label: 'Credentials', type: 'text', placeholder: 'MD, DO, DDS, DVM, etc.' },
  { id: 'specialty', label: 'Specialty', type: 'text', placeholder: 'Family Medicine' },
  { id: 'licenseNumber', label: 'State License Number', type: 'text', placeholder: 'License #' },
  { id: 'hideLicense', label: 'Hide license number on pad', type: 'checkbox' },
  { id: 'npiNumber', label: 'NPI Number', type: 'text', placeholder: '1234567890' },
  { id: 'deaNumber', label: 'DEA Number', type: 'text', placeholder: 'AB1234567', validation: 'dea' },
];

export const padOptionsFields = [
  { 
    id: 'startingNumber', 
    label: 'Starting Pad Number', 
    type: 'text', 
    placeholder: '0001',
    defaultValue: '0001',
    helpText: 'Optional — sequential numbering for tracking. Leave as 0001 if not needed.'
  },
];
```

### src/config/arizona.js

```javascript
export const arizonaConfig = {
  state: 'Arizona',
  stateCode: 'AZ',
  securityLevels: ['maximum-security', 'minimum-security', 'no-security'],
  defaultSecurityLevel: 'maximum-security',
  maxLocations: 2,
  maxPrescribers: 2,
  warningBand: {
    text: 'MICROPRINT SECURITY • SERIAL BATCH NUMBERING • SEQUENTIAL NUMBERING',
    showOn: ['maximum-security', 'minimum-security'],
  },
  disclaimer: 'Prescription is void if more than one (1) controlled substance is written per blank.',
  microprint: {
    text: 'RXFORMSSECUREPRESCRIPTION',
    showOn: ['maximum-security'],
  },
};
```

### src/utils/sampleData.js

```javascript
export const samplePractice = {
  name: 'Arizona Family Medical Group',
  address: '4521 E Sunrise Drive',
  city: 'Tucson',
  state: 'AZ',
  zip: '85718',
  phone: '(520) 555-0123',
  fax: '(520) 555-0124',
};

export const samplePractice2 = {
  name: 'Arizona Family Medical Group',
  address: '2200 N Wilmot Road, Suite 100',
  city: 'Tucson',
  state: 'AZ',
  zip: '85712',
  phone: '(520) 555-0199',
  fax: '',
};

export const samplePrescriber = {
  name: 'Sarah Chen',
  credentials: 'MD',
  specialty: 'Family Medicine',
  licenseNumber: 'MD-45892',
  hideLicense: false,
  npiNumber: '1234567890',
  deaNumber: 'FC1234567',
};

export const samplePrescriber2 = {
  name: 'James Wilson',
  credentials: 'DO',
  specialty: 'Internal Medicine',
  licenseNumber: 'DO-33421',
  hideLicense: false,
  npiNumber: '0987654321',
  deaNumber: 'BW7654321',
};
```

### src/utils/validation.js

```javascript
// DEA number validation
// Format: 2 letters + 7 digits
// First letter: A, B, C, D, F, G, M (practitioner type)
// Second letter: First letter of last name (or 9 for certain cases)
// Checksum: Sum of (1st + 3rd + 5th digits) + 2*(2nd + 4th + 6th digits)
// Last digit of sum should equal 7th digit

export function validateDEA(dea) {
  if (!dea) return { valid: true, message: '' }; // Optional for POC
  
  const pattern = /^[A-Z]{2}\d{7}$/;
  if (!pattern.test(dea.toUpperCase())) {
    return { valid: false, message: 'DEA format: 2 letters followed by 7 digits (e.g., AB1234567)' };
  }
  
  // Checksum validation
  const digits = dea.slice(2).split('').map(Number);
  const sum = (digits[0] + digits[2] + digits[4]) + 2 * (digits[1] + digits[3] + digits[5]);
  const checkDigit = sum % 10;
  
  if (checkDigit !== digits[6]) {
    return { valid: false, message: 'Invalid DEA number checksum' };
  }
  
  return { valid: true, message: '' };
}

export function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}
```

---

## Component Specifications

### App.jsx — Main Application Shell

```jsx
// State management for entire form
const [currentStep, setCurrentStep] = useState('practice'); // 'practice' | 'prescribers' | 'review' | 'order'
const [practices, setPractices] = useState([{}]); // Array of practice objects, max 2
const [prescribers, setPrescribers] = useState([{}]); // Array of prescriber objects, max 2
const [securityLevel, setSecurityLevel] = useState('maximum-security');
const [padOptions, setPadOptions] = useState({ startingNumber: '0001' });
const [orderOptions, setOrderOptions] = useState({ quantity: 8, paperType: 'single', productionTime: 'standard' });
const [proofApproved, setProofApproved] = useState(false);

// Layout: Two-column on desktop
// Left: Form area (changes based on currentStep)
// Right: Preview panel (always visible)
```

### ProgressBar.jsx

```jsx
// Horizontal progress indicator
// Steps: Practice ✓ → Prescribers ✓ → Review → Order
// Completed steps show checkmark and are clickable to navigate back
// Current step is highlighted
// Future steps are dimmed

const steps = [
  { id: 'practice', label: 'Practice' },
  { id: 'prescribers', label: 'Prescribers' },
  { id: 'review', label: 'Review' },
  { id: 'order', label: 'Order' },
];
```

### PracticeForm.jsx

```jsx
// Form for practice/location information
// Props: practices, setPractices, onContinue, onBack

// Features:
// - "Prefill with sample data" checkbox at top (for POC testing)
// - Fields for current practice location
// - If practices.length < 2: Show "+ Add another location" button
// - If practices.length === 2: Show both locations with ability to remove second
// - "Continue" button validates and advances to prescribers step

// Layout within form:
// [Checkbox] Use sample data (for testing)
// 
// Location 1
// -----------------
// Practice Name: [____________]
// Address: [____________]
// City: [______] State: [__] ZIP: [_____]
// Phone: [____________] Fax: [____________]
//
// [+ Add another location]
//
// [Continue →]
```

### PrescriberForm.jsx

```jsx
// Form for prescriber information
// Props: prescribers, setPrescribers, onContinue, onBack

// Features:
// - "Prefill with sample data" checkbox at top (for POC testing)
// - Shows "Prescriber 1 of N" indicator
// - Fields for current prescriber
// - DEA number field validates on blur using validateDEA()
// - If prescribers.length < 2: Show "+ Add another prescriber" button
// - Navigation: [← Back] [Continue →]

// When showing credentials, format on preview as "Name, Credentials" (e.g., "Sarah Chen, MD")
```

### PreviewPanel.jsx

```jsx
// Right column container for preview
// Props: practices, prescribers, padOptions, securityLevel, setSecurityLevel

// Layout:
// - "Live Preview" header
// - Preview container with background image based on securityLevel
//   - Background: url(/assets/backgrounds/{securityLevel}.png)
//   - SVG overlay: <PrescriptionPadSVG />
// - Zoom controls (optional for POC, can skip)
// - SecurityToggle component
// - "[?] Which should I choose?" expander
// - PricingTable component
```

### PrescriptionPadSVG.jsx

```jsx
// The core SVG component that renders the prescription pad foreground
// Props: practices, prescribers, padOptions, securityLevel, showMicroprint

// Dimensions: viewBox="0 0 396 306" (5.5" × 4.25" at 72 DPI)
// All measurements in this coordinate system

// This component renders ONLY the foreground elements (black ink):
// - Practice name (centered, top)
// - Practice address, city, state, zip (centered, below name)
// - Practice phone (centered)
// - Prescriber name(s) with credentials
// - License numbers (unless hidden), DEA numbers
// - Sequential number box with padOptions.startingNumber
// - Warning band (brown/tan background with white text) — if securityLevel is max or min
// - Form structure: Name ___ M/F DOB ___, Address ___, Date ___
// - Microprint lines under Name and Address fields (if securityLevel is 'maximum-security')
// - Large "Rx" symbol (bottom left of form area)
// - Refill column: NR, 1, 2, 3, 4, 5, PRN
// - Void After line
// - "Do Not Substitute - Dispense as Written" checkbox
// - Signature line with script "Signature"
// - Disclaimer text
// - RxForms logo (bottom right)

// IMPORTANT: No background in SVG — background is composited via CSS in preview
// For PDF export, this SVG is rendered alone (black on white)

// Example structure:
export function PrescriptionPadSVG({ practices, prescribers, padOptions, securityLevel }) {
  const config = arizonaConfig;
  const showMicroprint = config.microprint.showOn.includes(securityLevel);
  const showWarningBand = config.warningBand.showOn.includes(securityLevel);
  
  // Format practice display
  const practice = practices[0] || {};
  const practiceAddress = [practice.address, practice.city, practice.state, practice.zip]
    .filter(Boolean)
    .join(', ');
  
  return (
    <svg 
      viewBox="0 0 396 306" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Practice Header */}
      <text x="198" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="Arial">
        {practice.name || 'Practice Name'}
      </text>
      <text x="198" y="38" textAnchor="middle" fontSize="8" fontFamily="Arial">
        {practiceAddress || 'Address, City, State ZIP'}
      </text>
      <text x="198" y="50" textAnchor="middle" fontSize="8" fontFamily="Arial">
        {practice.phone ? `P: ${practice.phone}` : ''}
        {practice.fax ? ` F: ${practice.fax}` : ''}
      </text>
      
      {/* Prescriber Info */}
      {prescribers.map((prescriber, index) => (
        <g key={index}>
          <text x="198" y={68 + (index * 24)} textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="Arial">
            {prescriber.name ? `${prescriber.name}, ${prescriber.credentials || ''}` : 'Prescriber Name, MD'}
          </text>
          <text x="198" y={80 + (index * 24)} textAnchor="middle" fontSize="8" fontFamily="Arial">
            {!prescriber.hideLicense && prescriber.licenseNumber ? `Lic# ${prescriber.licenseNumber}` : ''}
            {prescriber.deaNumber ? `    DEA# ${prescriber.deaNumber}` : ''}
          </text>
        </g>
      ))}
      
      {/* Sequential Number Box */}
      <rect x="340" y="65" width="45" height="20" fill="none" stroke="#000" strokeWidth="0.5" />
      <text x="362" y="79" textAnchor="middle" fontSize="10" fontFamily="Arial">
        #{padOptions.startingNumber || '0001'}
      </text>
      
      {/* Warning Band */}
      {showWarningBand && (
        <g>
          <rect x="10" y="95" width="376" height="14" fill="#8B7355" />
          <text x="198" y="105" textAnchor="middle" fill="#fff" fontSize="5" fontFamily="Arial" fontStyle="italic" fontWeight="bold">
            {config.warningBand.text}
          </text>
        </g>
      )}
      
      {/* Form Fields */}
      {/* Name line with microprint */}
      <text x="15" y="130" fontSize="9" fontFamily="Arial">Name</text>
      <line x1="42" y1="130" x2="280" y2="130" stroke="#000" strokeWidth="0.5" />
      {showMicroprint && (
        <text x="42" y="132" fontSize="1.5" fontFamily="Arial" fill="#999">
          {config.microprint.text.repeat(20)}
        </text>
      )}
      <text x="290" y="130" fontSize="9" fontFamily="Arial">M / F</text>
      <text x="320" y="130" fontSize="9" fontFamily="Arial">DOB</text>
      <line x1="340" y1="130" x2="385" y2="130" stroke="#000" strokeWidth="0.5" />
      
      {/* Address line with microprint */}
      <text x="15" y="150" fontSize="9" fontFamily="Arial">Address</text>
      <line x1="52" y1="150" x2="300" y2="150" stroke="#000" strokeWidth="0.5" />
      {showMicroprint && (
        <text x="52" y="152" fontSize="1.5" fontFamily="Arial" fill="#999">
          {config.microprint.text.repeat(20)}
        </text>
      )}
      <text x="310" y="150" fontSize="9" fontFamily="Arial">Date</text>
      <line x1="335" y1="150" x2="385" y2="150" stroke="#000" strokeWidth="0.5" />
      
      {/* Large Rx Symbol */}
      <text x="20" y="200" fontSize="36" fontFamily="Times New Roman" fontWeight="bold">
        ℞
      </text>
      
      {/* Refill Column */}
      <text x="365" y="165" fontSize="8" fontFamily="Arial" fontWeight="bold" textDecoration="underline">Refill</text>
      {['NR', '1', '2', '3', '4', '5', 'PRN'].map((label, i) => (
        <text key={label} x="370" y={178 + (i * 12)} fontSize="8" fontFamily="Arial" textAnchor="middle">
          {label}
        </text>
      ))}
      
      {/* Void After */}
      <text x="15" y="265" fontSize="8" fontFamily="Arial">Void After</text>
      <line x1="55" y1="265" x2="150" y2="265" stroke="#000" strokeWidth="0.5" />
      
      {/* Do Not Substitute */}
      <rect x="15" y="275" width="8" height="8" fill="none" stroke="#000" strokeWidth="0.5" />
      <text x="27" y="282" fontSize="7" fontFamily="Arial" fontWeight="bold">
        Do Not Substitute - Dispense as Written
      </text>
      
      {/* Signature Line */}
      <line x1="200" y1="280" x2="320" y2="280" stroke="#000" strokeWidth="0.5" />
      <text x="260" y="290" fontSize="10" fontFamily="Brush Script MT, cursive" textAnchor="middle">
        Signature
      </text>
      
      {/* Disclaimer */}
      <text x="198" y="300" textAnchor="middle" fontSize="5" fontFamily="Arial">
        {config.disclaimer}
      </text>
      
      {/* RxForms Logo - positioned bottom right */}
      {/* Using text placeholder - in production, use <image> element */}
      <text x="360" y="298" fontSize="8" fontFamily="Arial" fontWeight="bold">
        RxFORMS.com
      </text>
    </svg>
  );
}
```

### SecurityToggle.jsx

```jsx
// Radio button group for security level selection
// Props: securityLevel, setSecurityLevel, availableLevels

// Display as horizontal toggle buttons:
// [● Maximum Security] [○ Minimum Security] [○ Standard]

// Clicking any option immediately updates securityLevel state,
// which causes PreviewPanel to swap background and 
// PrescriptionPadSVG to show/hide microprint and warning band
```

### PricingTable.jsx

```jsx
// Displays pricing matrix for all security levels
// Props: securityLevel (to highlight selected row)

// Layout:
// ┌──────────────────────────────────────────────────────────────┐
// │  PRICING           8      16      24      40      80  pads  │
// │  ─────────────────────────────────────────────────────────── │
// │  ● Maximum       $135    $210    $295    $450    $775       │  ← highlighted row
// │  ○ Minimum        $95    $155    $215    $325    $595       │
// │  ○ Standard       $55     $85    $125    $195    $295       │
// └──────────────────────────────────────────────────────────────┘

// Clicking a row should also change the security level selection
```

### HelpExpander.jsx

```jsx
// Expandable help text for "[?] Which should I choose?"
// Props: none (content is static)

// Collapsed: "[?] Which should I choose?"
// Expanded:
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Which security level do I need?                               [×] │
// │  ───────────────────────────────────────────────────────────────── │
// │                                                                    │
// │  Prescribing controlled substances (Schedule II-V)?                │
// │  → Maximum Security is required by law                             │
// │                                                                    │
// │  General prescriptions for Medicaid patients?                      │
// │  → Minimum Security meets federal tamper-resistant requirements    │
// │                                                                    │
// │  Private-pay patients, non-controlled only?                        │
// │  → Standard pads are sufficient and most economical                │
// │                                                                    │
// │  Not sure? Maximum Security works for all prescription types.      │
// └─────────────────────────────────────────────────────────────────────┘
```

### ProofApproval.jsx

```jsx
// Full-screen proof review before ordering
// Props: practices, prescribers, padOptions, securityLevel, onApprove, onEdit

// Layout:
// - Large preview showing pad with selected security background
// - Summary of entered information
// - Approval checkbox: "I confirm this proof is accurate and ready for printing"
// - [← Edit Design] [Approve & Continue →] buttons

// The preview here should be larger than in the builder,
// allowing careful inspection of all details.

// Include text: "This is exactly how your {securityLevel} prescription pad will appear."
```

### OrderOptions.jsx

```jsx
// Final order configuration before checkout
// Props: securityLevel, orderOptions, setOrderOptions, onBack, onComplete

// Layout:
// - Small preview thumbnail with selected security background
// - Security level display (with option to change, which returns to Review)
// - Quantity selector (visual buttons, not dropdown): 8, 16, 24, 40, 80
// - Paper type radio: Single Ply / 2-Part Carbonless (+$25)
// - Production time radio: Standard (5-7 days) / Rush (+$35)
// - Running total calculation
// - [← Back to Proof] [Generate PDF & Complete →] buttons

// "Generate PDF & Complete" triggers PDF export and shows success state
```

### src/utils/pdfExport.js

```javascript
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

export async function exportPrescriptionPadPDF(svgElement, filename = 'prescription-pad.pdf') {
  // Create PDF at 5.5" × 4.25" (half letter, landscape orientation of the pad)
  // 1 inch = 72 points in PDF
  const width = 5.5 * 72; // 396 points
  const height = 4.25 * 72; // 306 points
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [width, height],
  });
  
  // Convert SVG to PDF
  // svg2pdf.js renders the SVG directly into the PDF
  await pdf.svg(svgElement, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });
  
  // Save the PDF
  pdf.save(filename);
  
  return true;
}

// Usage in component:
// const svgRef = useRef();
// ...
// <PrescriptionPadSVG ref={svgRef} ... />
// ...
// await exportPrescriptionPadPDF(svgRef.current, 'my-prescription-pad.pdf');
```

---

## Styling Guidelines

Use Tailwind CSS for all styling. Key design tokens:

```javascript
// Colors (add to tailwind.config.js)
colors: {
  'rxforms-blue': '#1a56db',
  'rxforms-gold': '#d4a843',
  'security-band': '#8B7355',
}

// The UI should feel clean, professional, medical-appropriate
// - White/light gray backgrounds
// - Blue primary actions
// - Clear typography hierarchy
// - Adequate spacing for form fields
// - Subtle shadows for depth on preview panel
```

### Layout Structure

```jsx
// App.jsx layout
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white border-b px-6 py-4">
    <h1>Arizona Prescription Rx Pads</h1>
  </header>
  
  {/* Progress Bar */}
  <ProgressBar currentStep={currentStep} onStepClick={setCurrentStep} />
  
  {/* Main Content - Two Column */}
  <main className="flex gap-8 p-6 max-w-7xl mx-auto">
    {/* Left: Form Area */}
    <div className="flex-1 max-w-xl">
      {currentStep === 'practice' && <PracticeForm ... />}
      {currentStep === 'prescribers' && <PrescriberForm ... />}
      {currentStep === 'review' && <ProofApproval ... />}
      {currentStep === 'order' && <OrderOptions ... />}
    </div>
    
    {/* Right: Preview Panel (sticky) */}
    <div className="w-[500px] sticky top-6 self-start">
      <PreviewPanel ... />
    </div>
  </main>
</div>
```

---

## Key Interactions

### 1. Sample Data Prefill
When "Use sample data" checkbox is clicked:
- Immediately populate all form fields with data from sampleData.js
- Preview updates in real-time as fields populate

### 2. Real-Time Preview Updates
Every keystroke in any form field should immediately update the SVG preview:
- Use controlled inputs with onChange
- Pass form state directly to PrescriptionPadSVG
- No "refresh" button needed

### 3. Security Level Toggle
When security level changes:
- Background image swaps instantly (CSS background-image change)
- SVG re-renders to show/hide microprint and warning band
- Pricing table highlights the new selected row

### 4. Add Location / Add Prescriber
When clicking "+ Add another location" or "+ Add another prescriber":
- New empty object added to practices/prescribers array
- Form expands to show new fields
- Focus moves to first field of new entry
- Preview updates to show placeholder for new entry

### 5. Navigation
- Progress bar steps are clickable for completed sections
- "Back" button always available (except on first step)
- "Continue" validates current section before advancing
- Can jump backward freely, forward only after completion

### 6. PDF Generation
When "Generate PDF" is clicked:
1. Get reference to the SVG element (without background)
2. Call exportPrescriptionPadPDF()
3. Browser downloads the PDF
4. Show success message

---

## Testing Checklist

After building, verify:

- [ ] Sample data prefill works for both practice and prescriber forms
- [ ] All form fields update preview in real-time
- [ ] Security level toggle swaps background image
- [ ] Microprint appears only on Maximum Security
- [ ] Warning band appears on Maximum and Minimum, not Standard
- [ ] DEA number validation shows error for invalid format
- [ ] Can add second location, and it appears in preview
- [ ] Can add second prescriber, and they appear in preview
- [ ] Progress bar shows checkmarks for completed sections
- [ ] Can navigate back via progress bar
- [ ] Review screen shows full proof with correct background
- [ ] Approval checkbox enables "Continue" button
- [ ] Order screen calculates total correctly with modifiers
- [ ] PDF downloads successfully
- [ ] PDF contains only foreground (no background image)
- [ ] PDF dimensions are correct (5.5" × 4.25")

---

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

Ensure `vercel.json` or Vite config handles SPA routing if needed.

---

## Future Enhancements (Not in POC)

- Multiple state configurations
- Convex backend for data persistence
- User authentication
- Stripe checkout integration
- Order history / reordering
- Admin dashboard
- DEA verification API integration
- Additional product types (business cards, banners)
