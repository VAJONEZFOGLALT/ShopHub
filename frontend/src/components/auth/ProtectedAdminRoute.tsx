import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../LoadingSpinner';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  onAuthNeeded?: () => void;
}

export function ProtectedAdminRoute({ children, onAuthNeeded }: ProtectedAdminRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

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

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
