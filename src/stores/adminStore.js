import { create } from "zustand";
import { supabase, handleSupabaseError } from "../lib/supabase";

export const useAdminStore = create((set) => ({
  // State
  allUsers: [],
  pendingRequests: [],
  analyticsData: {},
  loadingAdmin: false,
  errorAdmin: null,
  feedbackReports: [],
  activityLogs: [],
  loadingReports: false,

  // Actions
  fetchAllUsers: async () => {
    set({ loadingAdmin: true, errorAdmin: null });

    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          `
          *,
          customers(*),
          sellers(*),
          service_providers(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ allUsers: data || [], loadingAdmin: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ errorAdmin: errorMessage, loadingAdmin: false });
      return { data: null, error: errorMessage };
    }
  },

  fetchPendingRequests: async () => {
    try {
      const { data, error } = await supabase
        .from("approval_requests")
        .select(
          `
          *,
          user:users(*)
        `
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ pendingRequests: data || [] });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  approveRequest: async (requestId, adminId, notes = "") => {
    try {
      const { data, error } = await supabase
        .from("approval_requests")
        .update({
          status: "approved",
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          notes,
        })
        .eq("id", requestId)
        .select(
          `
          *,
          user:users(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        pendingRequests: state.pendingRequests.filter(
          (req) => req.id !== requestId
        ),
      }));

      // Log admin activity
      await useAdminStore
        .getState()
        .logActivity(adminId, "approve_request", `Request ID: ${requestId}`);

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  rejectRequest: async (requestId, adminId, notes = "") => {
    try {
      const { data, error } = await supabase
        .from("approval_requests")
        .update({
          status: "rejected",
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          notes,
        })
        .eq("id", requestId)
        .select(
          `
          *,
          user:users(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        pendingRequests: state.pendingRequests.filter(
          (req) => req.id !== requestId
        ),
      }));

      // Log admin activity
      await useAdminStore
        .getState()
        .logActivity(adminId, "reject_request", `Request ID: ${requestId}`);

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  suspendUser: async (userId, adminId, reason = "") => {
    try {
      // Update user status (you might need to add a status field to users table)
      const { data, error } = await supabase
        .from("users")
        .update({ status: "suspended" })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      // Log admin activity
      await useAdminStore
        .getState()
        .logActivity(
          adminId,
          "suspend_user",
          `User ID: ${userId}, Reason: ${reason}`
        );

      // Update local state
      set((state) => ({
        allUsers: state.allUsers.map((user) =>
          user.id === userId ? { ...user, status: "suspended" } : user
        ),
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  unsuspendUser: async (userId, adminId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ status: "active" })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      // Log admin activity
      await useAdminStore
        .getState()
        .logActivity(adminId, "unsuspend_user", `User ID: ${userId}`);

      // Update local state
      set((state) => ({
        allUsers: state.allUsers.map((user) =>
          user.id === userId ? { ...user, status: "active" } : user
        ),
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  getAnalytics: async () => {
    try {
      // Get user counts by role
      const { data: userStats, error: userError } = await supabase
        .from("users")
        .select("role");

      if (userError) throw userError;

      // Get order statistics
      const { data: orderStats, error: orderError } = await supabase
        .from("orders")
        .select("status, total_price");

      if (orderError) throw orderError;

      // Get service booking statistics
      const { data: serviceStats, error: serviceError } = await supabase
        .from("service_bookings")
        .select("status");

      if (serviceError) throw serviceError;

      const analytics = {
        users: {
          total: userStats.length,
          customers: userStats.filter((u) => u.role === "customer").length,
          sellers: userStats.filter((u) => u.role === "seller").length,
          serviceProviders: userStats.filter(
            (u) => u.role === "service_provider"
          ).length,
          admins: userStats.filter((u) => u.role === "admin").length,
        },
        orders: {
          total: orderStats.length,
          pending: orderStats.filter((o) => o.status === "pending").length,
          shipped: orderStats.filter((o) => o.status === "shipped").length,
          delivered: orderStats.filter((o) => o.status === "delivered").length,
          cancelled: orderStats.filter((o) => o.status === "cancelled").length,
          totalRevenue: orderStats.reduce(
            (sum, order) => sum + (order.total_price || 0),
            0
          ),
        },
        services: {
          total: serviceStats.length,
          pending: serviceStats.filter((s) => s.status === "pending").length,
          confirmed: serviceStats.filter((s) => s.status === "confirmed")
            .length,
          completed: serviceStats.filter((s) => s.status === "completed")
            .length,
          cancelled: serviceStats.filter((s) => s.status === "cancelled")
            .length,
        },
      };

      set({ analyticsData: analytics });
      return { data: analytics, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  fetchFeedbackReports: async () => {
    set({ loadingReports: true });

    try {
      const { data, error } = await supabase
        .from("feedback_reports")
        .select(
          `
          *,
          reporter:users!feedback_reports_reporter_id_fkey(*),
          reported_user:users!feedback_reports_reported_user_id_fkey(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ feedbackReports: data || [], loadingReports: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ loadingReports: false });
      return { data: null, error: errorMessage };
    }
  },

  updateReportStatus: async (reportId, status, adminId) => {
    try {
      const { data, error } = await supabase
        .from("feedback_reports")
        .update({ status })
        .eq("id", reportId)
        .select(
          `
          *,
          reporter:users!feedback_reports_reporter_id_fkey(*),
          reported_user:users!feedback_reports_reported_user_id_fkey(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        feedbackReports: state.feedbackReports.map((report) =>
          report.id === reportId ? data : report
        ),
      }));

      // Log admin activity
      await useAdminStore
        .getState()
        .logActivity(
          adminId,
          "update_report",
          `Report ID: ${reportId}, Status: ${status}`
        );

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  fetchActivityLogs: async (limit = 100) => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select(
          `
          *,
          user:users(*)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      set({ activityLogs: data || [] });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  logActivity: async (userId, action, target = "") => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .insert({
          user_id: userId,
          action,
          target,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  // Search and filter functions
  searchUsers: async (searchTerm, role = null) => {
    try {
      let query = supabase.from("users").select(`
          *,
          customers(*),
          sellers(*),
          service_providers(*)
        `);

      if (role) {
        query = query.eq("role", role);
      }

      if (searchTerm) {
        query = query.or(
          `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  // Clear errors
  clearError: () => {
    set({ errorAdmin: null });
  },
}));

// Selectors
export const useUsersByRole = (role) => {
  const { allUsers } = useAdminStore();
  return allUsers.filter((user) => user.role === role);
};

export const usePendingReports = () => {
  const { feedbackReports } = useAdminStore();
  return feedbackReports.filter((report) => report.status === "pending");
};
