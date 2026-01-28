import React, { useState, useEffect } from 'react';
import { useFormState } from './hooks/useFormState';
import { Header } from './components/ui/Header';
import { FooterNav } from './components/ui/FooterNav';
import { StepLayout } from './components/ui/StepLayout';
import { PracticeForm } from './components/Builder/PracticeForm';
import { PrescriberForm } from './components/Builder/PrescriberForm';
import { ReviewAndOrder } from './components/ReviewAndOrder/ReviewAndOrder';
import { PreviewPanel } from './components/Preview/PreviewPanel';
import { validatePractice, validatePrescriber } from './utils/validation';

function App() {
  const {
    currentStep,
    setCurrentStep,
    practices,
    updatePractice,
    addPractice,
    removePractice,
    prescribers,
    updatePrescriber,
    addPrescriber,
    removePrescriber,
    securityLevel,
    setSecurityLevel,
    padOptions,
    setPadOptions,
  } = useFormState();

  const [completedSteps, setCompletedSteps] = useState(['practice']);

  useEffect(() => {
    const newCompleted = ['practice'];
    if (validatePractice(practices[0]).valid) {
      newCompleted.push('prescribers');
    }
    const allPrescribersValid = prescribers.every(p => validatePrescriber(p).valid);
    if (newCompleted.includes('prescribers') && allPrescribersValid) {
      newCompleted.push('review');
    }
    setCompletedSteps(newCompleted);
  }, [practices, prescribers]);

  const handleContinue = () => {
    if (currentStep === 'practice') setCurrentStep('prescribers');
    else if (currentStep === 'prescribers') setCurrentStep('review');
  };

  const handleBack = () => {
    if (currentStep === 'prescribers') setCurrentStep('practice');
    else if (currentStep === 'review') setCurrentStep('prescribers');
  };

  const isContinueDisabled = () => {
    if (currentStep === 'practice') return !validatePractice(practices[0]).valid;
    if (currentStep === 'prescribers') return !prescribers.every(p => validatePrescriber(p).valid);
    return false;
  };

  const handleAddToCart = (orderData) => {
    console.log('Adding to cart:', orderData);
    alert(`Added to cart! Total: $${orderData.totalPrice}`);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'practice':
        return (
          <PracticeForm
            practices={practices}
            updatePractice={updatePractice}
            addPractice={addPractice}
            removePractice={removePractice}
          />
        );
      case 'prescribers':
        return (
          <PrescriberForm
            prescribers={prescribers}
            updatePrescriber={updatePrescriber}
            addPrescriber={addPrescriber}
            removePrescriber={removePrescriber}
            padOptions={padOptions}
            setPadOptions={setPadOptions}
          />
        );
      case 'review':
        return (
          <ReviewAndOrder
            practices={practices}
            prescribers={prescribers}
            padOptions={padOptions}
            securityLevel={securityLevel}
            onBack={() => setCurrentStep('prescribers')}
            onAddToCart={handleAddToCart}
          />
        );
      default:
        return null;
    }
  };

  const renderPreview = () => (
    <PreviewPanel
      practices={practices}
      prescribers={prescribers}
      padOptions={padOptions}
      securityLevel={securityLevel}
      setSecurityLevel={setSecurityLevel}
      isReviewStep={currentStep === 'review'}
    />
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        currentStep={currentStep} 
        completedSteps={completedSteps} 
        onStepClick={setCurrentStep} 
      />

      <main className="flex-1">
        {currentStep === 'review' ? (
          renderContent()
        ) : (
          <StepLayout preview={renderPreview()}>
            {renderContent()}
          </StepLayout>
        )}
      </main>

      <FooterNav 
        currentStep={currentStep}
        onBack={currentStep !== 'practice' ? handleBack : null}
        onContinue={handleContinue}
        continueDisabled={isContinueDisabled()}
        continueLabel="CONTINUE"
        securityLevel={securityLevel}
      />
    </div>
  );
}

export default App;
