/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#f2f2f2', // Custom color name and hex code
      },
      width:{
        xsm:320,
      },
      margin: {
        'hidebuttons': '-300px',
      },
    },
  },
  plugins: [],
}