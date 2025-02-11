import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../../../components/LoadingScreen';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/'
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || redirectTo;

  if (isLoading) {
    return (
      <LoadingScreen message="Oturumunuz kontrol ediliyor..." />
    );
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};