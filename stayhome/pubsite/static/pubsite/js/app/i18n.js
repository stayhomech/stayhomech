import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Locize from "i18next-locize-backend";

export default function (lang, api_key, running_env) {

    // Defaults
    var debug = true;
    var saveMissing = true;
    var updateMissing = true;
    if (running_env == 'prod' || running_env == 'pre-prod') {
        debug = false;
        saveMissing = false;
        updateMissing = false;
    }

    return i18n
    .use(Locize)
    .use(initReactI18next)
    .init({
        lng: lang,
        fallbackLng: 'en',
        debug: debug,
        saveMissing: saveMissing,
        updateMissing: updateMissing,

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