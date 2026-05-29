/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow ESM packages like supports-color to be processed correctly
  webpack: (config, { isServer }) => {
    // Treat supports-color as a regular JS module (disable ESM external handling)
    config.module.rules.push({
      test: /supports-color/,
      type: 'javascript/auto',
    });
    return config;
  },
};

module.exports = nextConfig;
