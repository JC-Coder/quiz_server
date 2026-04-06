/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          500: '#0f78ff',
          600: '#0b61d1',
          700: '#0849a0'
        }
      }
    }
  },
  plugins: []
};
