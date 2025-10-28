
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
      },
      {
        protocol: 'https',
        hostname: 'media1.pbwwcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'goodrich.com.sg',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'down-my.img.susercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'photostudiokathmandu.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'seyaimaging.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.images.photojaanic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pikperfect.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.printo.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'omgs.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'homafy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'printingstudio.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'albumdelhi.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

    