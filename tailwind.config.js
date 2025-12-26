/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#a76d24',
          dark: '#262729',
          light: '#f5f5f5',
        },
        neon: {
          pink: '#E91E8C',
          cyan: '#00D4D4',
          yellow: '#E6C700',
          green: '#32CD32',
          purple: '#9B30FF',
          orange: '#E65C00',
        },
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-orange': '4px 4px 0px 0px #a76d24',
        'brutal-pink': '4px 4px 0px 0px #E91E8C',
        'brutal-cyan': '4px 4px 0px 0px #00D4D4',
        'brutal-yellow': '4px 4px 0px 0px #E6C700',
        'brutal-green': '4px 4px 0px 0px #32CD32',
        'brutal-purple': '4px 4px 0px 0px #9B30FF',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        sans: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
