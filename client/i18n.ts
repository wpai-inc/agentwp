import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './lang/ru';

i18n.use( initReactI18next ).init( {
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    ru: {
      translation: ru,
    },
  },
} );

export default i18n;
