export default {
  content: ['./*.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   plugins: [require("daisyui")],
//   theme: {
//     extend: {
//       animation: {
//         // renderToast: "renderToast",
//         // loadingSpin: "loadingSpin 1s cubic-bezier(0, 0.2, 0.8, 1) infinite",
//         // loadingSpin2: "loadingSpin 1s -.5s cubic-bezier(0, 0.2, 0.8, 1) infinite",
//       },
//       keyframes: {
//         // renderToast: {
//         //   "0%": {
//         //     transform: "translateX(100%)",
//         //     opacity: 0,
//         //   },  
//         //   "10%": {
//         //     transform: "translateX(0%)",
//         //     opacity: 1,
//         //   },
//         //   "90%": {
//         //     transform: "translateX(0%)",
//         //     opacity: 1,
//         //   },
//         //   "100%": {
//         //     transform: "translateX(100%)",
//         //     opacity: 0,
//         //   },
//         // },
//         // loadingSpin: {
//         //   "0%": {
//         //     top: "45%",
//         //     left: "45%",
//         //     width: "0",
//         //     height: "0",
//         //     opacity: "0",
//         //   },
//         //   "4.9%": {
//         //     top: "45%",
//         //     left: "45%",
//         //     width: "0",
//         //     height: "0",
//         //     opacity: "0",
//         //   },
//         //   "5%": {
//         //     top: "45%",
//         //     left: "45%",
//         //     width: "0",
//         //     height: "0",
//         //     opacity: "1",
//         //   },
//         //   "100%": {
//         //     top: "0px",
//         //     left: "0px",
//         //     width: "90%",
//         //     height: "90%",
//         //     opacity: "0",
//         //   },
//         // },
//       },
//     },
//   },
//   daisyui: {
//     themes: [
//       {
//         original: {
//           primary: "#8b5cf6",
//           secondary: "#7e22ce",
//           accent: "#f472b6",
//           neutral: "#d6d3d1",
//           "base-100": "#fff",
//           "base-200": "#f3f4f6",
//           info: "#a8a29e",
//           success: "#34d399",
//           warning: "#fb923c",
//           error: "#DC2828",
//         },
//       },
//       // "dark",
//       // "cupcake",
//     ],
//   },
// };
