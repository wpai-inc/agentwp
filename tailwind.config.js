/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./client/**/*.{ts,tsx}'],
  // important: 'div[id^="agentwp"]',
  prefix: '',
  theme: {
    fontSize: {
      'xs': '0.625rem',
      'sm': '0.75rem',
      'base': '0.875rem',
      'xl': '1rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      '5xl': '3rem',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      boxShadow: {
        '3xl': '0 0 150px 30px rgb(0, 0, 0, 0.5)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        brand: {
          primary: {
            DEFAULT: '#4991F7',
            muted: '#63ABFD',
          },
          secondary: {
            DEFAULT: '#FF70A6',
            muted: '#E3AFD0',
          },
          dark: '#1E1E1E',
          gray: {
            DEFAULT: '#EEF0F0',
            15: '#D9D9D9',
            20: '#EEEEEE',
            25: '#E8E8E9',
            30: '#ABABAB',
            50: '#BBBBBB',
            70: '#777777',
          },
        },
      },
    },
  },
  // corePlugins: {
  //   // don't interfere with WordPress base styles
  //   // These are readded in the base layer under app.css
  //   preflight: false,
  // },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries')
  ],
};
