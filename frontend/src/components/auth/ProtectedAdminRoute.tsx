import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../LoadingSpinner';
import { useModal } from '../../contexts/ModalContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { openLoginModal } = useModal();

  let content: React.ReactNode = children;
  if (isLoading) {
    content = <LoadingSpinner fullScreen={true} />;
  } else if (!isAuthenticated) {
    openLoginModal();
    content = null;
  } else if (user?.role !== 'ADMIN') {
    content = <Navigate to="/" replace />;
  }

  return <>{content}</>;
}
