import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onAuthNeeded?: () => void;
}

export function ProtectedRoute({ children, onAuthNeeded }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  if (!isAuthenticated) {
    onAuthNeeded?.();
    return null;
  }

  return <>{children}</>;
}
