/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E1726",
        navy: "#16233A",
        slate: "#2C3A51",
        paper: "#F3EAD8",
        ivory: "#FBF6EC",
        gold: "#E3B25C",
        cherry: "#C9424B",
        blush: "#EBA9B4",
        sky: "#8FB8D8",
      },
      fontFamily: {
        display: ["'Bodoni Moda'", "Cinzel", "serif"],
        sans: ["Geist", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "Space Mono", "monospace"],
        handwriting: ["Caveat", "cursive"],
      }
    },
  },
  plugins: [],
}
