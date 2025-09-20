// Internationalization (i18n) System
// Supports multiple languages with dynamic translation loading
export class I18nManager {
    config;
    currentLanguage;
    translations = new Map();
    listeners = new Set();
    constructor(config) {
        this.config = config;
        this.currentLanguage = config.defaultLanguage;
    }
    // Initialize i18n system
    async initialize(language) {
        const lang = language || this.detectLanguage() || this.config.defaultLanguage;
        await this.loadLanguage(lang);
    }
    // Get translation for key
    t(key) {
        const translations = this.translations.get(this.currentLanguage);
        if (!translations) {
            console.warn(`No translations loaded for language: ${this.currentLanguage}`);
            return this.getFallbackTranslation(key);
        }
        return translations[key] || this.getFallbackTranslation(key);
    }
    // Get nested translation
    tNested(key, nestedKey) {
        const translations = this.translations.get(this.currentLanguage);
        if (!translations || !translations[key]) {
            return this.getFallbackNestedTranslation(key, nestedKey);
        }
        const nested = translations[key][nestedKey];
        if (!nested) {
            return this.getFallbackNestedTranslation(key, nestedKey);
        }
        return nested;
    }
    // Change language
    async changeLanguage(language) {
        if (!this.config.supportedLanguages.includes(language)) {
            console.warn(`Language ${language} is not supported`);
            return;
        }
        await this.loadLanguage(language);
        this.currentLanguage = language;
        // Notify listeners
        this.listeners.forEach(listener => listener(language));
    }
    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    // Get supported languages
    getSupportedLanguages() {
        return this.config.supportedLanguages;
    }
    // Subscribe to language changes
    onLanguageChange(listener) {
        this.listeners.add(listener);
        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }
    // Load language translations
    async loadLanguage(language) {
        if (this.translations.has(language)) {
            return; // Already loaded
        }
        try {
            const translations = await this.config.loadTranslations(language);
            this.translations.set(language, translations);
        }
        catch (error) {
            console.error(`Failed to load translations for ${language}:`, error);
            // Fall back to default language if not already loading it
            if (language !== this.config.defaultLanguage) {
                await this.loadLanguage(this.config.defaultLanguage);
            }
        }
    }
    // Detect user's preferred language
    detectLanguage() {
        if (typeof navigator !== 'undefined' && navigator.language) {
            const browserLang = navigator.language.split('-')[0];
            if (this.config.supportedLanguages.includes(browserLang)) {
                return browserLang;
            }
        }
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedLang = localStorage.getItem('aerofresh-language');
            if (storedLang && this.config.supportedLanguages.includes(storedLang)) {
                return storedLang;
            }
        }
        return null;
    }
    // Get fallback translation
    getFallbackTranslation(key) {
        const fallbackTranslations = this.translations.get(this.config.fallbackLanguage);
        if (fallbackTranslations && fallbackTranslations[key]) {
            return fallbackTranslations[key];
        }
        // Return English as last resort
        const englishTranslations = this.translations.get('en');
        if (englishTranslations && englishTranslations[key]) {
            return englishTranslations[key];
        }
        // Return key as string if no translation found
        return key;
    }
    // Get fallback nested translation
    getFallbackNestedTranslation(key, nestedKey) {
        const fallbackTranslations = this.translations.get(this.config.fallbackLanguage);
        if (fallbackTranslations && fallbackTranslations[key]) {
            const nested = fallbackTranslations[key][nestedKey];
            if (nested)
                return nested;
        }
        // Return English as last resort
        const englishTranslations = this.translations.get('en');
        if (englishTranslations && englishTranslations[key]) {
            const nested = englishTranslations[key][nestedKey];
            if (nested)
                return nested;
        }
        // Return nested key as string
        return nestedKey;
    }
}
// Default translations (English)
export const defaultTranslations = {
    navigation: {
        dashboard: 'Dashboard',
        search: 'Search',
        reports: 'Reports',
        settings: 'Settings',
        logout: 'Logout'
    },
    common: {
        search: 'Search',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        yes: 'Yes',
        no: 'No'
    },
    aircraft: {
        title: 'Aircraft',
        tail: 'Tail Number',
        make: 'Make',
        model: 'Model',
        year: 'Year',
        serial: 'Serial Number',
        registration: 'Registration',
        airworthiness: 'Airworthiness',
        riskScore: 'Risk Score',
        riskLevel: {
            low: 'Low Risk',
            medium: 'Medium Risk',
            high: 'High Risk',
            critical: 'Critical Risk'
        }
    },
    search: {
        placeholder: 'Enter tail number or aircraft make/model',
        filters: 'Filters',
        results: 'Results',
        noResults: 'No results found',
        make: 'Aircraft Make',
        model: 'Aircraft Model',
        year: 'Year',
        hasAccidents: 'Has Accidents',
        minYear: 'Min Year',
        maxYear: 'Max Year'
    },
    reports: {
        title: 'Reports',
        generate: 'Generate Report',
        export: 'Export',
        download: 'Download',
        summary: 'Summary',
        history: 'History',
        ownership: 'Ownership',
        accidents: 'Accidents',
        adDirectives: 'AD Directives'
    },
    notifications: {
        title: 'Notifications',
        newAD: 'New AD Directive',
        safetyAlert: 'Safety Alert',
        maintenanceReminder: 'Maintenance Reminder',
        markAsRead: 'Mark as Read',
        delete: 'Delete'
    },
    errors: {
        notFound: 'Not Found',
        unauthorized: 'Unauthorized',
        forbidden: 'Forbidden',
        serverError: 'Server Error',
        networkError: 'Network Error',
        validationError: 'Validation Error'
    }
};
// Translation loader function
export async function loadTranslations(language) {
    // In a real implementation, this would load translations from files or API
    // For now, return default English translations
    return defaultTranslations;
}
// Create i18n instance
export function createI18n(config) {
    const defaultConfig = {
        defaultLanguage: 'en',
        fallbackLanguage: 'en',
        supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ru'],
        loadTranslations
    };
    const finalConfig = { ...defaultConfig, ...config };
    return new I18nManager(finalConfig);
}
