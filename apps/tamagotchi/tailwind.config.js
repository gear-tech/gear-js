const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "text-secondary": 'rgb(var(--color-text-secondary) / <alpha-value>)',
      },
      fontFamily: {
        kanit: ['Kanit', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  corePlugins: {
    container: false,
    preflight: false,
  },
  plugins: [],
};
