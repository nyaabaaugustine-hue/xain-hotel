/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#EDF7F1",
          100: "#CDEADB",
          200: "#91CDB0",
          400: "#3FA876",
          600: "#0F7048",
          700: "#0A5034",
          800: "#063523",
          900: "#031A0F",
        },
        gold: {
          50:  "#FFFDF0",
          100: "#FDF3D0",
          200: "#FAEA9C",
          300: "#F5CC66",
          400: "#E8B433",
          500: "#C49100",
          600: "#8A6400",
        },
        cream: {
          DEFAULT: "#FAF6EE",
          dark:    "#EDE5CF",
        },
        earth: {
          light:   "#E8896A",
          DEFAULT: "#C06030",
          dark:    "#7A3018",
        },
      },
      fontFamily: {
        sans:    ["var(--font-body)",    "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia",   "serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      backgroundImage: {
        "gold-shimmer": "linear-gradient(135deg, #B8860B 0%, #E8B433 40%, #F5CC66 60%, #C49100 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in": "fadeIn 0.6s ease forwards",
        float:     "float 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(28px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        float:  { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
      },
    },
  },
  plugins: [],
};
