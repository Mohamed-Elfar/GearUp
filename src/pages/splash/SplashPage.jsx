import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.png";
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
          <h1 className="company-name">GearUp</h1>
          <p className="company-tagline">Transforming Vision into Reality</p>

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
