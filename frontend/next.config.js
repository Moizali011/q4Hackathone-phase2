/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to allow API routes to work
  trailingSlash: false,
  images: {
    unoptimized: false
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