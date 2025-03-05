/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#F7B32B',
          500: '#F5A623',
          600: '#E29722',
          700: '#C67F1E',
          800: '#A86A19',
        },
      },
    },
  },
  plugins: [],
}
