import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`
      }
    ];
  },

  // Next.js 16: use "turbopack" (not "turbo")
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [{ name: "removeViewBox", active: false }]
              }
            }
          }
        ],
        as: "*.js"
      }
    }
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false
                }
              ]
            }
          }
        }
      ]
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "tdp-bucket-1.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tdp-bucket-1.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
