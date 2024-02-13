/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#181923',
          blue: '#1E293B',
        },
        onPrimary: {
          light: '#ebebeb',
          main: '#627181',
        },
        secondary: {
          main: '#7b8a9a',
        },
      },
      screens: {
        '6xl': '1150px',
      },
    },
  },
  plugins: [],
};
