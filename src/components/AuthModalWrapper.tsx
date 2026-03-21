'use client';

import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';

export default function AuthModalWrapper() {
  const { isLoginModalOpen, hideLoginModal } = useAuth();
  
  return <AuthModal isOpen={isLoginModalOpen} onClose={hideLoginModal} />;
}
