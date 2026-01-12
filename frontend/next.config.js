/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This is for static export, remove if you need SSR
  trailingSlash: true,
  images: {
    unoptimized: true // For static exports
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` : 'http://localhost:8000/api/:path*',
      },
    ]
  }
}

module.exports = nextConfig