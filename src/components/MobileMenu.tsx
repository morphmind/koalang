import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, User, Settings, LogOut, BookOpen, Award, Activity } from 'lucide-react';
import { useAuth } from '../modules/auth';
import { useAuthPopup } from '../modules/auth/hooks/useAuthPopup';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useKeyboard } from '../hooks/useKeyboard';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { openAuthPopup } = useAuthPopup();
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const focusTrapRef = useFocusTrap({
    enabled: isOpen,
    onEscape: onClose
  });

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm mobile-menu-backdrop" onClick={onClose} />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl mobile-menu-panel">
        <div 
          className="flex h-full flex-col overflow-y-auto"
          ref={focusTrapRef}
          role="navigation"
          aria-label="Mobil menü"
        >
          {/* Header */}
          <div className="px-4 py-6 sm:px-6 border-b border-bs-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-bs-50 flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-bs-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-bs-navy">{user.username}</div>
                      <div className="text-xs text-bs-navygri">{user.email}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-lg font-semibold text-bs-navy">
                    Menü
                  </div>
                )}
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-bs-navygri hover:bg-bs-50"
                onClick={onClose}
                aria-label="Menüyü kapat"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 sm:px-6 space-y-1">
            <Link
              to="/ozel-ders"
              className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
              onClick={onClose}
            >
              Özel Ders
            </Link>
            <Link
              to="/online-ders"
              className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
              onClick={onClose}
            >
              Online Ders
            </Link>
            <Link
              to="/sehirler"
              className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
              onClick={onClose}
            >
              Şehirler
            </Link>
            <Link
              to="/ders-talepleri"
              className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
              onClick={onClose}
            >
              Ders Talepleri
            </Link>
            <Link
              to="/ders-alani"
              className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
              onClick={onClose}
            >
              Ders Alanı
            </Link>
          </nav>

          {/* User Actions */}
          {user ? (
            <div className="border-t border-bs-100 px-4 py-6 sm:px-6 space-y-1">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
                onClick={onClose}
              >
                <User className="w-4 h-4 text-bs-primary" />
                Profilim
              </Link>
              <Link
                to="/progress"
                className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
                onClick={onClose}
              >
                <Activity className="w-4 h-4 text-bs-primary" />
                İlerlemem
              </Link>
              <Link
                to="/achievements"
                className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
                onClick={onClose}
              >
                <Award className="w-4 h-4 text-bs-primary" />
                Başarılarım
              </Link>
              <Link
                to="/learned-words"
                className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
                onClick={onClose}
              >
                <BookOpen className="w-4 h-4 text-bs-primary" />
                Öğrendiğim Kelimeler
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 text-sm text-bs-navy rounded-lg hover:bg-bs-50"
                onClick={onClose}
              >
                <Settings className="w-4 h-4 text-bs-primary" />
                Ayarlar
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="border-t border-bs-100 px-4 py-6 sm:px-6 space-y-4">
              <button
                onClick={() => {
                  onClose();
                  openAuthPopup();
                }}
                className="w-full flex justify-center py-2.5 px-4 border border-bs-primary rounded-lg 
                         text-bs-primary text-sm font-medium hover:bg-bs-50"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => {
                  onClose();
                  openAuthPopup();
                }}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg 
                         bg-bs-primary text-white text-sm font-medium hover:bg-bs-800"
              >
                Kayıt Ol
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};