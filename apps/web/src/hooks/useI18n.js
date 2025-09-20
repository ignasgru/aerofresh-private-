import { useState, useEffect, useCallback } from 'react';
import { createI18n } from '@aerofresh/core';
// Create i18n instance
const i18n = createI18n({
    loadTranslations: async (language) => {
        // In a real app, this would load from files or API
        // For now, return default translations
        const { defaultTranslations } = await import('@aerofresh/core');
        return defaultTranslations;
    }
});
export function useI18n() {
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isLoading, setIsLoading] = useState(true);
    const changeLanguage = useCallback(async (language) => {
        setIsLoading(true);
        try {
            await i18n.changeLanguage(language);
            setCurrentLanguage(language);
            // Store in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('aerofresh-language', language);
            }
        }
        catch (error) {
            console.error('Failed to change language:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const t = useCallback((key) => {
        return i18n.t(key);
    }, [currentLanguage]);
    useEffect(() => {
        const initializeI18n = async () => {
            try {
                await i18n.initialize();
                setCurrentLanguage(i18n.getCurrentLanguage());
            }
            catch (error) {
                console.error('Failed to initialize i18n:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        initializeI18n();
        // Subscribe to language changes
        const unsubscribe = i18n.onLanguageChange((language) => {
            setCurrentLanguage(language);
        });
        return unsubscribe;
    }, []);
    return {
        t,
        changeLanguage,
        currentLanguage,
        isLoading,
        supportedLanguages: i18n.getSupportedLanguages(),
        i18n
    };
}
export function initializeI18n() {
    if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('aerofresh-language');
        if (stored && i18n.getSupportedLanguages().includes(stored)) {
            return stored;
        }
    }
    return null;
}
