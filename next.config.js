// next.config.js
module.exports = {
  // Ensure Next.js knows these are client-side only
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      // Add any other polyfills needed
    };
    return config;
  },
};