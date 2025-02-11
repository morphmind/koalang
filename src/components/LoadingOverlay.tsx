import React from 'react';
import { LoadingSpinner } from '../modules/auth/components/LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Yükleniyor...',
  fullScreen = false
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 z-10';

  return (
    <div className={`${containerClasses} bg-white/80 backdrop-blur-sm flex items-center justify-center`}>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-bs-navygri font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
};