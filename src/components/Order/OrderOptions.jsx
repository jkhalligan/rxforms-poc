import React, { useRef } from 'react';
import { Button } from '../ui/Button';
import { arizonaPricing, quantities, paperTypes, productionTimes } from '../../config/pricing';
import { PrescriptionPadSVG } from '../Preview/PrescriptionPadSVG';
import { exportPrescriptionPadPDF, getSvgElement } from '../../utils/pdfExport';

export function OrderOptions({ 
  practices, 
  prescribers, 
  padOptions, 
  securityLevel, 
  orderOptions, 
  setOrderOptions, 
  onComplete 
}) {
  const svgRef = useRef();

  const basePrice = arizonaPricing[securityLevel].prices[orderOptions.quantity];
  const paperModifier = paperTypes.find(p => p.id === orderOptions.paperType).priceModifier;
  const productionModifier = productionTimes.find(p => p.id === orderOptions.productionTime).priceModifier;
  const totalPrice = basePrice + paperModifier + productionModifier;

  const handleDownload = async () => {
    const svgElement = getSvgElement(svgRef);
    if (svgElement) {
      await exportPrescriptionPadPDF(svgElement, `RxPad-Proof-${securityLevel}.pdf`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Finalize Order</h2>
        <p className="text-gray-500 mt-1">Configure your quantity and production options.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider text-[10px]">Quantity (Pads)</label>
          <div className="grid grid-cols-5 gap-2">
            {quantities.map(q => (
              <button
                key={q}
                onClick={() => setOrderOptions({ ...orderOptions, quantity: q })}
                className={`py-3 text-sm font-bold rounded-lg border transition-all ${
                  orderOptions.quantity === q
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Paper Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider text-[10px]">Paper Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paperTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setOrderOptions({ ...orderOptions, paperType: type.id })}
                className={`p-4 text-left rounded-lg border transition-all flex justify-between items-center ${
                  orderOptions.paperType === type.id
                    ? 'bg-primary-light border-primary ring-1 ring-primary'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className={`font-semibold ${orderOptions.paperType === type.id ? 'text-primary' : 'text-gray-800'}`}>
                    {type.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                </div>
                {type.priceModifier > 0 && <span className="text-sm font-bold text-success">+${type.priceModifier}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Production Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider text-[10px]">Production Time</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {productionTimes.map(time => (
              <button
                key={time.id}
                onClick={() => setOrderOptions({ ...orderOptions, productionTime: time.id })}
                className={`p-4 text-left rounded-lg border transition-all flex justify-between items-center ${
                  orderOptions.productionTime === time.id
                    ? 'bg-primary-light border-primary ring-1 ring-primary'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className={`font-semibold ${orderOptions.productionTime === time.id ? 'text-primary' : 'text-gray-800'}`}>
                    {time.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{time.description}</p>
                </div>
                {time.priceModifier > 0 && <span className="text-sm font-bold text-success">+${time.priceModifier}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Order Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">{orderOptions.quantity} Pads ({arizonaPricing[securityLevel].name})</span>
            <span className="font-bold">${basePrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Paper: {paperTypes.find(p => p.id === orderOptions.paperType).name}</span>
            <span className="font-bold">${paperModifier}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Production: {productionTimes.find(p => p.id === orderOptions.productionTime).name}</span>
            <span className="font-bold">${productionModifier}</span>
          </div>
          <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
            <span className="text-lg">Total Amount</span>
            <span className="text-3xl font-bold text-rxforms-gold">${totalPrice}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button 
            onClick={handleDownload} 
            className="flex-1 py-3 px-4 rounded-lg border border-gray-700 font-bold hover:bg-gray-800 transition-colors"
          >
            Download PDF Proof
          </button>
          <button 
            onClick={onComplete} 
            className="flex-[2] py-3 px-4 rounded-lg bg-rxforms-gold text-gray-900 font-bold hover:bg-yellow-500 transition-colors"
          >
            Complete Order
          </button>
        </div>
      </div>

      {/* Hidden SVG for PDF export (foreground only) */}
      <div ref={svgRef} className="hidden" aria-hidden="true">
        <PrescriptionPadSVG 
          practices={practices} 
          prescribers={prescribers} 
          padOptions={padOptions} 
          securityLevel={securityLevel} 
        />
      </div>
    </div>
  );
}