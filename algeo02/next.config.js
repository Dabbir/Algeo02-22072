/** @type {import('next').NextConfig} */
const path = require("path");
const webpack = require("webpack");

const nextConfig = {
  // webpack5: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /\/src\/api\/upload\.js$/,
          path.resolve(__dirname, "src/api/upload.js")
        )
      );
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
      },
    ],
  },
};

module.exports = nextConfig;
