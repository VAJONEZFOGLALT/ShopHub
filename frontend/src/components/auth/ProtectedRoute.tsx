import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../LoadingSpinner';
import { useModal } from '../../contexts/ModalContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { openLoginModal } = useModal();

  let content: React.ReactNode = children;
  if (isLoading) {
    content = <LoadingSpinner fullScreen={true} />;
  } else if (!isAuthenticated) {
    openLoginModal();
    content = null;
  }

  return <>{content}</>;
}
