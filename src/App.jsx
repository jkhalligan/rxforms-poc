import React from 'react';
import { useFormState } from './hooks/useFormState';
import { ProgressBar } from './components/Builder/ProgressBar';
import { PracticeForm } from './components/Builder/PracticeForm';
import { PrescriberForm } from './components/Builder/PrescriberForm';
import { ProofApproval } from './components/Review/ProofApproval';
import { OrderOptions } from './components/Order/OrderOptions';
import { PreviewPanel } from './components/Preview/PreviewPanel';

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

  const renderStep = () => {
    switch (currentStep) {
      case 'practice':
        return (
          <PracticeForm
            practices={practices}
            updatePractice={updatePractice}
            addPractice={addPractice}
            removePractice={removePractice}
            onContinue={() => setCurrentStep('prescribers')}
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
            onContinue={() => setCurrentStep('review')}
            onBack={() => setCurrentStep('practice')}
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
            onApprove={() => setCurrentStep('order')}
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

  const showPreview = currentStep === 'practice' || currentStep === 'prescribers';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rxforms-blue rounded flex items-center justify-center text-white font-bold">Rx</div>
            <h1 className="text-xl font-bold tracking-tight">RxForms <span className="text-gray-400 font-normal">POC</span></h1>
          </div>
          <div className="hidden md:block text-sm font-medium text-gray-500">
            Arizona Prescription Pads
          </div>
        </div>
      </header>

      <ProgressBar currentStep={currentStep} onStepClick={setCurrentStep} />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Form Area */}
          <div className={`flex-1 ${!showPreview ? 'max-w-4xl mx-auto w-full' : 'max-w-2xl'}`}>
            {renderStep()}
          </div>

          {/* Right: Preview Panel (sticky) */}
          {showPreview && (
            <div className="w-full lg:w-[450px] space-y-6">
              <div className="sticky top-28">
                <PreviewPanel
                  practices={practices}
                  prescribers={prescribers}
                  padOptions={padOptions}
                  securityLevel={securityLevel}
                  setSecurityLevel={setSecurityLevel}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          &copy; 2026 RxForms Proof of Concept. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;