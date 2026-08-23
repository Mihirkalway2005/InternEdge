/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "pdf-parse"],
}

export default nextConfig
