import TransButton from "../TransButton";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import Button from "../Button/Button";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import { useState } from "react";

export default function Navbar() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeAllModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <nav className="bg-primary-50 w-full py-3 fixed top-0 left-0 z-50 shadow-sm mb-5">
      <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink className="flex items-center gap-2" to="/home">
            <img src={logo} alt="Logo" className="h-15" />
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8 h-full">
            <ul className="flex items-center gap-8 m-0">
              <li>
                <NavLink
                  to="/learning"
                  className="text-gray-700 hover:text-primary-700 font-bold no-underline transition-colors duration-200 text-black"
                >
                  {t("navbar.learning")} <span className="ml-1">▼</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/graduates"
                  className="text-gray-700 hover:text-primary-700 font-bold no-underline transition-colors duration-200 text-black"
                >
                  {t("navbar.hireGraduates")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/partnership"
                  className="text-gray-700 hover:text-primary-700 font-bold no-underline transition-colors duration-200 text-black"
                >
                  {t("navbar.partnership")}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <TransButton />
            <button
              onClick={openLoginModal}
              className="text-primary-500 font-bold no-underline hover:text-primary-700 transition-colors duration-200 px-2"
            >
              {t("navbar.login")}
            </button>
            <Button
              label={t("navbar.joinUs")}
              padding="0 40px"
              handleClick={openRegisterModal}
            />
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/learning"
                className="text-gray-700 hover:text-primary-700 font-bold no-underline decoration-none py-2 text-black"
                style={{ textDecoration: "none" }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("navbar.learning")}
              </NavLink>
              <NavLink
                to="/graduates"
                className="text-gray-700 hover:text-primary-700 font-bold no-underline decoration-none py-2 text-black"
                style={{ textDecoration: "none" }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("navbar.hireGraduates")}
              </NavLink>
              <NavLink
                to="/partnership"
                className="text-gray-700 hover:text-primary-700 font-bold no-underline decoration-none py-2 text-black"
                style={{ textDecoration: "none" }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("navbar.partnership")}
              </NavLink>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <TransButton />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openLoginModal();
                  }}
                  className="text-primary-500 font-bold no-underline decoration-none hover:text-primary-700 my-2 text-left"
                  style={{ textDecoration: "none" }}
                >
                  {t("navbar.login")}
                </button>
                <Button
                  label={t("navbar.joinUs")}
                  handleClick={() => {
                    openRegisterModal();
                    setIsMenuOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeAllModals}
        onSwitchToRegister={openRegisterModal}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeAllModals}
        onSwitchToLogin={openLoginModal}
      />
    </nav>
  );
}
