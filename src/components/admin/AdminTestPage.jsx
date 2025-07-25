// src/components/Admin/AdminTestPage.jsx
import React, { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

export default function AdminTestPage() {
  const { user } = useAuthStore();
  const [testResult, setTestResult] = useState("");
  const [testing, setTesting] = useState(false);

  const testDatabase = async () => {
    setTesting(true);
    setTestResult("Testing database connection...\n");

    try {
      // Import supabase directly to test
      const { supabase } = await import("../../lib/supabase");

      setTestResult((prev) => prev + "Supabase client imported successfully\n");

      // Test basic connection
      const { data: testUsers, error: userError } = await supabase
        .from("users")
        .select("id, email, role")
        .limit(1);

      if (userError) {
        setTestResult(
          (prev) => prev + `Error accessing users table: ${userError.message}\n`
        );
      } else {
        setTestResult(
          (prev) =>
            prev +
            `Users table accessible. Found ${testUsers?.length || 0} users\n`
        );
      }

      // Test approval_requests table
      const { data: approvalData, error: approvalError } = await supabase
        .from("approval_requests")
        .select("*")
        .limit(1);

      if (approvalError) {
        setTestResult(
          (prev) =>
            prev +
            `Error accessing approval_requests table: ${approvalError.message}\n`
        );
        setTestResult(
          (prev) =>
            prev +
            "Please create the approval_requests table in Supabase SQL Editor\n"
        );
      } else {
        setTestResult(
          (prev) =>
            prev +
            `Approval_requests table accessible. Found ${
              approvalData?.length || 0
            } records\n`
        );
      }

      // Test sellers table
      const { data: sellersData, error: sellersError } = await supabase
        .from("sellers")
        .select("*")
        .limit(1);

      if (sellersError) {
        setTestResult(
          (prev) =>
            prev + `Error accessing sellers table: ${sellersError.message}\n`
        );
      } else {
        setTestResult(
          (prev) =>
            prev +
            `Sellers table accessible. Found ${
              sellersData?.length || 0
            } records\n`
        );
      }

      // Test service_providers table
      const { data: serviceData, error: serviceError } = await supabase
        .from("service_providers")
        .select("*")
        .limit(1);

      if (serviceError) {
        setTestResult(
          (prev) =>
            prev +
            `Error accessing service_providers table: ${serviceError.message}\n`
        );
      } else {
        setTestResult(
          (prev) =>
            prev +
            `Service_providers table accessible. Found ${
              serviceData?.length || 0
            } records\n`
        );
      }

      setTestResult((prev) => prev + "\n✅ Database test completed\n");
    } catch (error) {
      setTestResult((prev) => prev + `❌ Test failed: ${error.message}\n`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h3>Admin Dashboard - Database Test</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h5>Current User Info:</h5>
                <p>
                  <strong>Email:</strong> {user?.email || "Not logged in"}
                </p>
                <p>
                  <strong>Role:</strong> {user?.role || "No role"}
                </p>
                <p>
                  <strong>User ID:</strong> {user?.id || "No ID"}
                </p>
              </div>

              <div className="mb-3">
                <button
                  className="btn btn-primary"
                  onClick={testDatabase}
                  disabled={testing}
                >
                  {testing ? "Testing..." : "Test Database Connection"}
                </button>
              </div>

              {testResult && (
                <div className="mb-3">
                  <h5>Test Results:</h5>
                  <pre
                    className="bg-light p-3 rounded"
                    style={{ fontSize: "14px", whiteSpace: "pre-wrap" }}
                  >
                    {testResult}
                  </pre>
                </div>
              )}

              <div className="alert alert-info">
                <h6>Instructions:</h6>
                <ol>
                  <li>Make sure you're logged in with any account</li>
                  <li>
                    Click "Test Database Connection" to check table access
                  </li>
                  <li>
                    If approval_requests table is missing, create it using the
                    SQL in test_approval_table.sql
                  </li>
                  <li>Once tables are working, go back to /admin</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
