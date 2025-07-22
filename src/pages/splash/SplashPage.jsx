import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/spinnerLogo.png";
import "./SplashPage.css";

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
