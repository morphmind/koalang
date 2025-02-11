/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '2xl': '20px',
        'xl': '16px',
        'lg': '12px',
        'md': '8px',
        'sm': '6px',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-slow-reverse': 'float 8s ease-in-out infinite reverse',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -20px)' }
        }
      },
      colors: {
        'bs-navy': '#00124F',
        'bs-800': '#0521C6',
        'bs-700': '#0627F2',
        'bs-600': '#1533F8',
        'bs-500': '#375AF8',
        'bs-400': '#6B8EFA',
        'bs-300': '#9DB9FB',
        'bs-200': '#C7D9FD',
        'bs-100': '#E1EAFE',
        'bs-50': '#EFF6FE',
        'bs-primary': '#081C9E',
        'bs-secondary': '#6B72B8',
        'bs-fourly': '#E1E4EB',
        'bs-navygri': '#8D93A5',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};