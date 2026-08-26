/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1152px',
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1467D9',
          deep: '#0B3B78',
          50: '#EEF4FC',
          100: '#DCE9F9',
          200: '#B4D0F1',
          600: '#1467D9',
          700: '#0F52B5',
          900: '#0B3B78',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F8FC',
        },
        ink: {
          DEFAULT: '#10243E',
          soft: '#6E7F95',
        },
        line: 'rgba(16, 36, 62, 0.08)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        none: '0',
        sm: '10px',
        DEFAULT: '10px',
        md: '16px',
        lg: '24px',
        xl: '24px',
        pill: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(16, 36, 62, 0.06)',
        none: 'none',
      },
      backdropBlur: {
        glass: '20px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        250: '250ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
