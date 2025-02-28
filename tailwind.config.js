/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        code: ['"Source Code Pro"', 'monospace'],
        sora: ['Sora', 'sans-serif'],
        anekmalayalam: ['Anek Malayalam', 'sans-serif'],
        boxShadow:{
          'text':' 0 2px 5px rgba(0,0,0,0.3)'
        }


      },
    },
  },
  plugins: [],
};
