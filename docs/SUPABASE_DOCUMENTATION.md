# GearUp Supabase Integration Documentation

## Overview

This document outlines how to integrate Supabase with the GearUp application, covering all database operations, authentication, and real-time features for the multi-role system (Customer, Seller, Service Provider, Admin).

## Table of Contents

1. [Project Setup](#project-setup)
2. [Authentication System](#authentication-system)
3. [State Management](#state-management)
4. [Database Operations](#database-operations)
5. [Real-time Features](#real-time-features)
6. [API Patterns](#api-patterns)
7. [Security & RLS](#security--rls)

---

## Project Setup

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Environment Configuration

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Client Setup

```javascript
// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## Authentication System

### Auth State Management

```javascript
// src/stores/authStore.js
import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  authLoading: true,
  session: null,

  // Actions
  signUp: async (userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone_number: userData.phoneNumber,
            role: userData.role,
          },
        },
      });

      if (error) throw error;

      // Insert into users table
      await get().createUserProfile(data.user, userData);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      set({ user: null, isAuthenticated: false, session: null });
    }
    return { error };
  },

  createUserProfile: async (authUser, userData) => {
    // Insert into users table
    const { data: userProfile, error: userError } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        role: userData.role,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone_number: userData.phoneNumber,
      })
      .select()
      .single();

    if (userError) throw userError;

    // Insert into role-specific table
    if (userData.role === "seller") {
      await supabase.from("sellers").insert({
        user_id: authUser.id,
        id_card_number: userData.idCardNumber,
        shop_name: userData.shopName,
        shop_address: userData.shopAddress,
        latitude: userData.latitude,
        longitude: userData.longitude,
      });
    } else if (userData.role === "service_provider") {
      await supabase.from("service_providers").insert({
        user_id: authUser.id,
        license_number: userData.licenseNumber,
        specialization: userData.specialization,
      });
    } else if (userData.role === "customer") {
      await supabase.from("customers").insert({
        user_id: authUser.id,
      });
    }

    return userProfile;
  },

  initializeAuth: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data: userProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        set({
          user: userProfile,
          isAuthenticated: true,
          session,
          authLoading: false,
        });
      } else {
        set({ authLoading: false });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({ authLoading: false });
    }
  },
}));
```

---

## State Management

### 1. Products State (Seller & Customer)

```javascript
// src/stores/productsStore.js
import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useProductsStore = create((set, get) => ({
  // State
  products: [],
  loadingProducts: false,
  errorProducts: null,
  filters: {
    category: "",
    brand: "",
    priceRange: [0, 1000],
    availability: "all",
  },

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

      const { data, error } = await query;

      if (error) throw error;

      set({ products: data, loadingProducts: false });
    } catch (error) {
      set({ errorProducts: error.message, loadingProducts: false });
    }
  },

  createProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        products: [...state.products, data],
      }));

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
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
      return { data: null, error };
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
      return { error };
    }
  },

  searchNearbyStores: async (productName, userLocation, radiusKm = 10) => {
    try {
      // This requires a PostGIS extension for geospatial queries
      const { data, error } = await supabase.rpc("find_nearby_stores", {
        product_name: productName,
        user_lat: userLocation.latitude,
        user_lng: userLocation.longitude,
        radius_km: radiusKm,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
}));
```

### 2. Service Providers State

```javascript
// src/stores/servicesStore.js
import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useServicesStore = create((set, get) => ({
  // State
  companies: [],
  services: [],
  selectedCompany: null,
  selectedService: null,
  loadingServices: false,
  errorServices: null,

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

      set({ companies: data, loadingServices: false });
    } catch (error) {
      set({ errorServices: error.message, loadingServices: false });
    }
  },

  fetchServicesByProvider: async (providerId) => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("provider_id", providerId)
        .eq("available", true);

      if (error) throw error;

      set({ services: data });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  bookService: async (bookingData) => {
    try {
      const { data, error } = await supabase
        .from("service_bookings")
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
}));
```

### 3. Orders State

```javascript
// src/stores/ordersStore.js
import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useOrdersStore = create((set, get) => ({
  // State
  orders: [],
  appointments: [],
  loadingOrders: false,
  errorOrders: null,

  // Actions
  createOrder: async (orderData) => {
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: orderData.customerId,
          seller_id: orderData.sellerId,
          total_price: orderData.totalPrice,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return { data: order, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  fetchUserOrders: async (userId, role) => {
    set({ loadingOrders: true, errorOrders: null });

    try {
      let query = supabase.from("orders").select(`
          *,
          order_items(*),
          customer:users!orders_customer_id_fkey(*),
          seller:users!orders_seller_id_fkey(*)
        `);

      if (role === "customer") {
        query = query.eq("customer_id", userId);
      } else if (role === "seller") {
        query = query.eq("seller_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ orders: data, loadingOrders: false });
    } catch (error) {
      set({ errorOrders: error.message, loadingOrders: false });
    }
  },
}));
```

### 4. Admin State

```javascript
// src/stores/adminStore.js
import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useAdminStore = create((set, get) => ({
  // State
  allUsers: [],
  pendingRequests: [],
  analyticsData: {},
  loadingAdmin: false,
  errorAdmin: null,

  // Actions
  fetchAllUsers: async () => {
    try {
      const { data, error } = await supabase.from("users").select(`
          *,
          customers(*),
          sellers(*),
          service_providers(*)
        `);

      if (error) throw error;

      set({ allUsers: data });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
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
        .eq("status", "pending");

      if (error) throw error;

      set({ pendingRequests: data });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  approveRequest: async (requestId, adminId) => {
    try {
      const { data, error } = await supabase
        .from("approval_requests")
        .update({
          status: "approved",
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        pendingRequests: state.pendingRequests.filter(
          (req) => req.id !== requestId
        ),
      }));

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getAnalytics: async () => {
    try {
      // Custom analytics queries
      const [usersCount, ordersCount, servicesCount] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase
          .from("service_bookings")
          .select("*", { count: "exact", head: true }),
      ]);

      const analytics = {
        totalUsers: usersCount.count,
        totalOrders: ordersCount.count,
        totalServiceBookings: servicesCount.count,
      };

      set({ analyticsData: analytics });
      return { data: analytics, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
}));
```

### 5. Chat System State

```javascript
// src/stores/chatStore.js
import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useChatStore = create((set, get) => ({
  // State
  conversations: [],
  currentConversation: null,
  messages: [],
  loadingChat: false,

  // Actions
  fetchConversations: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          *,
          customer:users!conversations_customer_id_fkey(*),
          seller:users!conversations_seller_id_fkey(*)
        `
        )
        .or(`customer_id.eq.${userId},seller_id.eq.${userId}`);

      if (error) throw error;

      set({ conversations: data });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:users(*)
        `
        )
        .eq("conversation_id", conversationId)
        .order("sent_at", { ascending: true });

      if (error) throw error;

      set({ messages: data });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  sendMessage: async (conversationId, senderId, content) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
        })
        .select(
          `
          *,
          sender:users(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        messages: [...state.messages, data],
      }));

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  subscribeToMessages: (conversationId) => {
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          set((state) => ({
            messages: [...state.messages, payload.new],
          }));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
}));
```

---

## Database Operations

### Custom RPC Functions

Create these in your Supabase SQL editor:

```sql
-- Function to find nearby stores with specific products
CREATE OR REPLACE FUNCTION find_nearby_stores(
  product_name TEXT,
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 10
)
RETURNS TABLE (
  store_name TEXT,
  store_address TEXT,
  distance_km DOUBLE PRECISION,
  product_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.shop_name,
    s.shop_address,
    (6371 * acos(
      cos(radians(user_lat)) *
      cos(radians(s.latitude)) *
      cos(radians(s.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) *
      sin(radians(s.latitude))
    )) as distance_km,
    COUNT(p.id)::INTEGER as product_count
  FROM sellers s
  JOIN products p ON p.seller_id = s.user_id
  WHERE
    p.name ILIKE '%' || product_name || '%'
    AND p.stock > 0
    AND (6371 * acos(
      cos(radians(user_lat)) *
      cos(radians(s.latitude)) *
      cos(radians(s.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) *
      sin(radians(s.latitude))
    )) <= radius_km
  GROUP BY s.user_id, s.shop_name, s.shop_address, s.latitude, s.longitude
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
```

---

## Security & Row Level Security (RLS)

### Enable RLS on all tables:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ... enable for all tables

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can read products" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Sellers can manage their products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'seller'
      AND products.seller_id = users.id
    )
  );

-- Orders policies
CREATE POLICY "Users can read their orders" ON orders
  FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = seller_id
  );

-- Admin policies
CREATE POLICY "Admins can read all data" ON users
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

---

## Usage Examples

### 1. Authentication Flow

```javascript
// Login component
import { useAuthStore } from "../stores/authStore";

const LoginForm = () => {
  const { signIn, authLoading } = useAuthStore();

  const handleSubmit = async (values) => {
    const { data, error } = await signIn(values.email, values.password);
    if (error) {
      console.error("Login failed:", error);
    } else {
      // Redirect to dashboard
    }
  };

  // ... rest of component
};
```

### 2. Product Management

```javascript
// Seller dashboard
import { useProductsStore } from "../stores/productsStore";

const SellerDashboard = () => {
  const { products, fetchProducts, createProduct } = useProductsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchProducts(user.id); // Fetch seller's products
    }
  }, [user]);

  // ... rest of component
};
```

### 3. Real-time Chat

```javascript
// Chat component
import { useChatStore } from "../stores/chatStore";

const ChatWindow = ({ conversationId }) => {
  const { messages, sendMessage, subscribeToMessages } = useChatStore();

  useEffect(() => {
    const unsubscribe = subscribeToMessages(conversationId);
    return unsubscribe;
  }, [conversationId]);

  // ... rest of component
};
```

This documentation provides a complete framework for integrating Supabase with your GearUp application. Each state store handles its specific domain, and the patterns can be extended as your application grows.
