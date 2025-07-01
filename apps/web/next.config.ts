import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const devBackendUrl = "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    if (isDev) {
      console.log(
        "Development rewrites enabled, proxying /api to:",
        devBackendUrl
      );
      return [
        {
          source: "/api/:path*",
          destination: `${devBackendUrl}/:path*`,
        },
      ];
    }

    return [];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
    ],
  },
};

export default nextConfig;
