import React from 'react';
import { arizonaPricing, quantities } from '../../config/pricing';

export function PricingTable({ securityLevel, setSecurityLevel }) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <table className="w-full text-left text-xs">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-2 font-semibold text-gray-600">Tier</th>
            {quantities.map(q => (
              <th key={q} className="px-2 py-2 font-semibold text-gray-600 text-center">{q} pads</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Object.entries(arizonaPricing).map(([id, data]) => (
            <tr 
              key={id} 
              onClick={() => setSecurityLevel(id)}
              className={`cursor-pointer transition-colors ${
                securityLevel === id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <td className="px-3 py-3 font-medium">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    securityLevel === id ? 'bg-rxforms-blue' : 'bg-gray-300'
                  }`}></div>
                  {data.name.split(' ')[0]}
                </div>
              </td>
              {quantities.map(q => (
                <td key={q} className={`px-2 py-3 text-center ${
                  securityLevel === id ? 'text-rxforms-blue font-bold' : 'text-gray-600'
                }`}>
                  ${data.prices[q]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
