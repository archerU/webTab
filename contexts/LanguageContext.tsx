import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLanguage, setLanguage, translations, type Language } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return getLanguage();
    } catch (error) {
      console.error('Error getting language:', error);
      return 'en'; // Fallback to English
    }
  });

  const handleSetLanguage = (lang: Language) => {
    try {
      setLanguageState(lang);
      setLanguage(lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  // Listen for language changes from localStorage (for sync across tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'webtab_language' && e.newValue) {
        const newLang = e.newValue as Language;
        if (newLang === 'en' || newLang === 'zh') {
          setLanguageState(newLang);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

