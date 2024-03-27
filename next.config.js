/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'nftstorage.link', 'ipfs.io'],
  },
}

module.exports = nextConfig
