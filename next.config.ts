
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' ,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.photoworkout.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.dkphoto.ie',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pictorem.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'olympak.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets-production.mochi.media',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.cloudinary.vpsvc.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

    