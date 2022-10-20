/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        original: {
          primary: "#c026d3",
          secondary: "#8b5cf6",
          accent: "#22d3ee",
          neutral: "#d6d3d1",
          "base-100": "#f3f4f6",
          info: "#818cf8",
          success: "#34d399",
          warning: "#fb923c",
          error: "#DC2828",
        },
      },
      // "dark",
      // "cupcake",
    ],
  },
};
