import { useState, useCallback, useEffect } from 'react';

interface UseMenuOptions {
  onClose?: () => void;
  onOpen?: () => void;
}

export const useMenu = (options?: UseMenuOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    options?.onOpen?.();
  }, [options]);

  const close = useCallback(() => {
    setIsOpen(false);
    options?.onClose?.();
  }, [options]);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
    if (isOpen) {
      options?.onClose?.();
    } else {
      options?.onOpen?.();
    }
  }, [isOpen, options]);

  // ESC tuşu ile menüyü kapat
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);

  // Dışarı tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('[data-menu]')) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, close]);

  // Sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    if (isOpen) {
      const handleRouteChange = () => {
        close();
      };

      window.addEventListener('popstate', handleRouteChange);
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
  }, [isOpen, close]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return {
    isOpen,
    activeItem,
    open,
    close,
    toggle,
    setActiveItem
  };
};