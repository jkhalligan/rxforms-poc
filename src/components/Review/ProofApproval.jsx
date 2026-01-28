import React from 'react';
import { Checkbox } from '../ui/Checkbox';

const CheckIcon = () => (
  <svg className="w-4.5 h-4.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export function ProofApproval({ securityLevel, proofApproved, setProofApproved }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review Your Proof</h2>
        <p className="text-gray-500 mt-1">Please inspect all details carefully before proceeding.</p>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="bg-bg-subtle px-5 py-3 border-b border-border-light">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verification Checklist</h3>
        </div>
        
        <div className="p-5 space-y-1">
          {[
            'Practice address and phone are correct',
            'Prescriber name(s) and credentials are accurate',
            'License and DEA numbers are verified',
            `Security tier (${securityLevel}) is correct for your needs`
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 text-sm text-text-secondary">
              <CheckIcon />
              {item}
            </div>
          ))}
        </div>
        
        <div className="p-5 pt-0">
          <div className="mt-4 pt-6 border-t border-border flex flex-col gap-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary transition-all"
                  checked={proofApproved}
                  onChange={(e) => setProofApproved(e.target.checked)}
                />
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                  I confirm this proof is accurate and ready for printing
                </p>
                <p className="text-gray-500 mt-1">
                  I understand that changes cannot be made after the order is placed.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
        <p className="text-[11px] text-amber-800 leading-relaxed">
          <span className="font-bold uppercase tracking-wider">Important:</span> This is a digital proof for screen verification. The final printed product will match the layout and black-ink details shown in the preview. Security backgrounds are for demonstration and will be professionally printed on secure paper.
        </p>
      </div>
    </div>
  );
}
