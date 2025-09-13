/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Next.js to ignore the externals directory
  outputFileTracingExcludes: {
    '*': ['./externals/**']
  },
  // Add webpack configuration to ignore externals
  webpack: (config, { isServer }) => {
    // Ignore the externals directory
    config.resolve.modules = [ 
      ...config.resolve.modules.filter(m => !m.includes('externals')),
      'node_modules'
    ];
    
    return config;
  },
  // Configure Turbopack to ignore externals
  experimental: {
    turbo: {
      resolveAlias: {
        // Ignore the externals directory
      }
    }
  }
}

module.exports = nextConfig