import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
import "./i18n";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
