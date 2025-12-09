import enTranslations from './translations/en.js'
import viTranslations from './translations/vi.js'

const translations = {
  en: enTranslations,
  vi: viTranslations,
}

/**
 * Get translation by key path (e.g., 'page.ranking.loading')
 * @param {string} lang - Language code (default: 'en')
 * @param {string} key - Translation key path
 * @param {string} fallback - Fallback text if translation not found
 * @returns {string} Translated text
 */
export function t(lang = 'en', key, fallback = '') {
  const keys = key.split('.')
  let value = translations[lang] || translations.en

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return fallback || key
    }
  }

  return typeof value === 'string' ? value : (fallback || key)
}

/**
 * Create a translation function bound to a language
 * @param {string} lang - Language code
 * @returns {Function} Translation function
 */
export function createTranslator(lang = 'en') {
  return (key, fallback = '') => t(lang, key, fallback)
}

export { translations }
