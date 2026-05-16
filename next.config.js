/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['sequelize', 'mysql2'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent webpack from bundling these — let Node resolve from node_modules at runtime
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'sequelize',
        'mysql2',
        'mysql2/promise',
      ];
    }
    return config;
  },
};
module.exports = nextConfig;
