import React, { useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { NotificationList } from './NotificationList';
import { useOnClickOutside } from '../../auth/hooks/useOnClickOutside';
import { useFocusTrap } from '../../../hooks/useFocusTrap';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const menuRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useFocusTrap({
    enabled: isOpen,
    onEscape: () => setIsOpen(false)
  });

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label={`${unreadCount} okunmamış bildirim`}
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center 
                         rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          ref={focusTrapRef}
          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 border border-bs-100"
          role="menu"
        >
          <NotificationList onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};