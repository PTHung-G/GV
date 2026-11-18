// Set NEXT_BASE_PATH=/soandethi to serve the app under a subpath (see deploy/).
// Empty by default so `pnpm dev` and `next start` keep working at the site root.
const basePath = process.env.NEXT_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The clone ships its own visual design system; no remote image hosts are needed.
  images: { remotePatterns: [] },
  eslint: { ignoreDuringBuilds: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
