import React from 'react';
import { Checkbox } from '../ui/Checkbox';

export function ProofApproval({ securityLevel, proofApproved, setProofApproved }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review Your Proof</h2>
        <p className="text-gray-500 mt-1">Please inspect all details carefully before proceeding.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
        <h3 className="font-bold text-gray-800">Verification Checklist</h3>
        <ul className="space-y-3">
          {[
            'Practice address and phone are correct',
            'Prescriber name(s) and credentials are accurate',
            'License and DEA numbers are verified',
            `Security tier (${securityLevel}) is correct for your needs`
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-5 h-5 rounded-full bg-success-light text-success flex items-center justify-center text-[10px] font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
        
        <div className="pt-6 border-t border-gray-100 mt-6">
          <Checkbox 
            label="I confirm this proof is accurate and ready for printing"
            description="I understand that changes cannot be made after the order is placed."
            checked={proofApproved}
            onChange={(e) => setProofApproved(e.target.checked)}
          />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Important:</span> This is a digital proof for screen verification. The final printed product will match the layout and black-ink details shown in the preview. Security backgrounds are for demonstration and will be professionally printed on secure paper.
        </p>
      </div>
    </div>
  );
}