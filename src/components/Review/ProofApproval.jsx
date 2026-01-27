import React from 'react';
import { PrescriptionPadSVG } from '../Preview/PrescriptionPadSVG';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';

export function ProofApproval({ practices, prescribers, padOptions, securityLevel, proofApproved, setProofApproved, onApprove, onEdit }) {
  const getBackgroundClass = () => {
    switch (securityLevel) {
      case 'maximum-security': return 'bg-[#f5e6d3] bg-diagonal-pattern-rich';
      case 'minimum-security': return 'bg-[#faf3e8] bg-diagonal-pattern-light';
      default: return 'bg-white';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review Your Proof</h2>
        <p className="text-gray-500 mt-1">Please inspect all details carefully before proceeding.</p>
      </div>

      <div className={`relative aspect-[5.5/4.25] w-full border border-gray-300 shadow-xl overflow-hidden rounded-md max-w-2xl mx-auto ${getBackgroundClass()}`}>
        {securityLevel === 'maximum-security' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-[160px] font-serif font-bold">℞</span>
          </div>
        )}
        <div className="relative z-10 w-full h-full p-4">
          <PrescriptionPadSVG 
            practices={practices} 
            prescribers={prescribers} 
            padOptions={padOptions} 
            securityLevel={securityLevel} 
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
        <h3 className="font-bold text-gray-800">Verification Checklist</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">✓ Practice address and phone are correct</li>
          <li className="flex items-center gap-2">✓ Prescriber name(s) and credentials are accurate</li>
          <li className="flex items-center gap-2">✓ License and DEA numbers are verified</li>
          <li className="flex items-center gap-2">✓ Security tier ({securityLevel}) is correct for your needs</li>
        </ul>
        
        <div className="pt-4 border-t border-gray-100 mt-4">
          <Checkbox 
            label="I confirm this proof is accurate and ready for printing"
            description="I understand that changes cannot be made after the order is placed."
            checked={proofApproved}
            onChange={(e) => setProofApproved(e.target.checked)}
          />
        </div>
      </div>

      <div className="pt-4 flex items-center gap-4">
        <Button variant="secondary" onClick={onEdit} className="flex-1">
          Edit Design
        </Button>
        <Button 
          onClick={onApprove} 
          disabled={!proofApproved}
          className={`flex-[2] ${!proofApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Approve & Continue
        </Button>
      </div>
    </div>
  );
}
