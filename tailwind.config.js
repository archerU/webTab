/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.1)",
        glassHover: "rgba(255, 255, 255, 0.2)",
        glassBorder: "rgba(255, 255, 255, 0.2)",
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

