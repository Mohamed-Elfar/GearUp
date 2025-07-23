# GearUp Supabase Quick Reference

## 🚀 Quick Start Checklist

### 1. Initial Setup

- [ ] Install `@supabase/supabase-js`
- [ ] Create `.env.local` with Supabase credentials
- [ ] Set up Supabase client in `src/lib/supabase.js`
- [ ] Enable RLS on all tables
- [ ] Create security policies

### 2. State Stores Setup

- [ ] Auth Store (`src/stores/authStore.js`)
- [ ] Products Store (`src/stores/productsStore.js`)
- [ ] Services Store (`src/stores/servicesStore.js`)
- [ ] Orders Store (`src/stores/ordersStore.js`)
- [ ] Admin Store (`src/stores/adminStore.js`)
- [ ] Chat Store (`src/stores/chatStore.js`)

---

## 🔐 Authentication Quick Commands

```javascript
// Sign Up
const { signUp } = useAuthStore();
await signUp({
  email: "user@example.com",
  password: "password",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+1234567890",
  role: "customer", // or "seller", "service_provider", "admin"
});

// Sign In
const { signIn } = useAuthStore();
await signIn("user@example.com", "password");

// Sign Out
const { signOut } = useAuthStore();
await signOut();

// Get Current User
const { user, isAuthenticated } = useAuthStore();
```

---

## 🛍️ Products Operations

```javascript
// Fetch all products
const { fetchProducts } = useProductsStore();
await fetchProducts();

// Fetch seller's products
await fetchProducts(sellerId);

// Create product
const { createProduct } = useProductsStore();
await createProduct({
  name: "Car Part",
  category: "Engine",
  price: 299.99,
  stock: 10,
  seller_id: userId,
});

// Find nearby stores
const { searchNearbyStores } = useProductsStore();
await searchNearbyStores("brake pads", userLocation, 15);
```

---

## 🔧 Services Operations

```javascript
// Fetch service providers
const { fetchServiceProviders } = useServicesStore();
await fetchServiceProviders();

// Fetch services by provider
const { fetchServicesByProvider } = useServicesStore();
await fetchServicesByProvider(providerId);

// Book a service
const { bookService } = useServicesStore();
await bookService({
  customer_id: userId,
  service_id: serviceId,
  scheduled_at: "2025-07-25T10:00:00Z",
});
```

---

## 📦 Orders Operations

```javascript
// Create order
const { createOrder } = useOrdersStore();
await createOrder({
  customerId: userId,
  sellerId: sellerUserId,
  totalPrice: 599.99,
  items: [{ productId: 1, quantity: 2, price: 299.99 }],
});

// Fetch user orders
const { fetchUserOrders } = useOrdersStore();
await fetchUserOrders(userId, userRole);
```

---

## 👨‍💼 Admin Operations

```javascript
// Fetch all users
const { fetchAllUsers } = useAdminStore();
await fetchAllUsers();

// Fetch pending requests
const { fetchPendingRequests } = useAdminStore();
await fetchPendingRequests();

// Approve seller/service provider
const { approveRequest } = useAdminStore();
await approveRequest(requestId, adminUserId);

// Get analytics
const { getAnalytics } = useAdminStore();
await getAnalytics();
```

---

## 💬 Chat Operations

```javascript
// Fetch conversations
const { fetchConversations } = useChatStore();
await fetchConversations(userId);

// Fetch messages
const { fetchMessages } = useChatStore();
await fetchMessages(conversationId);

// Send message
const { sendMessage } = useChatStore();
await sendMessage(conversationId, senderId, "Hello!");

// Subscribe to real-time messages
const { subscribeToMessages } = useChatStore();
const unsubscribe = subscribeToMessages(conversationId);
// Call unsubscribe() when component unmounts
```

---

## 🗺️ Geolocation Functions

```javascript
// Get user location
navigator.geolocation.getCurrentPosition((position) => {
  const userLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  // Use for nearby stores search
  searchNearbyStores("product name", userLocation, 10);
});

// Store seller location during registration
const sellerData = {
  // ... other fields
  latitude: 40.7128,
  longitude: -74.006,
};
```

---

## 🔒 Security Patterns

```javascript
// Check user role
const checkRole = (requiredRole) => {
  const { user } = useAuthStore();
  return user?.role === requiredRole;
};

// Protect admin routes
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

// Check permissions
const canEditProduct = (product) => {
  const { user } = useAuthStore();
  return user?.id === product.seller_id || user?.role === "admin";
};
```

---

## 📊 Real-time Subscriptions

```javascript
// Subscribe to order updates
useEffect(() => {
  const channel = supabase
    .channel("orders")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      (payload) => {
        console.log("Order updated:", payload);
        // Update local state
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);

// Subscribe to new products
useEffect(() => {
  const channel = supabase
    .channel("products")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "products" },
      (payload) => {
        console.log("New product:", payload.new);
        // Update products list
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

---

## 🚨 Error Handling

```javascript
// Standard error handling pattern
const handleOperation = async () => {
  try {
    const { data, error } = await someSupabaseOperation();

    if (error) {
      console.error("Operation failed:", error);
      // Show user-friendly error message
      toast.error("Something went wrong. Please try again.");
      return;
    }

    // Success
    console.log("Success:", data);
    toast.success("Operation completed successfully!");
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("An unexpected error occurred.");
  }
};
```

---

## 📱 Mobile Considerations

```javascript
// Check if mobile device
const isMobile = window.innerWidth <= 768;

// Adjust pagination for mobile
const pageSize = isMobile ? 5 : 10;

// Mobile-optimized queries
const fetchProductsMobile = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, stock") // Limited fields for mobile
    .limit(10)
    .order("created_at", { ascending: false });
};
```

---

## 🔧 Development Tips

1. **Use TypeScript**: Add type definitions for better development experience
2. **Error Boundaries**: Wrap components with error boundaries for better UX
3. **Loading States**: Always show loading indicators during async operations
4. **Optimistic Updates**: Update UI immediately, rollback on error
5. **Caching**: Use React Query or SWR for better caching strategies
6. **Testing**: Mock Supabase client for unit tests

## 📚 Next Steps

1. Implement the auth store and test authentication flow
2. Set up product management for sellers
3. Create customer product browsing interface
4. Implement service provider system
5. Build admin dashboard
6. Add real-time chat functionality
7. Implement geolocation features
8. Add comprehensive error handling
9. Set up proper logging and monitoring
10. Deploy to production with proper security policies
