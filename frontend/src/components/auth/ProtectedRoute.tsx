import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onAuthNeeded?: () => void;
}

export function ProtectedRoute({ children, onAuthNeeded }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      onAuthNeeded?.();
    }
  }, [isLoading, isAuthenticated, onAuthNeeded]);

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/shop" replace />;
  }

  return <>{children}</>;
}
