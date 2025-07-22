import React, { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import TransButton from "../TransButton";
import logo from "../../assets/logo.png";
import Button from "../Button/Button";
import styles from "./Navbar.module.css";

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
      className={`navbar navbar-expand-lg navbar-custom shadow-sm ${styles.navbar}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-fluid px-3 px-lg-4">
        <div
          className={`d-flex justify-content-between align-items-center w-100 ${styles.navbarContainer}`}
        >
          {/* Logo */}
          <NavLink
            className="navbar-brand d-flex align-items-center gap-3 text-decoration-none"
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
              <div
                className="brand-name d-flex align-items-center"
                aria-label={t("brand.name")}
              >
                <span
                  className={`consul-nav text-white fw-bold fs-3 me-1 ${styles.brandGear}`}
                >
                  GEAR
                </span>
                <span
                  className={`rain-nav text-white fw-bold fs-3 ${styles.brandUp}`}
                >
                  UP
                </span>
                <span className="co-nav"></span>
              </div>
              <div
                className="brand-tagline text-white-50 small"
                aria-label={t("brand.tagline")}
              >
                {t("brand.tagline")}
              </div>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center justify-content-center flex-grow-1 mx-4">
            <ul
              className="navbar-nav d-flex flex-row align-items-center gap-4 mb-0"
              role="menubar"
            >
              <li className="nav-item" role="none">
                <NavLink
                  to="/learning"
                  className="nav-link text-white fw-medium text-decoration-none px-3"
                  role="menuitem"
                  aria-label="Learning programs and courses"
                >
                  {t("navbar.learning")}{" "}
                  <span className="ms-1" aria-hidden="true">
                    ▼
                  </span>
                </NavLink>
              </li>
              <li className="nav-item" role="none">
                <NavLink
                  to="/graduates"
                  className="nav-link text-white fw-medium text-decoration-none px-3"
                  role="menuitem"
                  aria-label="Hire our graduates"
                >
                  {t("navbar.hireGraduates")}
                </NavLink>
              </li>
              <li className="nav-item" role="none">
                <NavLink
                  to="/partnership"
                  className="nav-link text-white fw-medium text-decoration-none px-3"
                  role="menuitem"
                  aria-label="Partnership opportunities"
                >
                  {t("navbar.partnership")}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Right side - Desktop */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <TransButton />
            <button
              onClick={openLoginModal}
              className={`btn btn-link text-white fw-medium text-decoration-none px-2 ${styles.loginButton}`}
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
            className={`navbar-toggler d-lg-none btn btn-outline-light p-2 ${styles.mobileMenuButton}`}
            onClick={toggleMobileMenu}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
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
            className={`d-lg-none ${styles.mobileNav}`}
            id="mobile-menu"
            role="menu"
            aria-labelledby="mobile-menu-button"
          >
            <div className={`d-flex flex-column ${styles.mobileNavContainer}`}>
              <NavLink
                to="/learning"
                className={`nav-link text-white fw-medium text-decoration-none ${styles.mobileNavLink}`}
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                aria-label="Learning programs and courses"
              >
                {t("navbar.learning")}
              </NavLink>
              <NavLink
                to="/graduates"
                className={`nav-link text-white fw-medium text-decoration-none ${styles.mobileNavLink}`}
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                aria-label="Hire our graduates"
              >
                {t("navbar.hireGraduates")}
              </NavLink>
              <NavLink
                to="/partnership"
                className={`nav-link text-white fw-medium text-decoration-none ${styles.mobileNavLink}`}
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                aria-label="Partnership opportunities"
              >
                {t("navbar.partnership")}
              </NavLink>

              <div className={`d-flex flex-column ${styles.mobileNavDivider}`}>
                <div className="mb-3 w-100">
                  <TransButton mobileStyle={true} />
                </div>
                <div className="d-flex flex-column w-100">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openLoginModal();
                    }}
                    className={`btn text-white fw-medium ${styles.mobileLoginButton}`}
                    type="button"
                    aria-label="Login to your account"
                  >
                    {t("navbar.login")}
                  </button>
                  <div className={styles.mobileJoinButton}>
                    <Button
                      label={t("navbar.joinUs")}
                      customClasses={`btn btn-primary fw-bold ${styles.mobileJoinButtonStyled}`}
                      handleClick={() => {
                        openRegisterModal();
                        setIsMenuOpen(false);
                      }}
                      aria-label="Join our platform"
                    />
                  </div>
                </div>
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
