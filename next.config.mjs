/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/sentinel-dashboard-SIH',
  assetPrefix: '/sentinel-dashboard-SIH',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
