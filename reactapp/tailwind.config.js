/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",     // blue-600
        secondary: "#f1f5f9",   // slate-100
        accent: "#1e293b",      // slate-800
        sage: "#96A78D",
        mint: "#B6CEB4",
        lightSage: "#D9E9CF",
        offWhite: "#F0F0F0",
      },
    },
  },
  plugins: [],
};
