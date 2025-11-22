# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean e-commerce shopping application built with React 19, Vite, and Tailwind CSS v4. The app features a product catalog, shopping cart functionality, and checkout flow for Korean food and health products.

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
```

## Tech Stack

- **React 19.2.0**: UI framework with latest features
- **Vite 7.2.4**: Build tool and dev server
- **React Router DOM 7.9.6**: Client-side routing with data router API
- **Tailwind CSS 4.1.17**: Utility-first CSS with @tailwindcss/postcss plugin
- **Framer Motion 12.23.24**: Animation library
- **Lucide React**: Icon library

## Architecture

### State Management
- **CartContext** (`src/context/CartContext.jsx`): Global cart state using React Context API
  - Persists to localStorage for cart data retention across sessions
  - Provides: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCartTotal`, `getCartCount`
  - All components access cart via `useCart()` hook

### Routing Structure
Routes defined in `src/App.jsx` using `createBrowserRouter`:
- `/` - Home page with product grid
- `/product/:id` - Individual product detail page
- `/cart` - Shopping cart view
- `/checkout` - Checkout form
- `/order-success` - Order confirmation

Layout component wraps all routes with Header/Footer and includes ScrollRestoration.

### Data Layer
- Product data stored in `src/data/products.js` as static array
- Each product has: id, name, price (in KRW), category, image (Unsplash URLs), description, isNew flag
- No backend/API - all data is client-side

### Component Organization
- **Layout Components**: `Layout.jsx`, `Header.jsx`, `Footer.jsx` - App shell
- **UI Components**: `Button.jsx`, `ProductCard.jsx` - Reusable presentational components
- **Error Handling**: `ErrorBoundary.jsx` - Catches React errors at root level
- **Pages**: Home, ProductDetail, Cart, Checkout, OrderSuccess - Route-level components

### Styling
- Tailwind CSS v4 with PostCSS plugin (not traditional config file approach)
- Custom utility function `cn()` in `src/utils/cn.js` uses `clsx` + `tailwind-merge` for className composition
- All styling is utility-first with no separate CSS modules

## Key Patterns

### Cart Operations
Cart state updates trigger localStorage writes via useEffect. When adding items, existing items have quantity incremented rather than duplicated.

### Price Display
All prices are in Korean Won (KRW). Format using `.toLocaleString('ko-KR')` for proper thousands separators.

### Image Handling
Product images source from Unsplash with specific dimensions (`?auto=format&fit=crop&w=800&q=80`). No local image assets.

### ESLint Configuration
Using flat config format with React Hooks and React Refresh plugins. Custom rule: unused vars starting with uppercase or underscore are ignored.

## Common Tasks

When adding new products: Update the `products` array in `src/data/products.js`.

When adding new routes: Add to the router configuration in `src/App.jsx` under the Layout element's children.

When adding global cart functionality: Extend the CartContext provider in `src/context/CartContext.jsx`.
