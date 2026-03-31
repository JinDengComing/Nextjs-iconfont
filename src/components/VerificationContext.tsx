'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import PasswordModal from './PasswordModal';

interface VerificationContextType {
  isVerified: boolean;
  showPasswordModal: () => void;
  verifyPassword: () => Promise<boolean>;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationPromise, setVerificationPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const showPasswordModal = () => {
    setIsModalOpen(true);
  };

  const verifyPassword = () => {
    return new Promise<boolean>((resolve) => {
      if (isVerified) {
        resolve(true);
      } else {
        setVerificationPromise({ resolve });
        setIsModalOpen(true);
      }
    });
  };

  const handlePasswordVerify = (verified: boolean) => {
    setIsVerified(verified);
    if (verificationPromise) {
      verificationPromise.resolve(verified);
      setVerificationPromise(null);
    }
  };

  return (
    <VerificationContext.Provider value={{ isVerified, showPasswordModal, verifyPassword }}>
      {children}
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (verificationPromise) {
            verificationPromise.resolve(false);
            setVerificationPromise(null);
          }
        }}
        onPasswordVerify={handlePasswordVerify}
      />
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}