# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Korean e-commerce shopping application built with React 19, Vite, Tailwind CSS v4, and Supabase. The app features user authentication, multilingual support (Korean/English), product catalog, shopping cart with database sync, and Tosspayments payment integration for Korean food and health products.

## Development Commands

```bash
# Start development server with hot module replacement
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint

# Upload environment variables to Vercel (helper script)
./upload-env-to-vercel.sh production
```

## Tech Stack

### Frontend
- **React 19.2.0**: UI framework with latest features
- **Vite 7.2.4**: Build tool and dev server
- **React Router DOM 7.9.6**: Client-side routing with data router API
- **Tailwind CSS 4.1.17**: Utility-first CSS with @tailwindcss/postcss plugin
- **Framer Motion 12.23.24**: Animation library
- **Lucide React**: Icon library

### Backend & Services
- **Supabase**: Backend-as-a-service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
- **Tosspayments SDK**: Payment processing

## Architecture

### State Management

#### AuthContext (`src/context/AuthContext.jsx`)
- User authentication state
- Provides: `user`, `signUp`, `signIn`, `signOut`, `loading`
- Session persistence via Supabase Auth
- Protected routes integration

#### CartContext (`src/context/CartContext.jsx`)
- Global cart state with hybrid storage strategy:
  - **Logged-in users**: Supabase database sync
  - **Guest users**: localStorage fallback
- Automatic sync between devices for authenticated users
- Provides: `cartItems`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCartTotal`, `getCartCount`, `showSuccessModal`, `closeSuccessModal`
- All components access cart via `useCart()` hook

#### LanguageContext (`src/context/LanguageContext.jsx`)
- Multilingual support (Korean/English)
- Provides: `language`, `toggleLanguage`
- Persists preference to localStorage
- Used by all pages and components

### Routing Structure

Routes defined in `src/App.jsx` using `createBrowserRouter`:
- `/` - Home page with product grid
- `/product/:id` - Individual product detail page
- `/cart` - Shopping cart view
- `/login` - User login
- `/signup` - User registration
- `/checkout` - Checkout form (Protected Route - requires authentication)
- `/payment-success` - Payment success page
- `/payment-fail` - Payment failure page
- `/order-success` - Order confirmation

Layout component wraps all routes with Header/Footer and includes ScrollRestoration.

### Data Layer

#### Hybrid Data Strategy
- **Primary**: Supabase `products` table (fetched via `useProducts` hook)
- **Fallback**: Local data in `src/data/products.js`
- Automatic fallback when Supabase is unavailable or not configured

#### Product Data Structure
Each product has:
- `id`: Unique identifier
- `name`: Multilingual object `{ ko, en }`
- `price`: In Korean Won (KRW)
- `category`: Multilingual object `{ ko, en }`
- `image`: Path to image in `public/products/` or external URL
- `description`: Multilingual object `{ ko, en }`
- `isNew`: Boolean flag for new products

#### Custom Hooks
- **useProducts** (`src/hooks/useProducts.js`): Fetches products from Supabase with local fallback

### Component Organization

#### Layout Components
- `Layout.jsx` - App shell wrapper
- `Header.jsx` - Navigation with auth status, language toggle, cart count
- `Footer.jsx` - Site footer with links and copyright

#### UI Components
- `Button.jsx` - Reusable button with variants
- `ProductCard.jsx` - Product display card
- `CartSuccessModal.jsx` - Success notification when adding to cart
- `ProtectedRoute.jsx` - Route wrapper for authentication-required pages

#### Error Handling
- `ErrorBoundary.jsx` - Catches React errors at root level

#### Pages
- `Home.jsx` - Product grid with hero section
- `ProductDetail.jsx` - Single product view
- `Cart.jsx` - Shopping cart management
- `Login.jsx` - User authentication
- `Signup.jsx` - User registration
- `Checkout.jsx` - Order form with Tosspayments widget (Protected)
- `PaymentSuccess.jsx` - Payment confirmation
- `PaymentFail.jsx` - Payment error handling
- `OrderSuccess.jsx` - Order placed confirmation

### Internationalization (i18n)

Translation files in `src/translations/`:
- `ko.js` - Korean translations
- `en.js` - English translations
- `index.js` - `useTranslation` hook

Usage:
```javascript
const { language } = useLanguage();
const t = useTranslation(language);
// Access: t.header.shop, t.home.heroTitle, etc.
```

### Styling
- Tailwind CSS v4 with PostCSS plugin (not traditional config file approach)
- Custom utility function `cn()` in `src/utils/cn.js` uses `clsx` + `tailwind-merge` for className composition
- All styling is utility-first with no separate CSS modules
- Responsive design with mobile-first approach

### Image Handling
- **Product images**: Stored in `public/products/` folder
  - Files served as static assets by Vite
  - No hashing/bundling - direct path references (e.g., `/products/kimchi.png`)
  - Same paths used in both Supabase database and local fallback data
- **Hero/background images**: External URLs (Unsplash) with optimization params

### Database Schema

#### Supabase Tables

**products**
- Stores product catalog
- Public read access via RLS
- Multilingual fields (name_ko, name_en, category_ko, category_en, description_ko, description_en)

**cart_items**
- User-specific cart items with RLS policies
- Synced for logged-in users
- Foreign key to `auth.users`

**orders**
- Order records with payment information
- User-specific with RLS policies
- Stores Tosspayments payment_key and order status

**order_items**
- Line items for each order
- Linked to orders table

### Environment Variables

Required in `.env`:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Tosspayments Configuration
VITE_TOSS_CLIENT_KEY=test_gck_...
VITE_TOSS_SECRET_KEY=test_gsk_...
```

Note: All variables prefixed with `VITE_` are exposed to the client.

### Helper Scripts

**upload-env-to-vercel.sh**
- Bash script to upload `.env` file variables to Vercel
- Usage: `./upload-env-to-vercel.sh [production|preview|development]`
- Automatically handles all environment variables from `.env` file

## Key Patterns

### Authentication Flow
1. User signs up/logs in via Supabase Auth
2. Session stored in Supabase client
3. Protected routes check `user` from AuthContext
4. Redirect to `/login` if unauthenticated

### Cart Synchronization
1. Guest users: Cart stored in localStorage
2. Logged-in users:
   - Cart loaded from Supabase on mount
   - All mutations synced to database via `upsert`
   - Local state updated immediately for UI responsiveness
   - Fallback to localStorage on DB errors

### Product Data Fetching
1. `useProducts` hook checks for Supabase configuration
2. If configured: Fetch from `products` table
3. If not configured or error: Use local `products.js` data
4. Transforms database format to match application structure

### Payment Flow
1. User completes checkout form
2. Tosspayments widget loads with client key
3. Payment processed through Tosspayments
4. On success: Redirect to `/payment-success` with `paymentKey`, `orderId`, `amount`
5. Server confirms payment and updates order status
6. Display confirmation to user

### Price Display
All prices are in Korean Won (KRW). Format using `.toLocaleString('ko-KR')` for proper thousands separators.

### ESLint Configuration
Using flat config format with React Hooks and React Refresh plugins. Custom rule: unused vars starting with uppercase or underscore are ignored.

## Common Tasks

### Adding New Products
1. **Via Supabase** (recommended for production):
   - Insert into `products` table via Supabase dashboard or SQL
   - Ensure all multilingual fields are populated
   - Upload product image to `public/products/` and reference path in `image` column

2. **Via Local Data** (development/fallback):
   - Add to `products` array in `src/data/products.js`
   - Place image in `public/products/`
   - Reference as `/products/filename.png`

### Adding New Routes
Add to router configuration in `src/App.jsx` under the Layout element's children.

For protected routes, wrap with `<ProtectedRoute>` component.

### Extending Cart Functionality
Extend the CartContext provider in `src/context/CartContext.jsx`. Remember to handle both Supabase sync (for logged-in users) and localStorage (for guests).

### Adding Translations
1. Add key-value pairs to `src/translations/ko.js` and `src/translations/en.js`
2. Access via `useTranslation` hook: `t.section.key`

### Deploying to Vercel
1. Set environment variables using helper script:
   ```bash
   ./upload-env-to-vercel.sh production
   ```
2. Deploy:
   ```bash
   vercel --prod
   ```

## Security Considerations

- **RLS Policies**: All Supabase tables use Row Level Security
- **Protected Routes**: Checkout requires authentication
- **Payment Secret**: Store `VITE_TOSS_SECRET_KEY` securely (consider moving payment confirmation to server-side Edge Function for production)

## Important Notes

- **Brand Name**: "SOOMIN's KITCHEN" (not "KICHEN")
- **Image Storage**: Always use `public/products/` for product images (not `src/assets/`)
- **Multilingual**: All user-facing text should support Korean and English
- **Fallback Strategy**: Application works without Supabase, falling back to local data
