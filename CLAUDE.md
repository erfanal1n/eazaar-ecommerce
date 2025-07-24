# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the EAZAAR Theme project - a complete e-commerce solution with three main components:
- **eazaar-front-end**: Customer-facing Next.js React application
- **eazaar-admin-panel**: Admin dashboard built with Next.js and TypeScript
- **eazaar-backend**: Node.js/Express API server with MongoDB

## Development Commands

### Frontend (eazaar-front-end)
```bash
cd eazaar-front-end
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Admin Panel (eazaar-admin-panel)
```bash
cd eazaar-admin-panel
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend (eazaar-backend)
```bash
cd eazaar-backend
npm start        # Start production server
npm run start-dev    # Start with nodemon for development
npm run data:import  # Seed database with initial data
```

## Architecture

### State Management
- **Frontend**: Redux Toolkit with RTK Query for API calls
  - Features: auth, cart, wishlist, compare, shop filters, product modal
  - Store: `src/redux/store.js`
- **Admin Panel**: Redux Toolkit with RTK Query
  - Focused on auth and API management
  - Store: `src/redux/store.ts`

### Backend Structure
- **Express.js** server with MongoDB via Mongoose
- **Route structure**: `/api/{resource}` (user, product, category, brand, order, coupon, review, admin)
- **Authentication**: JWT-based with bcryptjs
- **File uploads**: Cloudinary integration
- **Database**: MongoDB with Mongoose ODM

### Key Directories
- **Frontend components**: `src/components/` (organized by feature)
- **Admin components**: `src/app/components/` (organized by feature)  
- **Backend models**: `model/` (User, Product, Category, Brand, Order, etc.)
- **API routes**: `routes/` with corresponding controllers in `controller/`

## Database Configuration
- Local development: `mongodb://0.0.0.0:27017/eazaar`
- Production: Uses environment variable `MONGO_URI`
- Seeding: Run `npm run data:import` in backend to populate initial data

## Key Technologies
- **Frontend**: Next.js 15, React 18, Redux Toolkit, Sass, Bootstrap
- **Admin**: Next.js 13, TypeScript, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, JWT, Cloudinary, Stripe

## Important Notes
- Each application runs independently on different ports
- Backend API serves both frontend and admin panel
- Uses environment variables for configuration (check .env files)
- Cloudinary handles image storage and management