import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to get current user profile
export const getCurrentUserProfile = async () => {
  try {
    console.log("Getting current user session...");

    // Add timeout for session fetch
    const sessionTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Session fetch timeout")), 5000)
    );

    const sessionPromise = supabase.auth.getSession();

    const {
      data: { session },
    } = await Promise.race([sessionPromise, sessionTimeout]);

    console.log("Session fetch completed");

    if (!session) {
      console.log("No session found");
      return null;
    }

    console.log("Session found, fetching user profile for:", session.user.id);

    // Add timeout for user profile fetch
    const profileTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Profile fetch timeout")), 5000)
    );

    const profilePromise = supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    const { data: userProfile, error } = await Promise.race([
      profilePromise,
      profileTimeout,
    ]);

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    if (!userProfile) {
      console.log("No user profile found");
      return null;
    }

    console.log("Basic user profile fetched:", userProfile);

    // Optionally, fetch role-specific data based on user role
    // We'll do this only if needed to avoid complex joins
    try {
      if (userProfile.role === "customer") {
        const { data: customerData } = await supabase
          .from("customers")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        userProfile.customers = customerData ? [customerData] : [];
      } else if (userProfile.role === "seller") {
        const { data: sellerData } = await supabase
          .from("sellers")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        userProfile.sellers = sellerData ? [sellerData] : [];
      } else if (userProfile.role === "service_provider") {
        const { data: serviceData } = await supabase
          .from("service_providers")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        userProfile.service_providers = serviceData ? [serviceData] : [];
      }
    } catch (roleError) {
      console.warn("Error fetching role-specific data:", roleError);
      // Continue without role-specific data
    }

    console.log("Final user profile:", userProfile);
    return userProfile;
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error);
    return null;
  }
};

// Helper function to check user role
export const checkUserRole = async (requiredRole) => {
  try {
    const userProfile = await getCurrentUserProfile();
    return userProfile?.role === requiredRole;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

// Helper function for geolocation calculations
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error("Supabase error:", error);

  // Return user-friendly error messages
  if (error.code === "PGRST116") {
    return "No data found.";
  } else if (error.code === "23505") {
    return "This data already exists.";
  } else if (error.code === "42501") {
    return "You do not have permission to perform this action.";
  } else if (error.message.includes("JWT")) {
    return "Your session has expired. Please log in again.";
  }

  return error.message || "An unexpected error occurred.";
};

// Helper function to get user location
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};
