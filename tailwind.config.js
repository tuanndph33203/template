/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        invoice: ['"Source Serif 4"', 'serif'],
      },
    },
  },
  safelist: ['line-clamp-1', 'line-clamp-2', 'line-clamp-3', 'line-clamp-4', 'line-clamp-5'],
  darkMode: ['selector', '[class~="app-dark"]'],
  plugins: [PrimeUI],
};
