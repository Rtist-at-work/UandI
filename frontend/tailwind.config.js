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
      
      margin: {
        'hidebuttons': '-300px',
      },
    },
    screens : {
      'xsm' : '320px',
      'xxsm' : '480px',
      'lg' : '1024px',
      'sm' : '640px',
      'md' : '768px'
    },
    fontFamily: {
      sans: ['Roboto', 'Arial', 'sans-serif'],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.scrollbar-hidden::-webkit-scrollbar': {
            display: 'none',
          },
          '.no-scroll': {
            'pointer-events': 'none', // Prevents all pointer interactions
          },
          '.scrollbar-hidden': {
            '-ms-overflow-style': 'none', /* IE and Edge */
            'scrollbar-width': 'none', /* Firefox */
          },
        },
        ['responsive', 'hover']
      );
    },
  ],
}