/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        flipkart: {
          blue:   '#2874f0',
          yellow: '#f0c000',
          orange: '#fb641b',
        },
      },
    },
  },
  plugins: [],
};
