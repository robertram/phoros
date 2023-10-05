/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    //domains: ['firebasestorage.googleapis.com', 'mypinata.cloud', 'indigo-academic-mandrill-845.mypinata.cloud', 'images.ctfassets.net'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ['image/avif', 'image/webp'],
  }
}

//module.exports = { images: { domains: ['firebasestorage.googleapis.com'], formats: ['image/avif', 'image/webp'], }, }

module.exports = nextConfig
