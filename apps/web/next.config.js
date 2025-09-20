/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787',
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  images: {
    domains: ['localhost'],
  },
}

export default nextConfig