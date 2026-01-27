import React, { useRef } from 'react';
import { Button } from '../ui/Button';
import { arizonaPricing, quantities, paperTypes, productionTimes } from '../../config/pricing';
import { PrescriptionPadSVG } from '../Preview/PrescriptionPadSVG';
import { exportPrescriptionPadPDF } from '../../utils/pdfExport';

export function OrderOptions({ 
  practices, 
  prescribers, 
  padOptions, 
  securityLevel, 
  orderOptions, 
  setOrderOptions, 
  onBack, 
  onComplete 
}) {
  const svgRef = useRef();

  const basePrice = arizonaPricing[securityLevel].prices[orderOptions.quantity];
  const paperModifier = paperTypes.find(p => p.id === orderOptions.paperType).priceModifier;
  const productionModifier = productionTimes.find(p => p.id === orderOptions.productionTime).priceModifier;
  const totalPrice = basePrice + paperModifier + productionModifier;

  const handleDownload = async () => {
    const svgElement = svgRef.current.querySelector('svg');
    await exportPrescriptionPadPDF(svgElement, `RxPad-${securityLevel}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Finalize Order</h2>
        <p className="text-gray-500 mt-1">Configure your quantity and production options.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity (Pads)</label>
            <div className="grid grid-cols-5 gap-2">
              {quantities.map(q => (
                <button
                  key={q}
                  onClick={() => setOrderOptions({ ...orderOptions, quantity: q })}
                  className={`py-2 text-sm font-bold rounded-md border transition-all ${
                    orderOptions.quantity === q
                      ? 'bg-rxforms-blue text-white border-rxforms-blue shadow-md'
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
            <label className="block text-sm font-semibold text-gray-700 mb-3">Paper Type</label>
            <div className="space-y-2">
              {paperTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setOrderOptions({ ...orderOptions, paperType: type.id })}
                  className={`w-full p-3 text-left rounded-lg border transition-all flex justify-between items-center ${
                    orderOptions.paperType === type.id
                      ? 'bg-blue-50 border-rxforms-blue'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <p className={`font-semibold ${orderOptions.paperType === type.id ? 'text-rxforms-blue' : 'text-gray-800'}`}>
                      {type.name}
                    </p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                  {type.priceModifier > 0 && <span className="text-sm font-bold text-green-600">+${type.priceModifier}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Production Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Production Time</label>
            <div className="space-y-2">
              {productionTimes.map(time => (
                <button
                  key={time.id}
                  onClick={() => setOrderOptions({ ...orderOptions, productionTime: time.id })}
                  className={`w-full p-3 text-left rounded-lg border transition-all flex justify-between items-center ${
                    orderOptions.productionTime === time.id
                      ? 'bg-blue-50 border-rxforms-blue'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <p className={`font-semibold ${orderOptions.productionTime === time.id ? 'text-rxforms-blue' : 'text-gray-800'}`}>
                      {time.name}
                    </p>
                    <p className="text-xs text-gray-500">{time.description}</p>
                  </div>
                  {time.priceModifier > 0 && <span className="text-sm font-bold text-green-600">+${time.priceModifier}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl h-fit sticky top-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            Order Summary
          </h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>{orderOptions.quantity} Pads ({arizonaPricing[securityLevel].name})</span>
              <span className="text-white font-medium">${basePrice}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Paper: {paperTypes.find(p => p.id === orderOptions.paperType).name}</span>
              <span className="text-white font-medium">${paperModifier}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Ship: {productionTimes.find(p => p.id === orderOptions.productionTime).name}</span>
              <span className="text-white font-medium">${productionModifier}</span>
            </div>
            
            <div className="pt-4 border-t border-gray-700 mt-4 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Amount</p>
                <p className="text-3xl font-bold text-rxforms-gold">${totalPrice}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Button onClick={handleDownload} variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
              Download PDF Proof
            </Button>
            <Button onClick={onComplete} className="w-full bg-rxforms-gold hover:bg-yellow-600 text-gray-900 border-none">
              Complete Order
            </Button>
            <button onClick={onBack} className="w-full text-center text-xs text-gray-500 hover:text-gray-300 mt-2">
              ← Go back to Review
            </button>
          </div>
        </div>
      </div>

      {/* Hidden SVG for PDF Generation */}
      <div ref={svgRef} className="hidden">
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
