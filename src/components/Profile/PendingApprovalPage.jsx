// src/components/Profile/PendingApprovalPage.jsx
import React from "react";

export default function PendingApprovalPage({ user }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-warning text-white text-center">
              <h2 className="h4 mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Verification Under Review
              </h2>
            </div>
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <div className="spinner-border text-warning mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h3>Your verification is being reviewed</h3>
                <p className="text-muted mb-4">
                  Thank you for submitting your {user?.role?.replace('_', ' ')} verification request. 
                  Our admin team is currently reviewing your information and documents.
                </p>
              </div>

              <div className="alert alert-info" role="alert">
                <h6 className="alert-heading">
                  <i className="bi bi-info-circle me-2"></i>
                  What happens next?
                </h6>
                <ul className="list-unstyled mb-0 text-start">
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Our team will review your submitted documents
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Verification typically takes 24-48 hours
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    You'll receive an email notification once reviewed
                  </li>
                  <li>
                    <i className="bi bi-check2 text-success me-2"></i>
                    You can then access all platform features
                  </li>
                </ul>
              </div>

              <div className="row text-start">
                <div className="col-md-6">
                  <h6 className="text-muted mb-1">Submitted On</h6>
                  <p>{formatDate(user?.created_at)}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted mb-1">Status</h6>
                  <span className="badge bg-warning">
                    <i className="bi bi-clock me-1"></i>
                    Pending Review
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button 
                  className="btn btn-outline-primary me-3"
                  onClick={() => window.location.href = "/home"}
                >
                  <i className="bi bi-house me-2"></i>
                  Go to Dashboard
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Check Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
