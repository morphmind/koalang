import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Bell, Award, BookOpen, AlertCircle, Trash2 } from 'lucide-react';
import { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick
}) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case 'learning':
        return BookOpen;
      case 'quiz':
        return Award;
      case 'system':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const Icon = getIcon();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    onClick();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={(e) => e.key === 'Enter' && handleClick(e as any)}
      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer
                relative ${notification.isRead ? 'opacity-75' : ''}`}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${notification.isRead ? 'bg-gray-100' : 'bg-bs-50'}`}>
        <Icon className={`w-4 h-4 ${notification.isRead ? 'text-gray-500' : 'text-bs-primary'}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${notification.isRead ? 'text-bs-navygri' : 'text-bs-navy'}`}>
          {notification.title}
        </p>
        <p className="text-xs text-bs-navygri mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] text-bs-navygri/75 mt-1">
          {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: tr })}
        </p>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="p-1 text-bs-navygri hover:text-red-500 hover:bg-red-50 rounded-lg 
                 transition-colors opacity-0 group-hover:opacity-100"
        title="Bildirimi sil"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-bs-primary" />
      )}
    </div>
  );
};