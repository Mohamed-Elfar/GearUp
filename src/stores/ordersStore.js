import { create } from "zustand";
import { supabase, handleSupabaseError } from "../lib/supabase";

export const useOrdersStore = create((set) => ({
  // State
  orders: [],
  orderItems: [],
  loadingOrders: false,
  errorOrders: null,
  cart: [],
  cartTotal: 0,

  // Actions
  createOrder: async (orderData) => {
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: orderData.customerId,
          seller_id: orderData.sellerId,
          total_price: orderData.totalPrice,
          status: "pending",
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

      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)
        .select();

      if (itemsError) throw itemsError;

      // Update local state
      set((state) => ({
        orders: [order, ...state.orders],
        cart: [], // Clear cart after successful order
      }));

      return { data: { order, items }, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
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

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      set({ orders: data || [], loadingOrders: false });
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      set({ errorOrders: errorMessage, loadingOrders: false });
      return { data: null, error: errorMessage };
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select(
          `
          *,
          order_items(*),
          customer:users!orders_customer_id_fkey(*),
          seller:users!orders_seller_id_fkey(*)
        `
        )
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? data : order
        ),
      }));

      return { data, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  cancelOrder: async (orderId) => {
    return useOrdersStore.getState().updateOrderStatus(orderId, "cancelled");
  },

  shipOrder: async (orderId) => {
    return useOrdersStore.getState().updateOrderStatus(orderId, "shipped");
  },

  deliverOrder: async (orderId) => {
    return useOrdersStore.getState().updateOrderStatus(orderId, "delivered");
  },

  // Cart Management
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);

      let updatedCart;
      if (existingItem) {
        updatedCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...product, quantity }];
      }

      const cartTotal = updatedCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      return { cart: updatedCart, cartTotal };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== productId);
      const cartTotal = updatedCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      return { cart: updatedCart, cartTotal };
    });
  },

  updateCartItemQuantity: (productId, quantity) => {
    set((state) => {
      const updatedCart = state.cart
        .map((item) => (item.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);

      const cartTotal = updatedCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      return { cart: updatedCart, cartTotal };
    });
  },

  clearCart: () => {
    set({ cart: [], cartTotal: 0 });
  },

  // Statistics for seller dashboard
  getOrderStats: async (sellerId) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("status, total_price, created_at")
        .eq("seller_id", sellerId);

      if (error) throw error;

      const stats = {
        totalOrders: data.length,
        totalRevenue: data.reduce((sum, order) => sum + order.total_price, 0),
        pendingOrders: data.filter((order) => order.status === "pending")
          .length,
        shippedOrders: data.filter((order) => order.status === "shipped")
          .length,
        deliveredOrders: data.filter((order) => order.status === "delivered")
          .length,
        cancelledOrders: data.filter((order) => order.status === "cancelled")
          .length,
      };

      return { data: stats, error: null };
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      return { data: null, error: errorMessage };
    }
  },

  // Clear errors
  clearError: () => {
    set({ errorOrders: null });
  },
}));

// Selectors
export const useCartItems = () => {
  const { cart } = useOrdersStore();
  return cart;
};

export const useCartTotal = () => {
  const { cartTotal } = useOrdersStore();
  return cartTotal;
};

export const useOrdersByStatus = (status) => {
  const { orders } = useOrdersStore();
  return orders.filter((order) => order.status === status);
};
