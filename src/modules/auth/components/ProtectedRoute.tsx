import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAuthPopup } from '../hooks/useAuthPopup';
import { LoadingScreen } from '../../../components/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { openAuthPopup } = useAuthPopup();
  const authCheckRef = React.useRef(false);

  const checkAuth = useCallback(() => {
    if (!isLoading && !user) {
      console.log('🔴 Kullanıcı girişi yok, auth popup açılıyor...');
      openAuthPopup();
      authCheckRef.current = true;
      return false;
    }
    if (user) {
      console.log('🟢 Kullanıcı girişi var:', {
        username: user.username,
        email: user.email,
      });
      authCheckRef.current = true;
    }
    return true;
  }, [user, isLoading, openAuthPopup]);

  useEffect(() => {
    if (!isLoading) {
      const isAuthenticated = checkAuth();
      console.log('🟡 Auth durumu kontrol edildi:', {
        isAuthenticated,
        isLoading,
        isAuthChecked: authCheckRef.current
      });
    }
  }, [checkAuth, isLoading, user]);

  if (isLoading) {
    return <LoadingScreen message="Oturumunuz kontrol ediliyor..." />;
  }

  if (!user && !authCheckRef.current) {
    console.log('🔴 Kullanıcı girişi yok, null döndürülüyor...');
    return null;
  }

  console.log('🟢 Kullanıcı girişi var, içerik gösteriliyor...');
  return <>{children}</>;
};
