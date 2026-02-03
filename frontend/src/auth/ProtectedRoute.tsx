import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  let content: React.ReactNode = children;
  if (isLoading) {
    content = <div className="loading">Loading...</div>;
  } else if (!isAuthenticated) {
    content = <Navigate to="/login" replace />;
  }

  return <>{content}</>;
}
