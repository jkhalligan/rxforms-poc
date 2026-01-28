import React from 'react';
import { PrescriptionPadSVG } from '../Preview/PrescriptionPadSVG';

export function CheckoutSidebar({
  practices,
  prescribers,
  padOptions,
  securityLevel,
  quantity,
  paperType,
  productionTime,
  basePrice,
}) {
  const prescriberCount = prescribers.filter(p => p.name).length;

  // Calculate prices
  const paperModifier = paperType === 'carbonless-2' ? 25 : 0;
  const productionModifier = productionTime === 'rush' ? 35 : 0;
  const subtotal = basePrice + paperModifier + productionModifier;

  // Shipping cost based on production time
  const shippingCost = productionTime === 'rush' ? 25 : 12;

  // Calculate tax (8% of subtotal)
  const taxAmount = Math.round(subtotal * 0.08);

  // Total
  const total = subtotal + shippingCost + taxAmount;

  const getSecurityLabel = () => {
    if (securityLevel === 'maximum-security') return 'Maximum Security';
    if (securityLevel === 'minimum-security') return 'Minimum Security';
    return 'Standard';
  };

  return (
    <div className="checkout-sidebar">
      <div className="checkout-sidebar-card">
        <h3 className="checkout-sidebar-title">Order Summary</h3>

        {/* Prescription Pad Thumbnail */}
        <div className="checkout-pad-thumbnail">
          <div
            className={`checkout-pad-preview preview-bg--${securityLevel}`}
          >
            <PrescriptionPadSVG
              practices={practices}
              prescribers={prescribers}
              padOptions={padOptions}
              securityLevel={securityLevel}
            />
          </div>

          <div className="checkout-pad-info">
            <div className="checkout-pad-security">{getSecurityLabel()}</div>
            <div className="checkout-pad-meta">
              Arizona · {prescriberCount} Prescriber{prescriberCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="checkout-divider" />

        {/* Price Breakdown */}
        <div className="checkout-prices">
          <div className="checkout-price-line">
            <span>{quantity} Pads</span>
            <span>${basePrice}</span>
          </div>

          {paperModifier > 0 && (
            <div className="checkout-price-line">
              <span>2-Part Carbonless</span>
              <span>+${paperModifier}</span>
            </div>
          )}

          {productionModifier > 0 && (
            <div className="checkout-price-line">
              <span>Rush Production</span>
              <span>+${productionModifier}</span>
            </div>
          )}

          <div className="checkout-divider" />

          <div className="checkout-price-line">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>

          <div className="checkout-price-line">
            <span>Shipping</span>
            <span>${shippingCost}</span>
          </div>

          <div className="checkout-price-line">
            <span>Tax</span>
            <span>${taxAmount}</span>
          </div>

          <div className="checkout-divider" />

          <div className="checkout-price-total">
            <span>Total</span>
            <span className="checkout-total-amount">${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
