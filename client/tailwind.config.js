/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      xsm: "0.7rem",
      sm: "0.8rem",
      ss: "0.9rem",
      base: "1rem",
      lg: "1.1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    screens: {
      sm: "470px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    extend: {
      colors: {
        primary: {
          100: "#1E1E2C",
          200: "#313146",
          300: "#434362"
        },
        secondary: {
          100: "#C3B5FD",
          200: "#D4D4DF"
        }
      }
    },
  },
  plugins: [],
}

