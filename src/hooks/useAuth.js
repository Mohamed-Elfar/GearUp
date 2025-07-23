import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useSettingsStore } from "../stores/settingsStore";
import { useChatStore } from "../stores/chatStore";

// Hook for authentication with automatic redirect
export const useAuth = (requireAuth = false, allowedRoles = []) => {
  const { user, isAuthenticated, authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && requireAuth && !isAuthenticated) {
      // Redirect to login page
      window.location.href = "/login";
    }

    if (
      !authLoading &&
      user &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role)
    ) {
      // Redirect to unauthorized page or dashboard
      window.location.href = "/unauthorized";
    }
  }, [user, isAuthenticated, authLoading, requireAuth, allowedRoles]);

  return {
    user,
    isAuthenticated,
    authLoading,
    isAdmin: user?.role === "admin",
    isSeller: user?.role === "seller",
    isCustomer: user?.role === "customer",
    isServiceProvider: user?.role === "service_provider",
  };
};

// Hook for user location with permission handling
export const useLocation = () => {
  const { location, requestLocation, clearLocation } = useSettingsStore();

  const getCurrentLocation = async () => {
    try {
      const result = await requestLocation();
      return result;
    } catch (error) {
      console.error("Failed to get location:", error);
      return null;
    }
  };

  return {
    location,
    getCurrentLocation,
    clearLocation,
    hasLocation: location.enabled && location.latitude && location.longitude,
  };
};

// Hook for role-based component rendering
export const useRoleCheck = () => {
  const { user } = useAuthStore();

  const checkRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  const checkRoles = (allowedRoles) => {
    return allowedRoles.includes(user?.role);
  };

  const isAdmin = () => checkRole("admin");
  const isSeller = () => checkRole("seller");
  const isCustomer = () => checkRole("customer");
  const isServiceProvider = () => checkRole("service_provider");

  return {
    checkRole,
    checkRoles,
    isAdmin,
    isSeller,
    isCustomer,
    isServiceProvider,
    userRole: user?.role,
  };
};

// Hook for theme and language
export const useAppSettings = () => {
  const {
    theme,
    language,
    currency,
    setTheme,
    setLanguage,
    setCurrency,
    notifications,
    updateNotificationSettings,
  } = useSettingsStore();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return {
    theme,
    language,
    currency,
    notifications,
    setTheme,
    setLanguage,
    setCurrency,
    updateNotificationSettings,
    toggleTheme,
    toggleLanguage,
    isRTL: language === "ar",
    isDark: theme === "dark",
  };
};

// Hook for error handling across stores
export const useErrorHandler = () => {
  const handleError = (error, context = "") => {
    console.error(`Error in ${context}:`, error);

    // You can integrate with a toast library here
    if (typeof window !== "undefined" && window.toast) {
      window.toast.error(error.message || "An error occurred");
    } else {
      alert(error.message || "An error occurred");
    }
  };

  const handleSuccess = (message, context = "") => {
    console.log(`Success in ${context}:`, message);

    // You can integrate with a toast library here
    if (typeof window !== "undefined" && window.toast) {
      window.toast.success(message);
    }
  };

  return {
    handleError,
    handleSuccess,
  };
};

// Hook for loading states
export const useLoadingStates = () => {
  const { authLoading } = useAuthStore();
  // You can add other loading states from different stores here

  const isAnyLoading = authLoading;
  // || loadingProducts || loadingOrders || etc.

  return {
    authLoading,
    isAnyLoading,
  };
};

// Hook for real-time subscriptions
export const useRealTimeSubscriptions = (userId) => {
  const { subscribeToMessages, subscribeToConversations } = useChatStore();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to conversations
    const unsubscribeConversations = subscribeToConversations(userId);

    return () => {
      unsubscribeConversations();
    };
  }, [userId, subscribeToConversations]);

  return {
    subscribeToMessages, // For individual conversations
  };
};
