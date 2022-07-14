/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  pwa: {
    dest: "public",
  },
});

module.exports = nextConfig;
