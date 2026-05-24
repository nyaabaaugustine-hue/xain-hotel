/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http",  hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL:       process.env.NEXT_PUBLIC_API_URL       || "http://localhost:4000",
    NEXT_PUBLIC_FORMSPREE_ID:  process.env.NEXT_PUBLIC_FORMSPREE_ID  || "",
  },
  // Silence ESLint/TypeScript errors during builds (fix warnings without blocking production)
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
