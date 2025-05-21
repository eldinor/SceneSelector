/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  distDir: "out",
  output: 'export',
//  basePath: '/selector',
 // assetPrefix: '/selector/',
}

export default nextConfig
