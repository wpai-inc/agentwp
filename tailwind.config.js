/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './client/**/*.{ts,tsx}',
  ],
  // important: 'div[id^="agent-wp"]',
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        brand: {
          primary: '#4991F7',
          secondary: '#FF70A6',
          gray: {
            DEFAULT: '#F6F7F7',
            25: '#E8E8E9',
            // 50: '#cacacb',
            50: '#b6b6b7',
          }
        }
      }
    },
  },
  // corePlugins: {
  //   // don't interfere with WordPress base styles
  //   // These are readded in the base layer under app.css
  //   preflight: false,
  // },
  plugins: [
    require("tailwindcss-animate"),
  ],
}