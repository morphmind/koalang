import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useKeyboard } from '../../../hooks/useKeyboard';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { MenuItem } from './MenuItem';
import { 
  User,
  Settings,
  LogOut,
  BookOpen,
  Award,
  Activity,
  ChevronDown,
  DivideIcon
} from 'lucide-react';

interface MenuOption {
  icon: typeof DivideIcon;
  label: string;
  href: string;
}

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItems = useRef<HTMLAnchorElement[]>([]);
  const focusTrapRef = useFocusTrap({
    enabled: isOpen,
    onEscape: () => setIsOpen(false)
  });

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        setFocusedIndex(prev => (prev <= 0 ? menuItems.current.length - 1 : prev - 1));
      } else {
        setFocusedIndex(prev => (prev >= menuItems.current.length - 1 ? 0 : prev + 1));
      }
    }
  }, []);

  const handleArrowUp = useCallback(() => {
    setFocusedIndex(prev => (prev <= 0 ? menuItems.current.length - 1 : prev - 1));
  }, []);

  const handleArrowDown = useCallback(() => {
    setFocusedIndex(prev => (prev >= menuItems.current.length - 1 ? 0 : prev + 1));
  }, []);

  useKeyboard({
    onEscape: () => setIsOpen(false),
    onTab: handleKeyNavigation,
    onArrowUp: handleArrowUp,
    onArrowDown: handleArrowDown,
    enabled: isOpen
  });

  useEffect(() => {
    if (focusedIndex >= 0) {
      menuItems.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);
  if (!user) return null;

  const menuOptions = useMemo<MenuOption[]>(() => [
    { icon: User, label: 'Profilim', href: '/dashboard' },
    { icon: Activity, label: 'İlerlemem', href: '/dashboard/progress' },
    { icon: Award, label: 'Başarılarım', href: '/dashboard/achievements' },
    { icon: BookOpen, label: 'Öğrendiğim Kelimeler', href: '/dashboard/learned-words' },
    { icon: Settings, label: 'Ayarlar', href: '/dashboard/settings' }
  ], []);
  const navigate = useNavigate();

  const handleLogoutClick = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout(navigate);
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Kullanıcı menüsü"
        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="text-white font-medium text-sm">{user.username}</span>
        <ChevronDown className="w-4 h-4 text-white opacity-60" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-bs-100 user-menu"
          ref={focusTrapRef}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <div className="px-4 py-3 border-b border-bs-100">
            <div className="text-sm font-medium text-bs-navy">{user.username}</div>
            <div className="text-xs text-bs-navygri mt-0.5">{user.email}</div>
          </div>

          <div className="py-2">
            {menuOptions.map((option, index) => (
              <MenuItem
                key={option.href}
                ref={(el: HTMLAnchorElement | null) => { if (el) menuItems.current[index] = el; }}
                icon={option.icon}
                label={option.label}
                href={option.href}
              />
            ))}
          </div>

          <div className="border-t border-bs-100 pt-2">
            <MenuItem
              icon={LogOut}
              label="Çıkış Yap"
              onClick={handleLogoutClick}
              variant="danger"
              disabled={isLoggingOut}
            />
          </div>
        </div>
      )}
    </div>
  );
};
