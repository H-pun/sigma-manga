const withBundleAnalyzer = async (config) => {
  if (process.env.ANALYZE === true) {
    const bundleAnalyzer = await import('@next/bundle-analyzer');
    return bundleAnalyzer.default({
      enabled: true,
    })(config);
  }
  return config;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ]
  },
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
