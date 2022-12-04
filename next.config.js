/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['twatter-live.s3.eu-west-3.amazonaws.com', 'arjuna.fr'],
  },
}

module.exports = nextConfig
