import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  variant?: 'warning' | 'error';
  onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  variant = 'error',
  onClose
}) => {
  const styles = {
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      icon: 'text-yellow-400',
      hover: 'hover:bg-yellow-100'
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      icon: 'text-red-400',
      hover: 'hover:bg-red-100'
    }
  };

  const currentStyle = styles[variant];

  return (
    <div className={`rounded-lg ${currentStyle.bg} p-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className={`h-5 w-5 ${currentStyle.icon}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm ${currentStyle.text}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${currentStyle.text} ${currentStyle.hover} 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${variant}-50 
                         focus:ring-${variant}-600`}
              >
                <span className="sr-only">Kapat</span>
                <XCircle className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};