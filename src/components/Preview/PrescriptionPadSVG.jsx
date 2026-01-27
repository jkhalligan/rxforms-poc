import React from 'react';
import { arizonaConfig } from '../../config/arizona';

export function PrescriptionPadSVG({ practices, prescribers, padOptions, securityLevel }) {
  const config = arizonaConfig;
  const showMicroprint = config.microprint.showOn.includes(securityLevel);
  const showWarningBand = config.warningBand.showOn.includes(securityLevel);
  
  const hasPracticeData = practices[0]?.name;
  const hasPrescriberData = prescribers[0]?.name;
  
  if (!hasPracticeData && !hasPrescriberData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-center p-8">
        <div>
          <p className="text-sm font-medium">Fill in the form to see your preview</p>
          <p className="text-xs mt-1">Your prescription pad will appear here</p>
        </div>
      </div>
    );
  }

  // Format practice display
  const practice = practices[0] || {};
  const practiceAddress = [practice.address, practice.city, practice.state, practice.zip]
    .filter(Boolean)
    .join(', ');

  const formatPrescriberDetails = (p) => {
    const parts = [];
    if (!p.hideLicense && p.licenseNumber) {
      parts.push(`Lic# ${p.licenseNumber}`);
    }
    if (p.deaNumber) {
      parts.push(`DEA# ${p.deaNumber}`);
    }
    return parts.join('  ');
  };

  const renderPrescribers = (validPrescribers, yStart = 58) => {
    if (validPrescribers.length === 0) {
      return (
        <text x="198" y={yStart + 10} textAnchor="middle" fontSize="11" fill="#9ca3af" fontFamily="Arial, sans-serif">
          Prescriber Name, MD
        </text>
      );
    }
    
    if (validPrescribers.length === 1) {
      const p = validPrescribers[0];
      return (
        <g>
          <text x="198" y={yStart + 10} textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">
            {p.name}{p.credentials ? `, ${p.credentials}` : ''}
          </text>
          <text x="198" y={yStart + 22} textAnchor="middle" fontSize="8" fontFamily="Arial, sans-serif">
            {formatPrescriberDetails(p)}
          </text>
        </g>
      );
    }
    
    if (validPrescribers.length === 2) {
      return (
        <g>
          {validPrescribers.map((p, i) => {
            const xPos = i === 0 ? 100 : 296;
            return (
              <g key={i}>
                <text x={xPos} y={yStart + 10} textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">
                  {p.name}{p.credentials ? `, ${p.credentials}` : ''}
                </text>
                <text x={xPos} y={yStart + 20} textAnchor="middle" fontSize="6" fontFamily="Arial, sans-serif">
                  {formatPrescriberDetails(p)}
                </text>
              </g>
            );
          })}
        </g>
      );
    }
    
    if (validPrescribers.length <= 4) {
      const positions = [
        { x: 100, y: yStart },
        { x: 296, y: yStart },
        { x: 100, y: yStart + 24 },
        { x: 296, y: yStart + 24 },
      ];
      
      return (
        <g>
          {validPrescribers.map((p, i) => {
            const pos = positions[i];
            return (
              <g key={i}>
                <text x={pos.x} y={pos.y + 10} textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">
                  {p.name}{p.credentials ? `, ${p.credentials}` : ''}
                </text>
                <text x={pos.x} y={pos.y + 18} textAnchor="middle" fontSize="5" fontFamily="Arial, sans-serif">
                  {formatPrescriberDetails(p)}
                </text>
              </g>
            );
          })}
        </g>
      );
    }
    
    const positions = [
      { x: 70, y: yStart },
      { x: 198, y: yStart },
      { x: 326, y: yStart },
      { x: 70, y: yStart + 22 },
      { x: 198, y: yStart + 22 },
      { x: 326, y: yStart + 22 },
    ];
    
    return (
      <g>
        {validPrescribers.map((p, i) => {
          const pos = positions[i];
          return (
            <g key={i}>
              <text x={pos.x} y={pos.y + 8} textAnchor="middle" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif">
                {p.name}{p.credentials ? `, ${p.credentials}` : ''}
              </text>
              <text x={pos.x} y={pos.y + 15} textAnchor="middle" fontSize="4.5" fontFamily="Arial, sans-serif">
                {formatPrescriberDetails(p)}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  const validPrescribers = prescribers.filter(p => p.name);

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
      {renderPrescribers(validPrescribers)}
      
      {/* Sequential Number Box */}
      <rect x="340" y="65" width="45" height="20" fill="none" stroke="#000" strokeWidth="0.5" />
      <text x="362" y="79" textAnchor="middle" fontSize="10" fontFamily="Arial, sans-serif">
        #{padOptions.startingNumber || '0001'}
      </text>
      
      {/* Warning Band */}
      {showWarningBand && (
        <g className="warning-band">
          <rect x="10" y="95" width="376" height="14" fill="#8B7355" />
          <text x="198" y="105" textAnchor="middle" fill="#fff" fontSize="5" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold">
            {config.warningBand.text}
          </text>
        </g>
      )}
      
      {/* Form Fields */}
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
      
      <text x="15" y="150" fontSize="9" fontFamily="Arial, sans-serif">Address</text>
      <line x1="52" y1="150" x2="300" y2="150" stroke="#000" strokeWidth="0.5" />
      {showMicroprint && (
        <text x="52" y="152" fontSize="1.5" fontFamily="Arial, sans-serif" fill="#999">
          {config.microprint.text.repeat(20)}
        </text>
      )}
      <text x="310" y="150" fontSize="9" fontFamily="Arial, sans-serif">Date</text>
      <line x1="335" y1="150" x2="385" y2="150" stroke="#000" strokeWidth="0.5" />
      
      <text x="20" y="200" fontSize="36" fontFamily="serif" fontWeight="bold">℞</text>
      
      <text x="365" y="165" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold" textDecoration="underline">Refill</text>
      {['NR', '1', '2', '3', '4', '5', 'PRN'].map((label, i) => (
        <text key={label} x="370" y={178 + (i * 12)} fontSize="8" fontFamily="Arial, sans-serif" textAnchor="middle">
          {label}
        </text>
      ))}
      
      <text x="15" y="265" fontSize="8" fontFamily="Arial, sans-serif">Void After</text>
      <line x1="55" y1="265" x2="150" y2="265" stroke="#000" strokeWidth="0.5" />
      
      <rect x="15" y="275" width="8" height="8" fill="none" stroke="#000" strokeWidth="0.5" />
      <text x="27" y="282" fontSize="7" fontFamily="Arial, sans-serif" fontWeight="bold">
        Do Not Substitute - Dispense as Written
      </text>
      
      <line x1="200" y1="280" x2="320" y2="280" stroke="#000" strokeWidth="0.5" />
      <text x="260" y="290" fontSize="10" fontFamily="cursive" fontStyle="italic" textAnchor="middle">Signature</text>
      
      <text x="198" y="300" textAnchor="middle" fontSize="5" fontFamily="Arial, sans-serif">{config.disclaimer}</text>
      
      <text x="380" y="298" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="end">RxFORMS.com</text>
    </svg>
  );
}