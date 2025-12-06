/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
 theme: {
    extend: {
      fontFamily: {
        invoice: ['"Source Serif 4"', 'serif'],
      },
    },
  },
  plugins: [],
}
