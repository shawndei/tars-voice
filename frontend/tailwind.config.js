/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tars-blue': '#00B4D8',
        'tars-dark': '#0A1128',
        'tars-gray': '#1B263B',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orb': 'orb 2s ease-in-out infinite',
      },
      keyframes: {
        orb: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
