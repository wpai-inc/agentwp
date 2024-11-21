import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './lang/en';
import ru from './lang/ru';

i18n.use( initReactI18next ).init( {
  fallbackLng: 'ru',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: en,
    },
    ru: {
      translation: ru,
    },
  },
} );

export default i18n;
