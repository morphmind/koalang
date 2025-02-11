import React, { useState, useRef } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { useEffect } from 'react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'login' | 'register' | 'reset-password';

export const AuthPopup: React.FC<AuthPopupProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const popupRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(isOpen);

  // Popup'ı kapatmak için event listener ekle
  useEffect(() => {
    const handleClose = () => {
      console.log('🟡 Auth popup kapatılıyor...');
      setIsVisible(false);
      onClose();
    };
    
    const handleShow = () => {
      console.log('🟡 Auth popup açılıyor...');
      setIsVisible(true);
    };
    
    const handleHide = () => {
      console.log('🟡 Auth popup gizleniyor...');
      setIsVisible(false);
    };
    
    const handleTabSwitch = (e: CustomEvent) => {
      console.log('🟡 Auth tab değiştiriliyor:', e.detail);
      setActiveTab(e.detail as TabType);
    };

    window.addEventListener('closeAuthPopup', handleClose);
    window.addEventListener('showAuthPopup', handleShow);
    window.addEventListener('hideAuthPopup', handleHide);
    window.addEventListener('switchAuthTab', handleTabSwitch as EventListener);
    
    return () => {
      window.removeEventListener('closeAuthPopup', handleClose);
      window.removeEventListener('showAuthPopup', handleShow);
      window.removeEventListener('hideAuthPopup', handleHide);
      window.removeEventListener('switchAuthTab', handleTabSwitch as EventListener);
    };
  }, [onClose]);

  const focusTrapRef = useFocusTrap({
    enabled: isOpen,
    onEscape: onClose
  });

  useOnClickOutside(popupRef, onClose);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          ref={focusTrapRef}
          className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white 
                   text-left align-middle shadow-xl transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-popup-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-2 text-bs-navygri hover:bg-bs-50 
                     transition-colors z-10"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-bs-primary to-bs-800 px-6 py-8 sm:px-8 rounded-t-3xl">
            {activeTab === 'reset-password' ? (
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('login')}
                  className="p-2 -ml-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-white">
                  Şifre Sıfırlama
                </h2>
              </div>
            ) : (
            <h2
              id="auth-popup-title"
              className="text-2xl font-bold text-white mb-2"
            >
              Hoş Geldiniz
            </h2>
            )}
            <p className="text-white/80 text-sm">
              Oxford 3000™ kelime listesi ile İngilizce öğrenmeye başlayın.
            </p>

            {/* Tabs - Header içine taşındı */}
            <div className="flex mt-8 bg-white/10 backdrop-blur-sm p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-all relative
                         ${activeTab === 'login'
                           ? 'text-bs-primary bg-white shadow-lg rounded-lg'
                           : 'text-white hover:bg-white/20 rounded-lg'}`}
              >
                Giriş Yap
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-all relative
                         ${activeTab === 'register'
                           ? 'text-bs-primary bg-white shadow-lg rounded-lg'
                           : 'text-white hover:bg-white/20 rounded-lg'}`}
              >
                Kayıt Ol
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 sm:px-8">
            {activeTab === 'login' && (
              <LoginForm />
            )}
            {activeTab === 'register' && (
              <RegisterForm />
            )}
            {activeTab === 'reset-password' && (
              <ResetPasswordForm onBack={() => setActiveTab('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};