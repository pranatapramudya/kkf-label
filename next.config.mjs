/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // BINTANG DUA: Artinya terima gambar dari website HTTPS apapun!
      },
      {
        protocol: "http",
        hostname: "**", // BINTANG DUA: Terima gambar dari website HTTP biasa
      },
    ],
  },
};

export default nextConfig;
