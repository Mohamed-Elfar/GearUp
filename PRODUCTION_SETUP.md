# GearUp Production Setup Guide

## 📋 Overview

Complete profile verification system with admin approval workflow, geolocation integration, and clean production-ready codebase.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

App will run on `http://localhost:5177`

### 3. Database Setup

Run the SQL files in your Supabase SQL Editor:

1. First run: `database_schema.sql` (creates all tables)
2. Then run: `create_admin_user.sql` (follow instructions to create admin)

## 🔧 Configuration

### Environment Variables

Ensure your `.env.local` file contains:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Admin User Setup

1. Go to Supabase Dashboard > Authentication > Users
2. Create user with email: `admin@gearup.com`, password: `Admin123!`
3. Copy the User ID from the created auth user
4. Update `create_admin_user.sql` with the actual UUID
5. Run the SQL script in Supabase SQL Editor

## 🏗️ Application Structure

### Core Routes

- `/` - Homepage with login/register
- `/home` - User dashboard after login
- `/profile` - Profile management and admin dashboard
- `/admin` - Admin approval management interface
- `/map` - Interactive map (placeholder for future features)

### User Flow

1. **Registration**: Users register as Customer, Seller, or Service Provider
2. **Profile Completion**: Sellers/Service Providers complete detailed verification forms
3. **Admin Review**: Admins review and approve/reject verification requests
4. **Profile Updates**: Approved users can update their profiles

## 📁 Key Components

### Profile Verification (`src/pages/ProfileVerification.jsx`)

- Role-based forms for Sellers and Service Providers
- Geolocation integration with address lookup
- File upload for business documents
- Form validation and error handling

### Admin Dashboard (`src/pages/AdminDashboard.jsx`)

- View all pending approval requests
- Filter by status (pending, approved, rejected)
- Approve or reject requests with one click
- View user details and business information

### Authentication Store (`src/stores/authStore.js`)

- Complete authentication state management
- Profile update functions
- Approval request management
- Error handling and user feedback

## 🗄️ Database Schema

### Tables

- `users` - Core user information and roles
- `sellers` - Seller-specific business information
- `service_providers` - Service provider business details
- `approval_requests` - Verification requests and status

### Key Features

- Role-based access control
- Geolocation data storage
- File upload support
- Audit trail for approvals

## 🌍 Geolocation Features

### Enhanced Address Lookup

- OpenStreetMap Nominatim API integration
- Detailed address components (street, city, state, country)
- Coordinate-based location detection
- Mobile device support

### Security

- HTTPS requirement for geolocation
- User permission handling
- Fallback for location failures

## 👥 User Roles

### Customer

- Basic profile information
- No verification required
- Access to browse features

### Seller

- Business information required
- Business license verification
- Admin approval needed
- Can list products (future feature)

### Service Provider

- Service area and specializations
- Business credentials verification
- Admin approval needed
- Can offer services (future feature)

### Admin

- Access to approval dashboard
- Review and manage all verification requests
- User management capabilities

## 🔒 Security Features

- Supabase Row Level Security (RLS)
- Role-based access control
- Input validation and sanitization
- Secure file upload handling

## 📱 UI/UX Features

- Responsive Bootstrap design
- Loading states and error handling
- Form validation with user feedback
- Clean, professional interface

## 🚀 Production Deployment

### Code Quality

- All test files and debug code removed
- Clean routing structure
- Production-ready error handling
- Optimized component structure

### Performance

- Lazy loading for routes
- Efficient state management
- Minimal re-renders
- Optimized asset loading

## 🧪 Testing User Flow

### Test as Regular User:

1. Register as Seller or Service Provider
2. Complete profile verification form
3. Submit for approval
4. Check profile status

### Test as Admin:

1. Login with admin credentials
2. Go to `/profile` and click "Approval Requests"
3. Review pending requests
4. Approve or reject requests
5. Verify status updates

## 📞 Support

For issues or questions:

1. Check the console for error messages
2. Verify Supabase connection and permissions
3. Ensure all environment variables are set
4. Check database table creation and admin user setup

---

**Status**: ✅ Production Ready
**Last Updated**: December 2024
**Version**: 1.0.0
