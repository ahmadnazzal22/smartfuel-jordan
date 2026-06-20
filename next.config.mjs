/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
    serverComponentsExternalPackages: ["@prisma/client", "@prisma/adapter-libsql", "bcryptjs"],
  },
  images: { domains: ["api.mapbox.com"] },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "node:path": false,
        "node:process": false,
        "node:url": false,
        "node:os": false,
        "node:fs": false,
        "node:crypto": false,
        "node:buffer": false,
      };
    }
    return config;
  },
};
export default nextConfig;