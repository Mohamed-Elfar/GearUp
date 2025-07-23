// src/components/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Re-initialize auth to handle the callback
        await initializeAuth();

        // Navigate to profile page after successful email confirmation
        navigate("/home/profile");
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [initializeAuth, navigate]);

  return (
    <div className="container-fluid py-5">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Confirming your email...</p>
      </div>
    </div>
  );
}
