import React, { createContext, useContext, useState, useCallback } from 'react';
import { LegalPopup } from '../components/LegalPopup';

type LegalTab = 'privacy' | 'terms' | 'cookies' | 'kvkk' | 'security';

interface LegalPopupContextType {
  isOpen: boolean;
  activeTab: LegalTab;
  openPopup: (tab: LegalTab) => void;
  closePopup: () => void;
}

const LegalPopupContext = createContext<LegalPopupContextType | undefined>(undefined);

export const LegalPopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<LegalTab>('privacy');

  const openPopup = useCallback((tab: LegalTab) => {
    setActiveTab(tab);
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <LegalPopupContext.Provider 
      value={{ 
        isOpen, 
        activeTab, 
        openPopup, 
        closePopup 
      }}
    >
      {children}
      {isOpen && (
        <LegalPopup 
          isOpen={isOpen} 
          onClose={closePopup} 
          initialTab={activeTab} 
        />
      )}
    </LegalPopupContext.Provider>
  );
};

export const useLegalPopup = () => {
  const context = useContext(LegalPopupContext);
  if (context === undefined) {
    throw new Error('useLegalPopup must be used within a LegalPopupProvider');
  }
  return context;
};