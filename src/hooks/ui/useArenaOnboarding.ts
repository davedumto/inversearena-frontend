'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'onboarding_completed';
const TOTAL_STEPS = 3;

export const useArenaOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    setIsActive(completed !== 'true');
  }, []);

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsActive(false);
      setCurrentStep(0);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    isActive,
    isLastStep,
    nextStep,
    previousStep,
    skipTour,
    resetTour,
  };
};
