import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import i18n from "../i18n";

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "AR"
  );

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
    // Set document direction based on language
    if (language.toLowerCase().startsWith("ar")) {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export { LanguageContext, LanguageProvider };
export default LanguageProvider;
