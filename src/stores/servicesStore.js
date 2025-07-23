import { create } from "zustand";
import { supabase, handleSupabaseError } from "../lib/supabase";

export const useServicesStore = create((set) => ({
  // State
  companies: [],
  services: [],
  selectedCompany: null,
  selectedService: null,
  loadingServices: false,
  errorServices: null,
  myBookings: [],
  loadingBookings: false,

  // Actions
  fetchServiceProviders: async () => {
    set({ loadingServices: true, errorServices: null });

    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          `
          *,
          service_providers(*),
          services(*)
        `
        )
        .eq("role", "service_provider");

      if (error) throw error;

      set({ companies: data || [], loadingServices: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ errorServices: errorMessage, loadingServices: false });
      return { data: null, error: errorMessage };
    }
  },

  fetchServicesByProvider: async (providerId) => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("provider_id", providerId)
        .eq("available", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ services: data || [] });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  createService: async (serviceData) => {
    try {
      const { data, error } = await supabase
        .from("services")
        .insert(serviceData)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        services: [data, ...state.services],
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  updateService: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? data : service
        ),
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  deleteService: async (id) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;

      // Update local state
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
      }));

      return { error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { error: errorMessage };
    }
  },

  bookService: async (bookingData) => {
    try {
      const { data, error } = await supabase
        .from("service_bookings")
        .insert(bookingData)
        .select(
          `
          *,
          service:services(*),
          customer:users!service_bookings_customer_id_fkey(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local bookings
      set((state) => ({
        myBookings: [data, ...state.myBookings],
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  fetchMyBookings: async (userId, userRole) => {
    set({ loadingBookings: true });

    try {
      let query = supabase.from("service_bookings").select(`
          *,
          service:services(*),
          customer:users!service_bookings_customer_id_fkey(*)
        `);

      if (userRole === "customer") {
        query = query.eq("customer_id", userId);
      } else if (userRole === "service_provider") {
        query = query.eq("service.provider_id", userId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      set({ myBookings: data || [], loadingBookings: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ loadingBookings: false });
      return { data: null, error: errorMessage };
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const { data, error } = await supabase
        .from("service_bookings")
        .update({ status })
        .eq("id", bookingId)
        .select(
          `
          *,
          service:services(*),
          customer:users!service_bookings_customer_id_fkey(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        myBookings: state.myBookings.map((booking) =>
          booking.id === bookingId ? data : booking
        ),
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  cancelBooking: async (bookingId) => {
    return useServicesStore
      .getState()
      .updateBookingStatus(bookingId, "cancelled");
  },

  confirmBooking: async (bookingId) => {
    return useServicesStore
      .getState()
      .updateBookingStatus(bookingId, "confirmed");
  },

  completeBooking: async (bookingId) => {
    return useServicesStore
      .getState()
      .updateBookingStatus(bookingId, "completed");
  },

  searchServices: async (filters) => {
    set({ loadingServices: true, errorServices: null });

    try {
      let query = supabase
        .from("services")
        .select(
          `
          *,
          provider:users!services_provider_id_fkey(*)
        `
        )
        .eq("available", true);

      if (filters.specialization) {
        query = query.eq(
          "provider.service_providers.specialization",
          filters.specialization
        );
      }

      if (filters.searchTerm) {
        query = query.or(
          `name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters.priceRange) {
        query = query
          .gte("price", filters.priceRange[0])
          .lte("price", filters.priceRange[1]);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      set({ services: data || [], loadingServices: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ errorServices: errorMessage, loadingServices: false });
      return { data: null, error: errorMessage };
    }
  },

  // Selection actions
  setSelectedCompany: (company) => {
    set({ selectedCompany: company });
  },

  setSelectedService: (service) => {
    set({ selectedService: service });
  },

  // Clear actions
  clearServices: () => {
    set({ services: [] });
  },

  clearError: () => {
    set({ errorServices: null });
  },
}));

// Selector for available services
export const useAvailableServices = () => {
  const { services } = useServicesStore();
  return services.filter((service) => service.available);
};

// Selector for bookings by status
export const useBookingsByStatus = (status) => {
  const { myBookings } = useServicesStore();
  return myBookings.filter((booking) => booking.status === status);
};
