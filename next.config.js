/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
};

module.exports = nextConfig;
