import { useEffect } from 'react';

interface UseKeyboardProps {
  onEscape?: () => void;
  onTab?: (event: KeyboardEvent) => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  enabled?: boolean;
}

export const useKeyboard = ({
  onEscape,
  onTab,
  onEnter,
  onArrowUp,
  onArrowDown,
  enabled = true
}: UseKeyboardProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Tab':
          onTab?.(event);
          break;
        case 'Enter':
          onEnter?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onEscape, onTab, onEnter, onArrowUp, onArrowDown]);
};