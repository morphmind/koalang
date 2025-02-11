import { useState, useCallback } from 'react';

export const useAuthPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openAuthPopup = useCallback(() => {
    console.log('🟡 Auth popup açılıyor...');
    setIsOpen(true);
    
    // Scroll lock ve body class
    
    // Scroll lock ve body class
    document.body.classList.add('overflow-hidden');
    document.body.classList.add('auth-popup-open');
    
    // Global event dispatch
    try {
      const event = new CustomEvent('showAuthPopup');
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Auth popup event error:', err);
    }
  }, []);

  const closeAuthPopup = useCallback(async () => {
    console.log('🟡 Auth popup kapatılıyor...');
    setIsOpen(false);
    
    // Remove scroll lock ve body class
    
    // Remove scroll lock ve body class
    document.body.classList.remove('overflow-hidden');
    document.body.classList.remove('auth-popup-open');
    
    // Global event dispatch
    try {
      const event = new CustomEvent('hideAuthPopup');
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Auth popup event error:', err);
    }
    
    // Popup'ın kapanmasını bekle
    await new Promise(resolve => setTimeout(resolve, 100));
  }, []);

  return {
    isOpen,
    openAuthPopup,
    closeAuthPopup
  };
};