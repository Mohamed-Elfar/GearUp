import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.png";
import styles from "./SplashPage.module.css";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after 4 seconds
    const timer = setTimeout(() => {
      navigate("/home");
    }, 4000);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splashContainer}>
      <div className={styles.splashContent}>
        {/* Spinning Logo */}
        <div className={styles.logoContainer}>
          <img
            src={logoImage}
            alt="GearUp Logo"
            className={styles.spinningLogo}
          />
        </div>

        {/* Company Name */}
        <div className={styles.companyInfo}>
          <h1 className={styles.companyName}>GearUp</h1>
          <p className={styles.companyTagline}>
            Transforming Vision into Reality
          </p>

          {/* Loading Animation */}
          <div className={styles.loadingAnimation}>
            <div className={styles.loadingBar}>
              <div className={styles.loadingProgress}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
