import React, { createContext, useContext, useState } from 'react';

type ModalType = 'none' | 'login' | 'register';

interface ModalContextType {
  modal: ModalType;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeModal: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalType>('none');

  const openLoginModal = () => setModal('login');
  const openRegisterModal = () => setModal('register');
  const closeModal = () => setModal('none');
  const switchToRegister = () => setModal('register');
  const switchToLogin = () => setModal('login');

  return (
    <ModalContext.Provider
      value={{
        modal,
        openLoginModal,
        openRegisterModal,
        closeModal,
        switchToRegister,
        switchToLogin,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
