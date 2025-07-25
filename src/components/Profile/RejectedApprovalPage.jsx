// src/components/Profile/RejectedApprovalPage.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";

export default function RejectedApprovalPage({ user }) {
  const { clearApprovalForReapplication } = useAuthStore();
  const [isReapplying, setIsReapplying] = useState(false);

  // Show rejection reason as toast on component mount
  useEffect(() => {
    if (user?.approval_notes) {
      // Create and show toast notification
      const toast = document.createElement("div");
      toast.className =
        "toast align-items-center text-white bg-danger border-0 position-fixed";
      toast.style.cssText = "top: 20px; right: 20px; z-index: 1055;";
      toast.setAttribute("role", "alert");
      toast.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            <strong>Verification Rejected:</strong><br>
            ${user.approval_notes}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;

      document.body.appendChild(toast);

      // Initialize and show toast using Bootstrap
      const bootstrapToast = new window.bootstrap.Toast(toast, {
        autohide: false, // Keep it visible until user dismisses
      });
      bootstrapToast.show();

      // Cleanup function
      return () => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      };
    }
  }, [user?.approval_notes]);

  const handleReapply = async () => {
    setIsReapplying(true);
    try {
      console.log("Starting reapplication process...");

      // Clear the rejection status and allow user to resubmit
      const { error } = await clearApprovalForReapplication();

      if (error) {
        console.error("Error clearing approval status:", error);
        alert("Failed to start reapplication. Please try again.");
        setIsReapplying(false);
        return;
      }

      console.log(
        "Approval status cleared, redirecting to verification form..."
      );

      // Small delay to ensure state is updated, then redirect
      setTimeout(() => {
        window.location.reload(); // This will reload and show verification form
      }, 500);
    } catch (error) {
      console.error("Error during reapplication:", error);
      alert("Failed to start reapplication. Please try again.");
      setIsReapplying(false);
    }
  };

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
            <div className="card-header bg-danger text-white text-center">
              <h2 className="h4 mb-0">
                <i className="bi bi-x-circle me-2"></i>
                Verification Rejected
              </h2>
            </div>
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i
                  className="bi bi-exclamation-triangle text-danger mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h3>Your verification was not approved</h3>
                <p className="text-muted mb-4">
                  Unfortunately, your {user?.role?.replace("_", " ")}{" "}
                  verification request could not be approved at this time.
                  Please review the feedback below and resubmit.
                </p>
              </div>

              {user?.approval_notes && (
                <div className="alert alert-danger text-start" role="alert">
                  <h6 className="alert-heading">
                    <i className="bi bi-info-circle me-2"></i>
                    Reason for Rejection
                  </h6>
                  <p className="mb-0">{user.approval_notes}</p>
                </div>
              )}

              <div className="alert alert-info text-start" role="alert">
                <h6 className="alert-heading">
                  <i className="bi bi-lightbulb me-2"></i>
                  What can you do?
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Review the rejection reason carefully
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Update your information and documents as needed
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Resubmit your verification request
                  </li>
                  <li>
                    <i className="bi bi-check2 text-success me-2"></i>
                    Contact support if you need assistance
                  </li>
                </ul>
              </div>

              <div className="row text-start mb-4">
                <div className="col-md-6">
                  <h6 className="text-muted mb-1">Reviewed On</h6>
                  <p>{formatDate(user?.reviewed_at)}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted mb-1">Status</h6>
                  <span className="badge bg-danger">
                    <i className="bi bi-x-circle me-1"></i>
                    Rejected
                  </span>
                </div>
              </div>

              <div className="d-flex gap-3 justify-content-center">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleReapply}
                  disabled={isReapplying}
                >
                  {isReapplying ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Reapply for Verification
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => (window.location.href = "/home")}
                  disabled={isReapplying}
                >
                  <i className="bi bi-house me-2"></i>
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
