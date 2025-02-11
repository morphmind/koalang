import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { NotificationItem } from './NotificationItem';
import { LoadingSpinner } from '../../../modules/auth/components/LoadingSpinner';
import { ErrorMessage } from '../../../modules/auth/components/ErrorMessage';
import { Bell, Trash2, Check } from 'lucide-react';

interface NotificationListProps {
  onClose: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { 
    notifications, 
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
    clearAllNotifications
  } = useNotifications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-12 h-12 rounded-full bg-bs-50 mx-auto mb-4 flex items-center justify-center">
          <Bell className="w-6 h-6 text-bs-primary" />
        </div>
        <p className="text-bs-navy font-medium">Bildiriminiz Yok</p>
        <p className="text-sm text-bs-navygri mt-1">
          Yeni bildirimleriniz burada görünecek.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-bs-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-bs-navy">
            Bildirimler
            {unreadCount > 0 && (
              <span className="ml-2 text-xs font-normal text-bs-navygri">
                ({unreadCount} okunmamış)
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="p-1 text-bs-primary hover:bg-bs-50 rounded-lg transition-colors"
                title="Tümünü okundu işaretle"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => clearAllNotifications()}
                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Tümünü temizle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="py-1">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={() => {
              if (notification.link) {
                window.location.href = notification.link;
              }
              onClose();
            }}
          />
        ))}
      </div>
    </div>
  );
};