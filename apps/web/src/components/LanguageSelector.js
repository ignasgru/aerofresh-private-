import { jsx as _jsx } from "react/jsx-runtime";
const languageNames = {
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
export default function LanguageSelector({ i18n, onLanguageChange }) {
    const supportedLanguages = i18n.getSupportedLanguages();
    const currentLanguage = i18n.getCurrentLanguage();
    return (_jsx("div", { className: "relative", children: _jsx("select", { value: currentLanguage, onChange: (e) => onLanguageChange(e.target.value), className: "bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500", "aria-label": "Select language", children: supportedLanguages.map((lang) => (_jsx("option", { value: lang, children: languageNames[lang] }, lang))) }) }));
}
