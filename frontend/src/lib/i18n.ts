import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

function mergeTranslations(...translations: Array<Record<string, unknown>>) {
  return Object.assign({}, ...translations);
}

type LocaleModule = {
  default: Record<string, unknown>;
};

function getModuleDefaultExport(module: unknown): Record<string, unknown> {
  if (module && typeof module === 'object' && 'default' in module) {
    return (module as LocaleModule).default;
  }
  return module as Record<string, unknown>;
}

const enModules = import.meta.glob('../locales/en/*.json', { eager: true }) as Record<string, unknown>;
const zhCNModules = import.meta.glob('../locales/zh-CN/*.json', { eager: true }) as Record<string, unknown>;

const enTranslation = mergeTranslations(...Object.values(enModules).map(getModuleDefaultExport));
const zhTranslation = mergeTranslations(...Object.values(zhCNModules).map(getModuleDefaultExport));

const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
  'zh-CN': {
    translation: zhTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    debug: false,
    supportedLngs: ['en', 'zh', 'zh-CN'],

    interpolation: {
      escapeValue: false, // React 已经默认转义了
      format: (value, format, lng, options) => {
        if (format === 'currency') {
          return new Intl.NumberFormat(options?.locale || lng, {
            style: 'currency',
            currency: options?.currency || 'USD',
             currencyDisplay: 'narrowSymbol',
            ...options,
          }).format(value);
        }
        return value;
      },
    },

    detection: {
      order: ['localStorage', 'htmlTag', 'navigator'],
      caches: ['localStorage'],
      convertDetectedLanguage: (lng: string) => {
        const normalized = lng.toLowerCase();
        if (normalized === 'zh-cn' || normalized.startsWith('zh-')) {
          return 'zh';
        }
        if (normalized === 'en') {
          return 'zh';
        }
        return 'zh';
      },
    },
  });

export default i18n;
