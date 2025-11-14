import { Playfair_Display, Inter } from 'next/font/google';

export const playfair = Playfair_Display({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-playfair',
});

export const inter = Inter({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});
