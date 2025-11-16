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
        'fade-in': 'fadeIn var(--duration-elegant) var(--ease-elegant)',
        'fade-in-up': 'fadeInUp var(--duration-elegant) var(--ease-elegant)',
        'slide-in-right': 'slideInRight var(--duration-slow) var(--ease-elegant)',
        'float': 'float 3s var(--ease-smooth) infinite',
        'pulse-subtle': 'pulseSubtle 4s var(--ease-elegant) infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
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
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.95', transform: 'scale(1.02)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
