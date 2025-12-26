/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#a76d24',
          dark: '#262729',
        },
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-orange': '4px 4px 0px 0px #a76d24',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
