/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com', 'firebasestorage.googleapis.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin', 'groq-sdk']
  },
  compress: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
