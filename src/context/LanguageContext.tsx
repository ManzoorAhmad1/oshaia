'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from '@/translations';

export type { Language, Translations };

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
    isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get initial language from localStorage
const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('oshaia_language') as Language;
        if (saved === 'en' || saved === 'fr') {
            return saved;
        }
    }
    return 'en';
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved language on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('oshaia_language') as Language;
        if (savedLanguage === 'en' || savedLanguage === 'fr') {
            setLanguageState(savedLanguage);
        }
        setIsLoaded(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('oshaia_language', lang);
    };

    const value = {
        language,
        setLanguage,
        t: translations[language],
        isLoaded,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export default LanguageContext;
