/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // Make sure this is included!
  ],
  theme: {
    extend: {
      colors: {
        mylightblue: '#dff4fe',
        mygreen: '#264c2e'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [],
};
