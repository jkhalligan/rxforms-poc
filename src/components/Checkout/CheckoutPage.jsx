import React, { useState, useEffect } from 'react';
import { CheckoutHeader } from './CheckoutHeader';
import { ShippingStep } from './ShippingStep';
import { PaymentStep } from './PaymentStep';
import { ConfirmationStep } from './ConfirmationStep';
import { CheckoutSidebar } from './CheckoutSidebar';

export function CheckoutPage({
  practices,
  prescribers,
  padOptions,
  securityLevel,
  quantity,
  paperType,
  productionTime,
  basePrice,
  onStartNewOrder,
}) {
  const [checkoutStep, setCheckoutStep] = useState('shipping');
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  // Generate order number when component mounts
  useEffect(() => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    setOrderNumber(`RXF-${year}-${randomNum}`);
  }, []);

  // Calculate estimated delivery
  useEffect(() => {
    const today = new Date();
    let daysToAdd;

    if (productionTime === 'rush') {
      daysToAdd = 2; // 2-3 days
    } else {
      daysToAdd = 5; // 5-7 days
    }

    const deliveryStart = new Date(today);
    deliveryStart.setDate(today.getDate() + daysToAdd);

    const deliveryEnd = new Date(deliveryStart);
    deliveryEnd.setDate(deliveryStart.getDate() + 2);

    const formatDate = (date) => {
      const month = date.toLocaleString('default', { month: 'long' });
      const day = date.getDate();
      return `${month} ${day}`;
    };

    setEstimatedDelivery(`${formatDate(deliveryStart)}-${deliveryEnd.getDate()}, ${deliveryStart.getFullYear()}`);
  }, [productionTime]);

  const handleShippingContinue = (address) => {
    setShippingAddress(address);
    setCheckoutStep('payment');
  };

  const handlePaymentBack = () => {
    setCheckoutStep('shipping');
  };

  const handlePlaceOrder = (payment) => {
    setPaymentInfo(payment);
    setCheckoutStep('confirmation');
  };

  // Calculate total price for payment step
  const paperModifier = paperType === 'carbonless-2' ? 25 : 0;
  const productionModifier = productionTime === 'rush' ? 35 : 0;
  const subtotal = basePrice + paperModifier + productionModifier;
  const shippingCost = productionTime === 'rush' ? 25 : 12;
  const taxAmount = Math.round(subtotal * 0.08);
  const totalPrice = subtotal + shippingCost + taxAmount;

  return (
    <div className="checkout-page">
      <CheckoutHeader checkoutStep={checkoutStep} />

      <div className="checkout-container">
        <div className="checkout-content">
          {checkoutStep === 'shipping' && (
            <ShippingStep
              practice={practices[0]}
              securityLevel={securityLevel}
              onContinue={handleShippingContinue}
            />
          )}

          {checkoutStep === 'payment' && (
            <PaymentStep
              totalPrice={totalPrice}
              shippingAddress={shippingAddress}
              onBack={handlePaymentBack}
              onPlaceOrder={handlePlaceOrder}
            />
          )}

          {checkoutStep === 'confirmation' && (
            <ConfirmationStep
              orderNumber={orderNumber}
              estimatedDelivery={estimatedDelivery}
              practices={practices}
              prescribers={prescribers}
              padOptions={padOptions}
              securityLevel={securityLevel}
              onStartNewOrder={onStartNewOrder}
            />
          )}
        </div>

        <CheckoutSidebar
          practices={practices}
          prescribers={prescribers}
          padOptions={padOptions}
          securityLevel={securityLevel}
          quantity={quantity}
          paperType={paperType}
          productionTime={productionTime}
          basePrice={basePrice}
        />
      </div>
    </div>
  );
}
