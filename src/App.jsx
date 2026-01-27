import React, { useState, useEffect } from 'react';
import { useFormState } from './hooks/useFormState';
import { Header } from './components/ui/Header';
import { FooterNav } from './components/ui/FooterNav';
import { StepLayout } from './components/ui/StepLayout';
import { PracticeForm } from './components/Builder/PracticeForm';
import { PrescriberForm } from './components/Builder/PrescriberForm';
import { ProofApproval } from './components/Review/ProofApproval';
import { OrderOptions } from './components/Order/OrderOptions';
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
    orderOptions,
    setOrderOptions,
    proofApproved,
    setProofApproved,
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
    if (proofApproved) {
      newCompleted.push('order');
    }
    setCompletedSteps(newCompleted);
  }, [practices, prescribers, proofApproved]);

  const handleContinue = () => {
    if (currentStep === 'practice') setCurrentStep('prescribers');
    else if (currentStep === 'prescribers') setCurrentStep('review');
    else if (currentStep === 'review') setCurrentStep('order');
  };

  const handleBack = () => {
    if (currentStep === 'prescribers') setCurrentStep('practice');
    else if (currentStep === 'review') setCurrentStep('prescribers');
    else if (currentStep === 'order') setCurrentStep('review');
  };

  const isContinueDisabled = () => {
    if (currentStep === 'practice') return !validatePractice(practices[0]).valid;
    if (currentStep === 'prescribers') return !prescribers.every(p => validatePrescriber(p).valid);
    if (currentStep === 'review') return !proofApproved;
    return false;
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
          <ProofApproval
            practices={practices}
            prescribers={prescribers}
            padOptions={padOptions}
            securityLevel={securityLevel}
            proofApproved={proofApproved}
            setProofApproved={setProofApproved}
            onEdit={() => setCurrentStep('prescribers')}
          />
        );
      case 'order':
        return (
          <OrderOptions
            practices={practices}
            prescribers={prescribers}
            padOptions={padOptions}
            securityLevel={securityLevel}
            orderOptions={orderOptions}
            setOrderOptions={setOrderOptions}
            onBack={() => setCurrentStep('review')}
            onComplete={() => alert('Order submitted! Check your downloads for the PDF.')}
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
        <StepLayout preview={renderPreview()}>
          {renderContent()}
        </StepLayout>
      </main>

      <FooterNav 
        onBack={currentStep !== 'practice' ? handleBack : null}
        onContinue={handleContinue}
        continueDisabled={isContinueDisabled()}
        continueLabel={currentStep === 'order' ? 'Complete Order' : 'Continue'}
      />
    </div>
  );
}

export default App;
