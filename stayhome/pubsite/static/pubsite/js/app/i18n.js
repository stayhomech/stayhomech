import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Locize from "i18next-locize-backend";

export default function (lang, api_key) {

    return i18n
    .use(Locize)
    .use(initReactI18next)
    .init({
      lng: lang,
      fallbackLng: 'en',
      debug: true,
      saveMissing: true,
      updateMissing: true,
  
      interpolation: {
        escapeValue: false,
      },
  
      backend: {
          projectId: 'e1bdb533-60b1-4940-a421-a102ba5f85fc',
          apiKey: api_key,
          referenceLng: 'en',
          allowedAddOrUpdateHosts: ['localhost', '127.0.0.1']
      }
    });

};