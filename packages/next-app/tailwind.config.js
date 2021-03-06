module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      height: {
        full: "100vh",
        "1/2": "50vh",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "3/4": "75vh",
        "1/10": "10vh",
        "2/10": "20vh",
        "3/10": "30vh",
        "4/10": "40vh",
        "5/10": "50vh",
        "6/10": "60vh",
        "7/10": "70vh",
        "8/10": "80vh",
        "9/10": "90vh",
        "1/12": "8.333333vh",
        "2/12": "16.666667vh",
        "3/12": "25vh",
        "4/12": "33.333333vh",
        "5/12": "41.666667vh",
        "6/12": "50vh",
        "7/12": "58.333333vh",
        "8/12": "66.666667vh",
        "9/12": "75vh",
        "10/12": "83.333333vh",
        "11/12": "91.666667vh",
        "1/16": "6.25vh",
        "2/16": "12.5vh",
        "3/16": "18.75vh",
        "4/16": "25vh",
        "5/16": "31.25vh",
        "6/16": "37.5vh",
        "7/16": "43.75vh",
        "8/16": "50vh",
        "9/16": "56.25vh",
        "10/16": "62.5vh",
        "11/16": "68.75vh",
        "12/16": "75vh",
        "13/16": "81.25vh",
        "14/16": "87.5vh",
        "15/16": "93.75vh",
        "16/16": "100vh",
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};
