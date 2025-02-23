'use client';
import { createContext, useContext, useRef, ReactNode, useState } from 'react';

interface FormContextType {
  formRef: React.RefObject<HTMLFormElement | null>;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <FormContext.Provider value={{ formRef, isSubmitting, setIsSubmitting }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
} 