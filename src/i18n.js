import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import EN from "./i18n/EN.json";
import AR from "./i18n/AR.json";

i18n.use(initReactI18next).init({
  resources: {
    EN: { translation: EN },
    AR: { translation: AR },
  },
  fallbackLng: "EN",
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
  interpolation: {
    escapeValue: false,
  },
  supportedLngs: ["EN", "AR"], // Define supported languages
});

export default i18n;
