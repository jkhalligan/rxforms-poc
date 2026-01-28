import React, { useState } from 'react';

const CardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export function PaymentStep({ totalPrice, shippingAddress, onBack, onPlaceOrder }) {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '123',
    nameOnCard: '',
  });
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (field, value) => {
    if (field === 'cardNumber') {
      // Format card number with spaces
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setPaymentInfo(prev => ({ ...prev, [field]: formatted }));
    } else if (field === 'expiry') {
      // Format expiry as MM/YY
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        setPaymentInfo(prev => ({ ...prev, [field]: cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) }));
      } else {
        setPaymentInfo(prev => ({ ...prev, [field]: cleaned }));
      }
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const isValid = () => {
    return (
      paymentInfo.cardNumber.replace(/\s/g, '').length === 16 &&
      paymentInfo.expiry.length === 5 &&
      paymentInfo.cvc.length === 3 &&
      paymentInfo.nameOnCard.trim().length > 0
    );
  };

  const handleSubmit = async () => {
    if (!isValid()) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsProcessing(false);
    onPlaceOrder({
      ...paymentInfo,
      billingAddress: useDifferentBilling ? null : shippingAddress,
    });
  };

  return (
    <div className="checkout-step-content">
      <h2 className="checkout-step-title">Payment</h2>

      <div className="payment-form">
        <div className="form-section-title">Card Information</div>

        <div className="form-field">
          <label className="form-label">Card Number</label>
          <div className="payment-input-wrapper">
            <input
              type="text"
              className="payment-input"
              placeholder="1234 1234 1234 1234"
              value={paymentInfo.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              maxLength="19"
            />
            <div className="payment-icon">
              <CardIcon />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field form-field--flex-1">
            <label className="form-label">Expiration</label>
            <input
              type="text"
              className="payment-input"
              placeholder="MM/YY"
              value={paymentInfo.expiry}
              onChange={(e) => handleChange('expiry', e.target.value)}
              maxLength="5"
            />
          </div>

          <div className="form-field form-field--flex-1">
            <label className="form-label">CVC</label>
            <input
              type="text"
              className="payment-input"
              placeholder="123"
              value={paymentInfo.cvc}
              onChange={(e) => handleChange('cvc', e.target.value.replace(/\D/g, ''))}
              maxLength="3"
            />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Name on Card</label>
          <input
            type="text"
            className="payment-input"
            placeholder="Full name"
            value={paymentInfo.nameOnCard}
            onChange={(e) => handleChange('nameOnCard', e.target.value)}
          />
        </div>

        <div className="form-section-title mt-6">Billing Address</div>

        <label className="billing-address-option">
          <input
            type="radio"
            checked={!useDifferentBilling}
            onChange={() => setUseDifferentBilling(false)}
          />
          <span>Same as shipping address</span>
        </label>

        <label className="billing-address-option">
          <input
            type="radio"
            checked={useDifferentBilling}
            onChange={() => setUseDifferentBilling(true)}
          />
          <span>Use a different billing address</span>
        </label>

        {useDifferentBilling && (
          <div className="billing-address-notice">
            Different billing address not implemented in this demo
          </div>
        )}
      </div>

      <div className="checkout-step-footer checkout-step-footer--space-between">
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          ← Back to Shipping
        </button>
        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={!isValid() || isProcessing}
        >
          {isProcessing ? 'Processing...' : `Place Order · $${totalPrice}`}
        </button>
      </div>
    </div>
  );
}
