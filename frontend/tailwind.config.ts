import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f9f9ff',
        surface: '#f9f9ff',
        'surface-lowest': '#ffffff',
        'surface-low': '#f0f3ff',
        'surface-container': '#e7eeff',
        'surface-high': '#dee8ff',
        ink: '#111c2c',
        muted: '#43474e',
        outline: '#74777f',
        'outline-soft': '#c4c6cf',
        primary: '#002045',
        'primary-container': '#1a365d',
        'primary-soft': '#d6e3ff',
        success: '#2f855a',
        warning: '#d69e2e',
        danger: '#ba1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        paper: '0 4px 12px rgb(17 28 44 / 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;

