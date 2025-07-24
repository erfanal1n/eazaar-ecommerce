/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'i.ibb.co',
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: 'res.cloudinary.com',
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: 'lh3.googleusercontent.com',
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: 'images.unsplash.com',
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: 'via.placeholder.com',
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: 'picsum.photos',
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: 'localhost',
        port: '7000',
        pathname: "**",
      }
    ],
  },
}

module.exports = nextConfig
