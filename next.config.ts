import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "ssl.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "img.seoul.co.kr",
      },
      {
        protocol: "https",
        hostname: "item.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
