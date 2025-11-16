import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#040920',
          dark: '#0D2A4A',
        },
        accent: {
          DEFAULT: '#82b4d6',
          light: '#a0c8e4',
        },
        neutral: {
          DEFAULT: '#e7edf4',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      spacing: {
        '4px': '4px',
        '8px': '8px',
        '12px': '12px',
        '16px': '16px',
        '24px': '24px',
        '32px': '32px',
        '40px': '40px',
        '48px': '48px',
        '56px': '56px',
        '64px': '64px',
        '72px': '72px',
        '80px': '80px',
        '96px': '96px',
      },
      maxWidth: {
        'prose': '65ch', // 50-75 caracteres por linha (ideal para leitura)
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.2' }],
        'sm': ['14px', { lineHeight: '1.4' }],
        'base': ['16px', { lineHeight: '1.5' }],
        'lg': ['18px', { lineHeight: '1.5' }],
        'xl': ['20px', { lineHeight: '1.6' }],
        '2xl': ['24px', { lineHeight: '1.6' }],
        '3xl': ['30px', { lineHeight: '1.5' }],
        '4xl': ['36px', { lineHeight: '1.4' }],
        '5xl': ['48px', { lineHeight: '1.3' }],
        '6xl': ['60px', { lineHeight: '1.2' }],
        '7xl': ['72px', { lineHeight: '1.1' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
