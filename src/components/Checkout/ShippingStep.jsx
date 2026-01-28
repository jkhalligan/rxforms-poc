import React, { useState, useEffect } from 'react';

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export function ShippingStep({ practice, securityLevel, onContinue }) {
  const [address, setAddress] = useState({
    practiceName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (practice) {
      setAddress({
        practiceName: practice.name || '',
        street: practice.address || '',
        city: practice.city || '',
        state: practice.state || '',
        zip: practice.zip || '',
        phone: practice.phone || '',
      });
    }
  }, [practice]);

  const handleChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const isValid = () => {
    return (
      address.practiceName &&
      address.street &&
      address.city &&
      address.state &&
      address.zip &&
      address.phone &&
      confirmed
    );
  };

  const handleSubmit = () => {
    if (isValid()) {
      onContinue(address);
    }
  };

  const showDEAWarning = securityLevel === 'maximum-security';

  return (
    <div className="checkout-step-content">
      <h2 className="checkout-step-title">Shipping Address</h2>

      {showDEAWarning && (
        <div className="shipping-warning">
          <div className="shipping-warning-icon">
            <AlertIcon />
          </div>
          <div className="shipping-warning-content">
            <strong className="shipping-warning-title">Security Requirement</strong>
            <p className="shipping-warning-text">
              For controlled substance prescription pads, the shipping address must match the
              "address of record" registered with your DEA license.
            </p>
          </div>
        </div>
      )}

      <div className="shipping-form">
        <p className="shipping-form-note">Pre-filled from Practice Info</p>

        <div className="form-field">
          <label className="form-label">Practice Name</label>
          <input
            type="text"
            className="form-input"
            value={address.practiceName}
            onChange={(e) => handleChange('practiceName', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Street Address</label>
          <input
            type="text"
            className="form-input"
            value={address.street}
            onChange={(e) => handleChange('street', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-field form-field--flex-2">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-input"
              value={address.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>

          <div className="form-field form-field--flex-1">
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-input"
              maxLength="2"
              value={address.state}
              onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
            />
          </div>

          <div className="form-field form-field--flex-1">
            <label className="form-label">ZIP Code</label>
            <input
              type="text"
              className="form-input"
              maxLength="10"
              value={address.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
            />
          </div>
        </div>

        <div className="form-section-title">Contact for Delivery</div>

        <div className="form-field">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-input"
            value={address.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        {showDEAWarning && (
          <label className="shipping-confirmation">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <span>I confirm this address matches my DEA registration</span>
          </label>
        )}
      </div>

      <div className="checkout-step-footer">
        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={!isValid()}
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}
