import React, { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import TransButton from "../TransButton";
import logo from "../../assets/logo.png";
import Button from "../Button/Button";
import "./Navbar.css";

// Lazy load modal components for better performance
const LoginModal = React.lazy(() => import("../LoginModal/LoginModal"));
const RegisterModal = React.lazy(() =>
  import("../RegisterModal/RegisterModal")
);

const Navbar = memo(() => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLoginModal = useCallback(() => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  }, []);

  const openRegisterModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  }, []);

  const closeAllModals = useCallback(() => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <nav
      className="bg-primary-50 w-full py-3 fixed top-0 left-0 z-50 shadow-sm mb-5"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink
            className="logo flex items-center gap-3"
            to="/home"
            aria-label="GearUp - Go to home page"
          >
            <img
              src={logo}
              alt="GearUp Company Logo"
              className="h-15"
              width="60"
              height="60"
              loading="eager"
            />
            <div className="company-brand">
              <div className="brand-name" aria-label="GearUp">
                <span className="consul-nav">Gear</span>
                <span className="rain-nav">Up</span>
                <span className="co-nav"></span>
              </div>
              <div
                className="brand-tagline"
                aria-label="Learning and Career Growth"
              >
                Learning and Career Growth
              </div>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8 h-full">
            <ul className="flex items-center gap-8 m-0" role="menubar">
              <li role="none">
                <NavLink
                  to="/learning"
                  className="text-gray-700 hover:text-primary-700 font-bold no-underline transition-colors duration-200 text-black"
                  role="menuitem"
                  aria-label="Learning programs and courses"
                >
                  {t("navbar.learning")}{" "}
                  <span className="ml-1" aria-hidden="true">
                    ▼
                  </span>
                </NavLink>
              </li>
              <li role="none">
                <NavLink
                  to="/graduates"
                  className="text-gray-700 hover:text-primary-700 font-bold no-underline transition-colors duration-200 text-black"
                  role="menuitem"
                  aria-label="Hire our graduates"
                >
                  {t("navbar.hireGraduates")}
                </NavLink>
              </li>
              <li role="none">
                <NavLink
                  to="/partnership"
                  className="text-gray-700 hover:text-primary-700 font-bold no-underline transition-colors duration-200 text-black"
                  role="menuitem"
                  aria-label="Partnership opportunities"
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
            onClick={toggleMobileMenu}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
          <div
            className="lg:hidden py-4 border-t border-gray-200"
            id="mobile-menu"
            role="menu"
            aria-labelledby="mobile-menu-button"
          >
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/learning"
                className="text-gray-700 hover:text-primary-700 font-bold no-underline decoration-none py-2 text-black"
                style={{ textDecoration: "none" }}
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                aria-label="Learning programs and courses"
              >
                {t("navbar.learning")}
              </NavLink>
              <NavLink
                to="/graduates"
                className="text-gray-700 hover:text-primary-700 font-bold no-underline decoration-none py-2 text-black"
                style={{ textDecoration: "none" }}
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                aria-label="Hire our graduates"
              >
                {t("navbar.hireGraduates")}
              </NavLink>
              <NavLink
                to="/partnership"
                className="text-gray-700 hover:text-primary-700 font-bold no-underline decoration-none py-2 text-black"
                style={{ textDecoration: "none" }}
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                aria-label="Partnership opportunities"
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
                  type="button"
                  aria-label="Login to your account"
                >
                  {t("navbar.login")}
                </button>
                <Button
                  label={t("navbar.joinUs")}
                  handleClick={() => {
                    openRegisterModal();
                    setIsMenuOpen(false);
                  }}
                  aria-label="Join our platform"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Components with Suspense for lazy loading */}
      <React.Suspense fallback={<div aria-hidden="true"></div>}>
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
      </React.Suspense>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
