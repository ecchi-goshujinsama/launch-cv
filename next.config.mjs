/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack config for non-Turbopack builds
  webpack: (config, { isServer }) => {
    // Fix for PDF.js in client-side builds
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
      
      // Handle PDF.js worker
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }
    
    return config;
  },
  
  // Configure static file handling for PDF.js
  async headers() {
    return [
      {
        source: '/pdfjs-dist/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;