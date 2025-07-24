# EAZAAR Admin Panel

**Developer:** Erfan Alin

A modern, responsive admin panel for the EAZAAR e-commerce platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dashboard Analytics**: Comprehensive overview of sales, orders, and customer data
- **Product Management**: Add, edit, and manage products with image uploads
- **Category & Brand Management**: Organize products with hierarchical categories and brands
- **Order Management**: Track and manage customer orders
- **Customer Management**: View and manage customer accounts
- **Coupon System**: Create and manage discount coupons
- **Review System**: Monitor and manage product reviews
- **Staff Management**: Manage admin users and permissions
- **Responsive Design**: Mobile-friendly interface with dark/light mode support

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query
- **Charts**: Chart.js with react-chartjs-2
- **Form Handling**: React Hook Form with Yup validation
- **File Upload**: Cloudinary integration
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Heroicons React

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the admin panel directory:
   ```bash
   cd eazaar-admin-panel
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Set up environment variables (create `.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
   NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── components/      # Reusable UI components
│   ├── dashboard/       # Dashboard pages
│   ├── products/        # Product management pages
│   ├── orders/          # Order management pages
│   └── ...
├── redux/               # Redux store and slices
├── hooks/               # Custom React hooks
├── layout/              # Layout components
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── svg/                 # SVG icon components
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The admin panel integrates with the EAZAAR backend API for:
- Authentication and authorization
- Product, category, and brand management
- Order processing and tracking
- Customer management
- File uploads via Cloudinary

## Contributing

This project is part of the EAZAAR e-commerce platform developed by Erfan Alin.

## License

This project is proprietary software developed by Erfan Alin for the EAZAAR e-commerce platform.