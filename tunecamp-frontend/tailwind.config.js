/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: '',
  purge: {
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      scale: {
        '101': '1.01',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
