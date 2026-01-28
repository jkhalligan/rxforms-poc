import { useState } from 'react';
import { arizonaConfig } from '../config/arizona';

export function useFormState() {
  const [currentStep, setCurrentStep] = useState('practice');
  const [practices, setPractices] = useState([{ name: '', address: '', city: '', state: 'AZ', zip: '', phone: '', fax: '' }]);
  const [prescribers, setPrescribers] = useState([{ name: '', credentials: '', specialty: '', licenseNumber: '', hideLicense: false, npiNumber: '', deaNumber: '' }]);
  const [securityLevel, setSecurityLevel] = useState(arizonaConfig.defaultSecurityLevel);
  const [padOptions, setPadOptions] = useState({ startingNumber: '0001' });

  const updatePractice = (index, data) => {
    const newPractices = [...practices];
    newPractices[index] = { ...newPractices[index], ...data };
    setPractices(newPractices);
  };

  const addPractice = () => {
    if (practices.length < arizonaConfig.maxLocations) {
      setPractices([...practices, { name: '', address: '', city: '', state: 'AZ', zip: '', phone: '', fax: '' }]);
    }
  };

  const removePractice = (index) => {
    if (practices.length > 1) {
      setPractices(practices.filter((_, i) => i !== index));
    }
  };

  const updatePrescriber = (index, data) => {
    const newPrescribers = [...prescribers];
    newPrescribers[index] = { ...newPrescribers[index], ...data };
    setPrescribers(newPrescribers);
  };

  const addPrescriber = () => {
    if (prescribers.length < arizonaConfig.maxPrescribers) {
      setPrescribers([...prescribers, { name: '', credentials: '', specialty: '', licenseNumber: '', hideLicense: false, npiNumber: '', deaNumber: '' }]);
    }
  };

  const removePrescriber = (index) => {
    if (prescribers.length > 1) {
      setPrescribers(prescribers.filter((_, i) => i !== index));
    }
  };

  return {
    currentStep,
    setCurrentStep,
    practices,
    setPractices,
    updatePractice,
    addPractice,
    removePractice,
    prescribers,
    setPrescribers,
    updatePrescriber,
    addPrescriber,
    removePrescriber,
    securityLevel,
    setSecurityLevel,
    padOptions,
    setPadOptions,
  };
}