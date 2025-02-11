import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  onClose,
  action
}) => {
  return (
    <div className="rounded-xl bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium text-red-800">{title}</h3>
          )}
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {action && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  onClick={action.onClick}
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 
                           hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 
                           focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  {action.label}
                </button>
              </div>
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 
                         focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 
                         focus:ring-offset-red-50"
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