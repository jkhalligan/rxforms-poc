import React from 'react';
import { arizonaConfig } from '../../config/arizona';

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
      className="w-full h-full"
    >
      {/* Practice Header */}
      <text x="198" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
        {practice.name || 'Practice Name'}
      </text>
      <text x="198" y="38" textAnchor="middle" fontSize="8" fontFamily="Arial, sans-serif">
        {practiceAddress || 'Address, City, State ZIP'}
      </text>
      <text x="198" y="50" textAnchor="middle" fontSize="8" fontFamily="Arial, sans-serif">
        {practice.phone ? `P: ${practice.phone}` : ''}
        {practice.fax ? ` F: ${practice.fax}` : ''}
      </text>
      
      {/* Prescriber Info */}
      {prescribers.map((prescriber, index) => (
        <g key={index}>
          <text x="198" y={68 + (index * 24)} textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">
            {prescriber.name ? `${prescriber.name}, ${prescriber.credentials || ''}` : 'Prescriber Name, MD'}
          </text>
          <text x="198" y={80 + (index * 24)} textAnchor="middle" fontSize="8" fontFamily="Arial, sans-serif">
            {!prescriber.hideLicense && prescriber.licenseNumber ? `Lic# ${prescriber.licenseNumber}` : ''}
            {prescriber.deaNumber ? `    DEA# ${prescriber.deaNumber}` : ''}
          </text>
        </g>
      ))}
      
      {/* Sequential Number Box */}
      <rect x="340" y="65" width="45" height="20" fill="none" stroke="#000" strokeWidth="0.5" />
      <text x="362" y="79" textAnchor="middle" fontSize="10" fontFamily="Arial, sans-serif">
        #{padOptions.startingNumber || '0001'}
      </text>
      
      {/* Warning Band */}
      {showWarningBand && (
        <g>
          <rect x="10" y="95" width="376" height="14" fill="#8B7355" />
          <text x="198" y="105" textAnchor="middle" fill="#fff" fontSize="5" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">
            {config.warningBand.text}
          </text>
        </g>
      )}
      
      {/* Form Fields */}
      {/* Name line with microprint */}
      <text x="15" y="130" fontSize="9" fontFamily="Arial, sans-serif">Name</text>
      <line x1="42" y1="130" x2="280" y2="130" stroke="#000" strokeWidth="0.5" />
      {showMicroprint && (
        <text x="42" y="132" fontSize="1.5" fontFamily="Arial, sans-serif" fill="#999">
          {config.microprint.text.repeat(20)}
        </text>
      )}
      <text x="290" y="130" fontSize="9" fontFamily="Arial, sans-serif">M / F</text>
      <text x="320" y="130" fontSize="9" fontFamily="Arial, sans-serif">DOB</text>
      <line x1="340" y1="130" x2="385" y2="130" stroke="#000" strokeWidth="0.5" />
      
      {/* Address line with microprint */}
      <text x="15" y="150" fontSize="9" fontFamily="Arial, sans-serif">Address</text>
      <line x1="52" y1="150" x2="300" y2="150" stroke="#000" strokeWidth="0.5" />
      {showMicroprint && (
        <text x="52" y="152" fontSize="1.5" fontFamily="Arial, sans-serif" fill="#999">
          {config.microprint.text.repeat(20)}
        </text>
      )}
      <text x="310" y="150" fontSize="9" fontFamily="Arial, sans-serif">Date</text>
      <line x1="335" y1="150" x2="385" y2="150" stroke="#000" strokeWidth="0.5" />
      
      {/* Large Rx Symbol */}
      <text x="20" y="200" fontSize="36" fontFamily="serif" fontWeight="bold">
        ℞
      </text>
      
      {/* Refill Column */}
      <text x="365" y="165" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold" textDecoration="underline">Refill</text>
      {['NR', '1', '2', '3', '4', '5', 'PRN'].map((label, i) => (
        <text key={label} x="370" y={178 + (i * 12)} fontSize="8" fontFamily="Arial, sans-serif" textAnchor="middle">
          {label}
        </text>
      ))}
      
      {/* Void After */}
      <text x="15" y="265" fontSize="8" fontFamily="Arial, sans-serif">Void After</text>
      <line x1="55" y1="265" x2="150" y2="265" stroke="#000" strokeWidth="0.5" />
      
      {/* Do Not Substitute */}
      <rect x="15" y="275" width="8" height="8" fill="none" stroke="#000" strokeWidth="0.5" />
      <text x="27" y="282" fontSize="7" fontFamily="Arial, sans-serif" fontWeight="bold">
        Do Not Substitute - Dispense as Written
      </text>
      
      {/* Signature Line */}
      <line x1="200" y1="280" x2="320" y2="280" stroke="#000" strokeWidth="0.5" />
      <text x="260" y="290" fontSize="10" fontFamily="cursive" fontStyle="italic" textAnchor="middle">
        Signature
      </text>
      
      {/* Disclaimer */}
      <text x="198" y="300" textAnchor="middle" fontSize="5" fontFamily="Arial, sans-serif">
        {config.disclaimer}
      </text>
      
      {/* RxForms Logo Placeholder */}
      <text x="380" y="298" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="end">
        RxFORMS.com
      </text>
    </svg>
  );
}
