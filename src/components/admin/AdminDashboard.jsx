// src/components/Admin/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../stores/authStore";

export default function AdminDashboard() {
  const { user, getApprovalRequests, reviewApprovalRequest } = useAuthStore();
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [reviewing, setReviewing] = useState(null);

  const fetchApprovalRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await getApprovalRequests(filter);

      if (error) {
        console.error("Error fetching approval requests:", error);

        // Check if the error is due to missing table
        if (
          error.message &&
          error.message.includes('relation "approval_requests" does not exist')
        ) {
          alert(
            "Database Error: The approval_requests table does not exist.\n\n" +
              "Please create the table in your Supabase SQL Editor first."
          );
        } else {
          alert(
            "Error fetching approval requests: " +
              (error.message || "Unknown error")
          );
        }
        setApprovalRequests([]);
      } else {
        setApprovalRequests(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error fetching approval requests: " + error.message);
      setApprovalRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filter, getApprovalRequests]);

  useEffect(() => {
    fetchApprovalRequests();
  }, [fetchApprovalRequests]);

  // Check if user is admin
  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Please Login</h4>
          <p>You must be logged in to access this page.</p>
          <a href="/" className="btn btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Access Denied</h4>
          <p>You must be an administrator to access this page.</p>
          <p>
            Current role:{" "}
            <span className="badge bg-secondary">{user.role}</span>
          </p>
          <a href="/home" className="btn btn-primary">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  const handleReview = async (requestId, status, notes = "") => {
    setReviewing(requestId);
    try {
      const { error } = await reviewApprovalRequest(
        requestId,
        status,
        notes,
        user.id
      );
      if (error) {
        alert("Error reviewing request: " + error.message);
      } else {
        alert(`Request ${status} successfully!`);
        fetchApprovalRequests(); // Refresh the list
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error reviewing request");
    } finally {
      setReviewing(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="bi bi-shield-check me-2"></i>
              Admin Dashboard - Approval Requests
            </h2>
            <div className="d-flex gap-2">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: "auto" }}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                className="btn btn-outline-primary"
                onClick={fetchApprovalRequests}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading approval requests...</p>
            </div>
          ) : approvalRequests.length === 0 ? (
            <div className="alert alert-info text-center">
              <h5>No {filter} approval requests found</h5>
              <p>There are currently no {filter} requests to review.</p>
            </div>
          ) : (
            <div className="row">
              {approvalRequests.map((request) => {
                // Handle missing user data gracefully
                const userData = request.users || {};
                const fullName =
                  userData.first_name && userData.last_name
                    ? `${userData.first_name} ${userData.last_name}`
                    : userData.email || "Unknown User";

                return (
                  <div key={request.id} className="col-lg-6 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">
                            <span className="badge bg-primary me-2">
                              {request.role_requested
                                .replace("_", " ")
                                .toUpperCase()}
                            </span>
                            {fullName}
                          </h6>
                        </div>
                        <span
                          className={`badge ${
                            request.status === "pending"
                              ? "bg-warning"
                              : request.status === "approved"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {request.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="card-body">
                        {/* User Information */}
                        <div className="mb-3">
                          <h6 className="text-muted mb-2">User Information</h6>
                          <div className="row">
                            <div className="col-sm-6">
                              <small className="text-muted">Email:</small>
                              <p className="mb-1">
                                {userData.email || "Not available"}
                              </p>
                            </div>
                            <div className="col-sm-6">
                              <small className="text-muted">Phone:</small>
                              <p className="mb-1">
                                {userData.phone_number || "Not provided"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Business Information */}
                        {request.role_requested === "seller" &&
                          request.sellers && (
                            <div className="mb-3">
                              <h6 className="text-muted mb-2">
                                Shop Information
                              </h6>
                              <p>
                                <strong>Shop Name:</strong>{" "}
                                {request.sellers.shop_name}
                              </p>
                              <p>
                                <strong>Address:</strong>{" "}
                                {request.sellers.shop_address}
                              </p>
                              <p>
                                <strong>ID Card #:</strong>{" "}
                                {request.sellers.id_card_number}
                              </p>
                              {request.sellers.latitude &&
                                request.sellers.longitude && (
                                  <p>
                                    <strong>Location:</strong>{" "}
                                    <a
                                      href={`https://www.google.com/maps?q=${request.sellers.latitude},${request.sellers.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary"
                                    >
                                      View on Map{" "}
                                      <i className="bi bi-box-arrow-up-right"></i>
                                    </a>
                                  </p>
                                )}
                            </div>
                          )}

                        {request.role_requested === "service_provider" &&
                          request.service_providers && (
                            <div className="mb-3">
                              <h6 className="text-muted mb-2">
                                Service Information
                              </h6>
                              <p>
                                <strong>Address:</strong>{" "}
                                {request.service_providers.service_address}
                              </p>
                              {request.service_providers.specialization && (
                                <div>
                                  <strong>Specialization:</strong>
                                  <div className="mt-1">
                                    {request.service_providers.specialization
                                      .split(", ")
                                      .map((spec, index) => (
                                        <span
                                          key={index}
                                          className="badge bg-secondary me-1 mb-1"
                                        >
                                          {spec.trim()}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              )}
                              {request.service_providers.latitude &&
                                request.service_providers.longitude && (
                                  <p>
                                    <strong>Location:</strong>{" "}
                                    <a
                                      href={`https://www.google.com/maps?q=${request.service_providers.latitude},${request.service_providers.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary"
                                    >
                                      View on Map{" "}
                                      <i className="bi bi-box-arrow-up-right"></i>
                                    </a>
                                  </p>
                                )}
                            </div>
                          )}

                        {request.role_requested === "customer" && (
                          <div className="mb-3">
                            <h6 className="text-muted mb-2">
                              Customer Information
                            </h6>
                            <div className="alert alert-info">
                              <i className="bi bi-info-circle me-2"></i>
                              Customer verification request - reviewing identity
                              documents and contact information.
                            </div>
                          </div>
                        )}

                        {/* Request Details */}
                        <div className="mb-3">
                          <h6 className="text-muted mb-2">Request Details</h6>
                          <p>
                            <strong>Submitted:</strong>{" "}
                            {formatDate(request.created_at)}
                          </p>
                          {request.reviewed_at && (
                            <p>
                              <strong>Reviewed:</strong>{" "}
                              {formatDate(request.reviewed_at)}
                            </p>
                          )}
                          {request.notes && (
                            <div>
                              <strong>Admin Notes:</strong>
                              <p className="text-muted">{request.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - Only show for pending requests */}
                      {request.status === "pending" && (
                        <div className="card-footer bg-transparent">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success flex-fill"
                              onClick={() =>
                                handleReview(request.id, "approved")
                              }
                              disabled={reviewing === request.id}
                            >
                              {reviewing === request.id ? (
                                <span className="spinner-border spinner-border-sm me-1"></span>
                              ) : (
                                <i className="bi bi-check-circle me-1"></i>
                              )}
                              Approve
                            </button>
                            <button
                              className="btn btn-danger flex-fill"
                              onClick={() => {
                                const notes = prompt(
                                  "Reason for rejection (optional):"
                                );
                                if (notes !== null) {
                                  // User didn't cancel
                                  handleReview(request.id, "rejected", notes);
                                }
                              }}
                              disabled={reviewing === request.id}
                            >
                              {reviewing === request.id ? (
                                <span className="spinner-border spinner-border-sm me-1"></span>
                              ) : (
                                <i className="bi bi-x-circle me-1"></i>
                              )}
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
