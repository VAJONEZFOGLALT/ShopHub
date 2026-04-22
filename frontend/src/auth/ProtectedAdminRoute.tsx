import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  let content: React.ReactNode = children;
  if (isLoading) {
    content = <div className="loading">Loading...</div>;
  } else if (!isAuthenticated) {
    content = <Navigate to="/login" replace />;
  } else if (user?.role !== 'ADMIN') {
    content = <Navigate to="/" replace />;
  }

  return <>{content}</>;
}
