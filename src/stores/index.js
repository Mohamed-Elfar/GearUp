// Main store exports
export { useAuthStore } from "./authStore";
export { useProductsStore, useFilteredProducts } from "./productsStore";
export {
  useServicesStore,
  useAvailableServices,
  useBookingsByStatus,
} from "./servicesStore";
export {
  useOrdersStore,
  useCartItems,
  useCartTotal,
  useOrdersByStatus,
} from "./ordersStore";
export { useAdminStore, useUsersByRole, usePendingReports } from "./adminStore";
export {
  useChatStore,
  useUnreadConversations,
  useConversationWithUser,
} from "./chatStore";
export { useSettingsStore, initializeSettings } from "./settingsStore";

// Store initialization
export const initializeStores = async () => {
  // Initialize settings first
  const { initializeSettings } = await import("./settingsStore");
  initializeSettings();

  // Initialize auth
  const { useAuthStore } = await import("./authStore");
  await useAuthStore.getState().initializeAuth();

  // Subscribe to auth changes
  const unsubscribeAuth = useAuthStore.getState().subscribeToAuthChanges();

  // Return cleanup function
  return () => {
    unsubscribeAuth();
  };
};

// Global store actions for cross-store communication
export const globalActions = {
  // Clear all stores on logout
  clearAllStores: () => {
    // Import stores dynamically to avoid circular dependencies
    import("./productsStore").then(({ useProductsStore }) => {
      useProductsStore.getState().clearError();
    });
    import("./servicesStore").then(({ useServicesStore }) => {
      useServicesStore.getState().clearError();
    });
    import("./ordersStore").then(({ useOrdersStore }) => {
      useOrdersStore.getState().clearError();
      useOrdersStore.getState().clearCart();
    });
    import("./adminStore").then(({ useAdminStore }) => {
      useAdminStore.getState().clearError();
    });
    import("./chatStore").then(({ useChatStore }) => {
      useChatStore.getState().clearError();
      useChatStore.getState().clearCurrentConversation();
    });
  },

  // Refresh user-specific data after login
  refreshUserData: async (user) => {
    try {
      const { useProductsStore } = await import("./productsStore");
      const { useServicesStore } = await import("./servicesStore");
      const { useOrdersStore } = await import("./ordersStore");
      const { useChatStore } = await import("./chatStore");

      // Fetch data based on user role
      if (user.role === "seller") {
        await useProductsStore.getState().fetchProducts(user.id);
        await useOrdersStore.getState().fetchUserOrders(user.id, "seller");
      } else if (user.role === "customer") {
        await useOrdersStore.getState().fetchUserOrders(user.id, "customer");
        await useServicesStore.getState().fetchMyBookings(user.id, "customer");
      } else if (user.role === "service_provider") {
        await useServicesStore
          .getState()
          .fetchMyBookings(user.id, "service_provider");
      } else if (user.role === "admin") {
        const { useAdminStore } = await import("./adminStore");
        await useAdminStore.getState().fetchAllUsers();
        await useAdminStore.getState().fetchPendingRequests();
        await useAdminStore.getState().getAnalytics();
      }

      // Fetch conversations for all users
      await useChatStore.getState().fetchConversations(user.id);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  },
};
