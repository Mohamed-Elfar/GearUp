# GearUp Project Structure

## 📁 Complete Directory Structure

```
d:\projects\ITI\GearUp\
├── 📄 package.json                     # Dependencies and scripts
├── 📄 vite.config.js                   # Vite configuration
├── 📄 eslint.config.js                 # ESLint configuration
├── 📄 index.html                       # Main HTML template
├── 📄 README.md                        # Project documentation
├── 📄 .env.example                     # Environment variables template
├── 📄 .env.local                       # Local environment variables (create this)
│
├── 📁 public/                          # Static assets
│   └── 📄 vite.svg                     # Vite logo
│
├── 📁 docs/                           # Documentation
│   ├── 📄 SUPABASE_DOCUMENTATION.md   # Complete Supabase guide
│   └── 📄 SUPABASE_QUICK_REFERENCE.md # Quick reference guide
│
└── 📁 src/                            # Source code
    ├── 📄 main.jsx                     # App entry point
    ├── 📄 App.jsx                      # Main App component
    ├── 📄 App.css                      # App styles
    ├── 📄 index.css                    # Global styles
    │
    ├── 📁 lib/                         # Core utilities
    │   └── 📄 supabase.js              # Supabase client & helpers
    │
    ├── 📁 stores/                      # Zustand state management
    │   ├── 📄 index.js                 # Store exports & initialization
    │   ├── 📄 authStore.js             # Authentication state
    │   ├── 📄 productsStore.js         # Products & inventory state
    │   ├── 📄 servicesStore.js         # Services & bookings state
    │   ├── 📄 ordersStore.js           # Orders & cart state
    │   ├── 📄 adminStore.js            # Admin dashboard state
    │   ├── 📄 chatStore.js             # Chat & messaging state
    │   └── 📄 settingsStore.js         # App settings & preferences
    │
    ├── 📁 hooks/                       # Custom React hooks
    │   └── 📄 useAuth.js               # Authentication & utility hooks
    │
    ├── 📁 components/                  # Reusable components
    │   ├── 📁 auth/                    # Authentication components
    │   ├── 📁 products/                # Product-related components
    │   ├── 📁 services/                # Service-related components
    │   ├── 📁 admin/                   # Admin panel components
    │   ├── 📁 chat/                    # Chat & messaging components
    │   └── 📁 shared/                  # Shared/common components
    │
    ├── 📁 pages/                       # Page components
    │   ├── 📄 HomePage.jsx             # Landing page
    │   ├── 📄 LoginPage.jsx            # Login page
    │   ├── 📄 RegisterPage.jsx         # Registration page
    │   ├── 📄 DashboardPage.jsx        # User dashboard
    │   ├── 📄 ProductsPage.jsx         # Products catalog
    │   ├── 📄 ServicesPage.jsx         # Services directory
    │   ├── 📄 CartPage.jsx             # Shopping cart
    │   ├── 📄 OrdersPage.jsx           # Order history
    │   ├── 📄 ChatPage.jsx             # Chat interface
    │   ├── 📄 ProfilePage.jsx          # User profile
    │   ├── 📄 AdminPage.jsx            # Admin dashboard
    │   └── 📄 NotFoundPage.jsx         # 404 error page
    │
    ├── 📁 utils/                       # Utility functions
    │   ├── 📄 constants.js             # App constants
    │   ├── 📄 helpers.js               # Helper functions
    │   ├── 📄 validation.js            # Form validation schemas
    │   └── 📄 formatters.js            # Data formatting utilities
    │
    └── 📁 assets/                      # Static assets
        └── 📄 react.svg                # React logo
```

## 🏗️ Architecture Overview

### State Management (Zustand)

- **authStore.js**: User authentication, roles, session management
- **productsStore.js**: Product CRUD, search, nearby stores, inventory
- **servicesStore.js**: Service providers, bookings, appointments
- **ordersStore.js**: Order management, cart functionality, payments
- **adminStore.js**: Admin dashboard, user management, analytics
- **chatStore.js**: Real-time messaging, conversations
- **settingsStore.js**: App preferences, theme, language, location

### Database Integration (Supabase)

- **supabase.js**: Client configuration, helper functions, error handling
- **RLS Policies**: Row-level security for data protection
- **Real-time**: Live updates for chat and notifications
- **Geolocation**: PostGIS for nearby store calculations

### Custom Hooks

- **useAuth**: Authentication state and role checking
- **useLocation**: GPS location handling
- **useRoleCheck**: Role-based access control
- **useAppSettings**: Theme, language, preferences
- **useErrorHandler**: Centralized error management
- **useRealTimeSubscriptions**: WebSocket connections

## 🎯 Key Features

### Multi-Role System

1. **Customer**: Browse products, book services, place orders, chat
2. **Seller**: Manage inventory, process orders, chat with customers
3. **Service Provider**: Offer services, manage bookings, handle appointments
4. **Admin**: User management, analytics, content moderation

### Core Functionality

- **Authentication**: Sign up, login, role-based access
- **Products**: CRUD operations, search, filters, nearby stores
- **Services**: Provider directory, booking system, appointments
- **Orders**: Shopping cart, checkout, order tracking
- **Chat**: Real-time messaging between users
- **Geolocation**: Find nearest stores with products
- **Admin Panel**: User management, analytics, reports

### Technical Features

- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live chat and notifications
- **Offline Support**: Local state management
- **Error Handling**: Comprehensive error management
- **Type Safety**: JSDoc comments for better development
- **Performance**: Optimized queries and caching

## 🚀 Getting Started

### 1. Environment Setup

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Initialize Stores

```javascript
// In your main.jsx
import { initializeStores } from "./stores";

// Initialize stores before rendering
initializeStores().then(() => {
  // Render your app
});
```

### 4. Database Setup

- Create Supabase project
- Run SQL commands from documentation
- Enable RLS policies
- Configure authentication

## 📝 Usage Examples

### Authentication

```javascript
import { useAuth } from "./hooks/useAuth";

const MyComponent = () => {
  const { user, isAuthenticated, isSeller } = useAuth();

  if (!isAuthenticated) return <LoginPrompt />;
  if (isSeller) return <SellerDashboard />;
  return <CustomerDashboard />;
};
```

### Product Management

```javascript
import { useProductsStore } from "./stores/productsStore";

const ProductList = () => {
  const { products, fetchProducts, createProduct } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Real-time Chat

```javascript
import { useChatStore } from "./stores/chatStore";

const ChatWindow = ({ conversationId }) => {
  const { messages, sendMessage, subscribeToMessages } = useChatStore();

  useEffect(() => {
    const unsubscribe = subscribeToMessages(conversationId);
    return unsubscribe;
  }, [conversationId]);

  return <ChatInterface messages={messages} onSend={sendMessage} />;
};
```

## 🔧 Development Guidelines

### Code Organization

- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper error boundaries
- Follow naming conventions
- Write comprehensive JSDoc comments

### State Management

- Use Zustand for global state
- Keep local state in components when appropriate
- Implement optimistic updates
- Handle loading and error states
- Use selectors for derived state

### API Integration

- Always handle errors gracefully
- Implement proper loading states
- Use consistent error messaging
- Implement retry logic where appropriate
- Cache data when possible

### Performance

- Implement lazy loading for routes
- Use React.memo for expensive components
- Optimize bundle size with code splitting
- Implement proper caching strategies
- Monitor performance metrics

## 🛡️ Security Considerations

### Authentication

- Implement proper session management
- Use secure authentication flows
- Handle token refresh automatically
- Implement role-based access control

### Data Protection

- Enable RLS policies on all tables
- Validate all user inputs
- Sanitize data before storage
- Implement audit logging
- Use HTTPS in production

### Privacy

- Implement data deletion capabilities
- Handle user consent properly
- Minimize data collection
- Implement privacy settings
- Follow GDPR guidelines

## 📱 Mobile Considerations

### Responsive Design

- Mobile-first approach
- Touch-friendly interfaces
- Optimized for small screens
- Fast loading times
- Offline capabilities

### Performance

- Optimize images and assets
- Minimize JavaScript bundle size
- Implement progressive loading
- Use service workers for caching
- Monitor mobile performance

This structure provides a solid foundation for your GearUp application with proper separation of concerns, scalability, and maintainability.
