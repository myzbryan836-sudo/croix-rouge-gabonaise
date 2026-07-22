/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'cr-red': '#D32F2F',
        'cr-dark': '#1E1E1E',
        'cr-cream': '#FBFBFA',
        'cr-gray': '#F4F4F3',
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
