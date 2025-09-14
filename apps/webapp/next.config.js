/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Next.js to ignore the externals directory
  outputFileTracingExcludes: {
    '*': ['./externals/**']
  }
}

module.exports = nextConfig