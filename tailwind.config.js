/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#202124",
        secondary: "#27272A",
        borderMain: "#414144",
        navbarSecondary: "#A1A1AA",
        actionColor: "#414144",
        borderButton: "#C6C6C6",
      },
    },
    fontFamily: {
      sans: "Roboto Mono, monospace",
    },
  },
  plugins: [],
};
