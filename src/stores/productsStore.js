import { create } from "zustand";
import { supabase, handleSupabaseError } from "../lib/supabase";

export const useProductsStore = create((set) => ({
  // State
  products: [],
  loadingProducts: false,
  errorProducts: null,
  filters: {
    category: "",
    brand: "",
    priceRange: [0, 10000],
    availability: "all",
    searchTerm: "",
  },
  nearbyStores: [],
  loadingNearbyStores: false,

  // Actions
  fetchProducts: async (sellerId = null) => {
    set({ loadingProducts: true, errorProducts: null });

    try {
      let query = supabase.from("products").select(`
          *,
          cars(*),
          product_images(*),
          product_specifications(*)
        `);

      if (sellerId) {
        query = query.eq("seller_id", sellerId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      set({ products: data || [], loadingProducts: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ errorProducts: errorMessage, loadingProducts: false });
      return { data: null, error: errorMessage };
    }
  },

  createProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select(
          `
          *,
          cars(*),
          product_images(*),
          product_specifications(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        products: [data, ...state.products],
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          cars(*),
          product_images(*),
          product_specifications(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? data : product
        ),
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      // Update local state
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));

      return { error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { error: errorMessage };
    }
  },

  searchProducts: async (filters) => {
    set({ loadingProducts: true, errorProducts: null });

    try {
      let query = supabase.from("products").select(`
          *,
          cars(*),
          product_images(*),
          product_specifications(*)
        `);

      // Apply filters
      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.brand) {
        query = query.eq("brand", filters.brand);
      }

      if (filters.searchTerm) {
        query = query.or(
          `name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters.availability === "in_stock") {
        query = query.gt("stock", 0);
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

      set({ products: data || [], loadingProducts: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ errorProducts: errorMessage, loadingProducts: false });
      return { data: null, error: errorMessage };
    }
  },

  searchNearbyStores: async (productName, userLocation, radiusKm = 10) => {
    set({ loadingNearbyStores: true });

    try {
      // This requires a PostGIS extension for geospatial queries
      const { data, error } = await supabase.rpc("find_nearby_stores", {
        product_name: productName,
        user_lat: userLocation.latitude,
        user_lng: userLocation.longitude,
        radius_km: radiusKm,
      });

      if (error) throw error;

      set({ nearbyStores: data || [], loadingNearbyStores: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ loadingNearbyStores: false });
      return { data: null, error: errorMessage };
    }
  },

  addProductImage: async (productId, imageUrl) => {
    try {
      const { data, error } = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
          image_url: imageUrl,
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

  addProductSpecification: async (productId, specKey, specValue) => {
    try {
      const { data, error } = await supabase
        .from("product_specifications")
        .insert({
          product_id: productId,
          spec_key: specKey,
          spec_value: specValue,
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

  addCarCompatibility: async (productId, make, model, year) => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .insert({
          product_id: productId,
          make,
          model,
          year,
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

  // Filter actions
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        category: "",
        brand: "",
        priceRange: [0, 10000],
        availability: "all",
        searchTerm: "",
      },
    });
  },

  // Clear errors
  clearError: () => {
    set({ errorProducts: null });
  },
}));

// Selectors for filtered products
export const useFilteredProducts = () => {
  const { products, filters } = useProductsStore();

  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.availability === "in_stock" && product.stock <= 0) return false;
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const nameMatch = product.name?.toLowerCase().includes(searchLower);
      const descMatch = product.description
        ?.toLowerCase()
        .includes(searchLower);
      if (!nameMatch && !descMatch) return false;
    }
    if (filters.priceRange) {
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      )
        return false;
    }
    return true;
  });
};
