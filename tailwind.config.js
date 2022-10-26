/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("daisyui")],
  theme: {},
  daisyui: {
    themes: [
      {
        original: {
          primary: "#8b5cf6",
          secondary: "#7e22ce",
          accent: "#f472b6",
          neutral: "#d6d3d1",
          "base-100": "#fff",
          "base-200": "#f3f4f6",
          info: "#a8a29e",
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
