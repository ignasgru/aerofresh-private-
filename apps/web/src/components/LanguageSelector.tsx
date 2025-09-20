import React from 'react';
import { SupportedLanguage } from '@aerofresh/core';

interface LanguageSelectorProps {
  i18n: any;
  onLanguageChange: (language: SupportedLanguage) => void;
}

const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ja: '日本語',
  zh: '中文',
  ru: 'Русский'
};

export default function LanguageSelector({ i18n, onLanguageChange }: LanguageSelectorProps) {
  const supportedLanguages = i18n.getSupportedLanguages();
  const currentLanguage = i18n.getCurrentLanguage();

  return (
    <div className="relative">
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
        className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select language"
      >
        {supportedLanguages.map((lang: SupportedLanguage) => (
          <option key={lang} value={lang}>
            {languageNames[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}
