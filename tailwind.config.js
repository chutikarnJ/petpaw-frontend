/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#062D3E',
          light: '#FFFAF5',
           orange: '#ED5C01',
           teal: '#189CAB',
           yellow: '#FBBD08'
        }
      }
    },
  },
  plugins: [],
}

