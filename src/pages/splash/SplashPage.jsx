import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import logoImage from "../../assets/spinnerLogo.png";
import "./SplashPage.css";

export default function SplashPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, authLoading } = useAuthStore();

  useEffect(() => {
    // If already authenticated, redirect immediately based on role
    if (isAuthenticated && user) {
      console.log("User already authenticated:", user);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
      return;
    }

    // If not authenticated and auth is not loading, redirect to home after 4 seconds
    if (!authLoading) {
      const timer = setTimeout(() => {
        navigate("/home");
      }, 4000);

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, [navigate, isAuthenticated, user, authLoading]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        {/* Spinning Logo */}
        <div className="logo-container">
          <img src={logoImage} alt="GearUp Logo" className="spinning-logo" />
        </div>

        {/* Company Name */}
        <div className="company-info">
          <div className="company-text-container">
            <h1 className="company-main-name">
              <span className="consul">Gear</span>
              <span className="rain">Up</span>
              <span className="co"></span>
            </h1>
            <p className="company-subtitle">Learning and Career Growth</p>
          </div>

          {/* Loading Animation */}
          <div className="loading-animation">
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
