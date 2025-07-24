import { create } from "zustand";
import { supabase, getCurrentUserProfile } from "../lib/supabase";

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  authLoading: true,
  session: null,

  // Actions
  signUp: async (userData) => {
    try {
      set({ authLoading: true });

      console.log("Attempting signup with data:", userData);

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          },
        },
      });

      console.log("Supabase signup response:", { data, error });

      if (error) {
        console.error("Supabase signup error details:", error);
        throw error;
      }

      // Insert into users table and update local state
      if (data.user) {
        console.log("User created:", data.user.id);

        // Only create profile and set auth state if user is confirmed OR if we have a session
        // If email confirmation is required, data.session will be null
        if (data.session || data.user.email_confirmed_at) {
          console.log(
            "Creating user profile for confirmed user:",
            data.user.id
          );
          await get().createUserProfile(data.user, userData);

          // Get the created user profile
          const userProfile = await getCurrentUserProfile();

          // Update local auth state
          set({
            user: userProfile,
            isAuthenticated: !!userProfile,
            session: data.session,
            authLoading: false,
          });
        } else {
          console.log(
            "Email confirmation required, profile will be created on first login"
          );
          set({ authLoading: false });
        }
      } else {
        set({ authLoading: false });
      }

      return { data, error: null };
    } catch (error) {
      console.error("Full signup error:", error);
      set({ authLoading: false });
      return { data: null, error };
    }
  },

  signIn: async (email, password) => {
    try {
      set({ authLoading: true });

      console.log("Login attempt with email:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error);
        throw error;
      }

      console.log("Login successful, session:", data.session?.user?.id);

      // Skip complex profile fetching during login - let auth subscription handle it
      // Just set basic session info for now
      if (data.session && data.user) {
        const userMetadata = data.user.user_metadata || {};
        const basicUser = {
          id: data.user.id,
          email: data.user.email,
          first_name: userMetadata.first_name || "User",
          last_name: userMetadata.last_name || "",
          role: userMetadata.role || "customer",
        };

        console.log("Setting basic user info from session:", basicUser);

        set({
          user: basicUser,
          isAuthenticated: true,
          session: data.session,
          authLoading: false,
        });

        // Let the auth subscription handle the full profile fetch in the background
        console.log(
          "Login complete - auth subscription will handle profile loading"
        );
      } else {
        set({ authLoading: false });
      }

      return { data, error: null };
    } catch (error) {
      console.error("Full login error:", error);
      set({ authLoading: false });
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (!error) {
        set({
          user: null,
          isAuthenticated: false,
          session: null,
          authLoading: false,
        });
      }

      return { error };
    } catch (error) {
      return { error };
    }
  },

  createUserProfile: async (authUser, userData) => {
    try {
      // For now, just create a basic user profile since we're collecting additional data in profile verification
      const { data: userProfile, error: userError } = await supabase
        .from("users")
        .insert({
          id: authUser.id,
          role: userData.role,
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          // We'll collect phone_number and other details in profile verification
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create basic role-specific records without detailed data
      if (userData.role === "customer") {
        const { error: customerError } = await supabase
          .from("customers")
          .insert({
            user_id: authUser.id,
          });

        if (customerError) throw customerError;
      }
      // Note: We'll create seller and service_provider records during profile verification
      // when we have all the required data

      return userProfile;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  // Helper function to check if user needs profile completion
  needsProfileCompletion: () => {
    const { user } = get();
    console.log("needsProfileCompletion - checking user:", user);
    
    if (!user) {
      console.log("needsProfileCompletion - no user found");
      return false;
    }

    // Admin users never need profile completion
    if (user.role === 'admin') {
      console.log("needsProfileCompletion - admin user, no completion needed");
      return false;
    }

    // Check basic profile completion
    const hasBasicInfo = user.phone_number && user.role;
    console.log("needsProfileCompletion - hasBasicInfo:", hasBasicInfo);

    // For sellers and service providers, also check for ID card
    if (user.role === "seller" || user.role === "service_provider") {
      const needsCompletion = !hasBasicInfo || !user.id_card_image;
      console.log("needsProfileCompletion - seller/service provider needs completion:", needsCompletion);
      return needsCompletion;
    }

    // For customers, only need basic info
    const needsCompletion = !hasBasicInfo;
    console.log("needsProfileCompletion - customer needs completion:", needsCompletion);
    return needsCompletion;
  },

  // Helper function to get user verification level
  getVerificationLevel: () => {
    const { user } = get();
    if (!user) return "none";

    const hasPhone = !!user.phone_number;
    const hasIdCard = !!user.id_card_image;

    if (user.role === "customer") {
      return hasPhone ? "verified" : "none";
    } else if (user.role === "seller" || user.role === "service_provider") {
      if (hasPhone && hasIdCard) return "fully_verified";
      if (hasPhone) return "verified";
      return "none";
    }

    return "none";
  },

  updateProfile: async (updates) => {
    try {
      const { user } = get();
      if (!user) throw new Error("No authenticated user");

      console.log("Updating profile for user:", user.id);
      console.log("Update data:", updates);

      // Separate basic user fields from role-specific fields
      const basicUserFields = {};
      const roleSpecificFields = {};

      // Only include fields that exist in the users table
      if (updates.phone_number)
        basicUserFields.phone_number = updates.phone_number;
      if (updates.profile_image)
        basicUserFields.profile_image = updates.profile_image;
      // Note: id_card_image and business_license will be stored in role-specific tables

      // Handle role-specific updates
      if (user.role === "seller") {
        if (updates.shop_name) roleSpecificFields.shop_name = updates.shop_name;
        if (updates.shop_address)
          roleSpecificFields.shop_address = updates.shop_address;
        if (updates.latitude) roleSpecificFields.latitude = updates.latitude; // Fixed: use latitude not shop_latitude
        if (updates.longitude) roleSpecificFields.longitude = updates.longitude; // Fixed: use longitude not shop_longitude
        if (updates.id_card_number)
          roleSpecificFields.id_card_number = updates.id_card_number; // Added: required field
        if (updates.business_license)
          roleSpecificFields.business_license = updates.business_license;
        if (updates.id_card_url)
          roleSpecificFields.id_card_url = updates.id_card_url;
      } else if (user.role === "service_provider") {
        if (updates.service_name)
          roleSpecificFields.service_name = updates.service_name;
        if (updates.service_address)
          roleSpecificFields.service_address = updates.service_address;
        if (updates.latitude) roleSpecificFields.latitude = updates.latitude; // Fixed: use latitude not service_latitude
        if (updates.longitude) roleSpecificFields.longitude = updates.longitude; // Fixed: use longitude not service_longitude
        if (updates.specializations)
          roleSpecificFields.specializations = updates.specializations;
        if (updates.business_license)
          roleSpecificFields.business_license = updates.business_license;
        if (updates.id_card_url)
          roleSpecificFields.id_card_url = updates.id_card_url;
      } else if (user.role === "customer") {
        // For customers, store id_card in users table (if column exists) or create a separate customer_verifications table
        if (updates.id_card_url)
          basicUserFields.id_card_url = updates.id_card_url;
      }

      // Update basic user information if there are any basic fields
      let userData = null;
      if (Object.keys(basicUserFields).length > 0) {
        console.log("Updating basic user fields:", basicUserFields);
        const { data, error } = await supabase
          .from("users")
          .update(basicUserFields)
          .eq("id", user.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating basic user fields:", error);
          throw error;
        }
        userData = data;
      }

      // Update role-specific information
      if (Object.keys(roleSpecificFields).length > 0) {
        console.log("Updating role-specific fields:", roleSpecificFields);
        if (user.role === "seller") {
          // Create or update seller record
          const { error: sellerError } = await supabase.from("sellers").upsert({
            user_id: user.id,
            ...roleSpecificFields,
          });

          if (sellerError) {
            console.error("Error updating seller fields:", sellerError);
            throw sellerError;
          }
        } else if (user.role === "service_provider") {
          // Create or update service provider record
          const { error: serviceError } = await supabase
            .from("service_providers")
            .upsert({
              user_id: user.id,
              ...roleSpecificFields,
            });

          if (serviceError) {
            console.error(
              "Error updating service provider fields:",
              serviceError
            );
            throw serviceError;
          }
        }
      }

      // Create approval request for sellers and service providers
      if (user.role === "seller" || user.role === "service_provider") {
        console.log("Creating approval request...");
        const { error: approvalError } = await supabase
          .from("approval_requests")
          .insert({
            user_id: user.id,
            role_requested: user.role,
            status: "pending"
          });

        if (approvalError) {
          console.error("Error creating approval request:", approvalError);
          // Don't throw error here, just log it as the profile update was successful
        } else {
          console.log("Approval request created successfully");
        }
      }

      // Update local state with the new user data
      if (userData) {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      }

      return { data: userData, error: null };
    } catch (error) {
      console.error("Profile update error:", error);
      return { data: null, error };
    }
  },

  // Get all pending approval requests (for admin use)
  getApprovalRequests: async (status = 'pending') => {
    try {
      console.log("Fetching approval requests with status:", status);
      
      // First, get the basic approval requests
      const { data: approvalData, error: approvalError } = await supabase
        .from("approval_requests")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (approvalError) {
        console.error("Error fetching approval requests:", approvalError);
        return { data: null, error: approvalError };
      }

      console.log("Raw approval requests:", approvalData);

      // If no data, return empty array
      if (!approvalData || approvalData.length === 0) {
        return { data: [], error: null };
      }

      // For each approval request, manually fetch the user data
      const enrichedData = await Promise.all(
        approvalData.map(async (request) => {
          try {
            // Fetch user data separately
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("id, first_name, last_name, email, phone_number, created_at")
              .eq("id", request.user_id)
              .single();

            if (userError) {
              console.error(`Error fetching user ${request.user_id}:`, userError);
              return request; // Return request without user data if user fetch fails
            }

            // Fetch role-specific data
            let roleData = null;
            if (request.role_requested === 'seller') {
              const { data: sellerData } = await supabase
                .from("sellers")
                .select("shop_name, shop_address, id_card_number, latitude, longitude")
                .eq("user_id", request.user_id)
                .single();
              roleData = { sellers: sellerData };
            } else if (request.role_requested === 'service_provider') {
              const { data: serviceData } = await supabase
                .from("service_providers")
                .select("service_address, specializations, latitude, longitude")
                .eq("user_id", request.user_id)
                .single();
              roleData = { service_providers: serviceData };
            }

            return {
              ...request,
              users: userData,
              ...roleData
            };
          } catch (error) {
            console.error(`Error processing request ${request.id}:`, error);
            return request; // Return basic request data if enrichment fails
          }
        })
      );

      console.log("Enriched approval requests:", enrichedData);
      return { data: enrichedData, error: null };
    } catch (error) {
      console.error("Error in getApprovalRequests:", error);
      return { data: null, error };
    }
  },

  // Approve or reject an approval request (for admin use)
  reviewApprovalRequest: async (requestId, status, notes = "", adminId) => {
    try {
      const { data, error } = await supabase
        .from("approval_requests")
        .update({
          status,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          notes
        })
        .eq("id", requestId)
        .select()
        .single();

      if (error) {
        console.error("Error reviewing approval request:", error);
        return { data: null, error };
      }

      // If approved, update the user's approval status in their role table
      if (status === "approved" && data) {
        const { user_id, role_requested } = data;
        
        if (role_requested === "seller") {
          await supabase
            .from("sellers")
            .update({ 
              is_approved: true,
              approved_at: new Date().toISOString()
            })
            .eq("user_id", user_id);
        } else if (role_requested === "service_provider") {
          await supabase
            .from("service_providers")
            .update({ 
              is_approved: true,
              approved_at: new Date().toISOString()
            })
            .eq("user_id", user_id);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error in reviewApprovalRequest:", error);
      return { data: null, error };
    }
  },

  // Clear approval status for reapplication (for rejected users)
  clearApprovalForReapplication: async () => {
    try {
      const { user } = get();
      if (!user) throw new Error("No authenticated user");

      console.log("Clearing approval status for reapplication...");

      // Delete the existing approval request so user can resubmit
      const { error: deleteError } = await supabase
        .from("approval_requests")
        .delete()
        .eq("user_id", user.id)
        .eq("role_requested", user.role);

      if (deleteError) {
        console.error("Error deleting approval request:", deleteError);
        return { data: null, error: deleteError };
      }

      // Clear approval status from role-specific table
      if (user.role === "seller") {
        await supabase
          .from("sellers")
          .update({ 
            is_approved: false,
            approved_at: null
          })
          .eq("user_id", user.id);
      } else if (user.role === "service_provider") {
        await supabase
          .from("service_providers")
          .update({ 
            is_approved: false,
            approved_at: null
          })
          .eq("user_id", user.id);
      }

      // Update local user state to remove approval status
      set((state) => ({
        user: {
          ...state.user,
          approval_status: null,
          approval_notes: null,
          reviewed_at: null
        }
      }));

      console.log("Approval status cleared successfully");
      return { data: true, error: null };
    } catch (error) {
      console.error("Error clearing approval status:", error);
      return { data: null, error };
    }
  },

  initializeAuth: async () => {
    try {
      console.log("Initializing auth...");
      set({ authLoading: true });

      const startTime = Date.now();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log(`Session fetch took ${Date.now() - startTime}ms`);

      if (session) {
        console.log("Session found, fetching user profile...");

        const profileStartTime = Date.now();
        const userProfile = await getCurrentUserProfile();
        console.log(`Profile fetch took ${Date.now() - profileStartTime}ms`);

        set({
          user: userProfile,
          isAuthenticated: !!userProfile,
          session,
          authLoading: false,
        });
      } else {
        console.log("No session found");
        set({
          user: null,
          isAuthenticated: false,
          session: null,
          authLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({ authLoading: false });
    }
  },

  // Listen to auth changes
  subscribeToAuthChanges: () => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.id);

      // Avoid processing the same event multiple times
      const currentSession = get().session;
      if (
        event === "SIGNED_IN" &&
        session &&
        session.user.id === currentSession?.user?.id
      ) {
        console.log("Ignoring duplicate SIGNED_IN event");
        return;
      }

      if (event === "SIGNED_IN" && session) {
        console.log("Processing SIGNED_IN event for user:", session.user.id);

        try {
          let userProfile = null;

          // Try to get profile with timeout
          const profileTimeout = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Auth profile fetch timeout")),
              8000
            )
          );

          const profilePromise = getCurrentUserProfile();
          userProfile = await Promise.race([profilePromise, profileTimeout]);

          // If profile doesn't exist, create it (this handles email confirmation flow)
          if (!userProfile && session.user) {
            console.log("Creating user profile after auth state change...");
            const userMetadata = session.user.user_metadata || {};
            const userData = {
              firstName: userMetadata.first_name || "User",
              lastName: userMetadata.last_name || "",
              email: session.user.email,
              role: userMetadata.role || "customer",
            };

            try {
              await get().createUserProfile(session.user, userData);
              userProfile = await Promise.race([
                getCurrentUserProfile(),
                profileTimeout,
              ]);
            } catch (createError) {
              console.error(
                "Error creating user profile after auth change:",
                createError
              );

              // Create minimal user profile as fallback
              userProfile = {
                id: session.user.id,
                email: session.user.email,
                first_name: userMetadata.first_name || "User",
                last_name: userMetadata.last_name || "",
                role: userMetadata.role || "customer",
              };
            }
          }

          console.log("Setting auth state with profile:", userProfile);
          set({
            user: userProfile,
            isAuthenticated: !!userProfile,
            session,
            authLoading: false,
          });
        } catch (error) {
          console.error("Error in auth state change handler:", error);

          // Set auth state with minimal user info from session
          const userMetadata = session.user.user_metadata || {};
          const fallbackUser = {
            id: session.user.id,
            email: session.user.email,
            first_name: userMetadata.first_name || "User",
            last_name: userMetadata.last_name || "",
            role: userMetadata.role || "customer",
          };

          set({
            user: fallbackUser,
            isAuthenticated: true,
            session,
            authLoading: false,
          });
        }
      } else if (event === "SIGNED_OUT") {
        console.log("Processing SIGNED_OUT event");
        set({
          user: null,
          isAuthenticated: false,
          session: null,
          authLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  },
}));

// Note: Auth initialization is now handled in App.jsx
