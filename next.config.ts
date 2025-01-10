import type { NextConfig } from "next";

const withBundleAnalyzer = async (config: NextConfig) => {
  if (process.env.ANALYZE === "true") {
    const bundleAnalyzer = await import("@next/bundle-analyzer");
    return bundleAnalyzer.default({
      enabled: true,
    })(config);
  }
  return config;
};

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => {
    return [
      {
        source: "/api/:path((?!auth).*)",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "/api/",
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withBundleAnalyzer(nextConfig);
