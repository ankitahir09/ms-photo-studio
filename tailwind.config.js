/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      brightness: {
    80: '.8',
  },
      keyframes: {
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
      animation: {
        "slide-in-left": "slide-in-left 1s ease-out forwards",
      },
      fontFamily: {
        gravitas: ["GravitasOne", "sans-serif"],
      },
      width: {
        "25p": "25%",
        "75p": "75%",
      },
      margin: {
        "25p": "25%",
      },
    },
  },
  plugins: [],
};
