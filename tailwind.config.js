/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Custom color palette for the JobFinder brand.
      // "ink"   = primary dark navy, used for headings & the navbar
      // "signal"= amber accent, used for primary CTAs (Apply, Search)
      // "teal"  = secondary accent, used for tags / success states
      colors: {
        ink: {
          50: "#eef1f6",
          100: "#d7deea",
          200: "#aeb9d1",
          300: "#8091b3",
          400: "#54678f",
          500: "#344968",
          600: "#243452",
          700: "#1b2a4a", // primary brand color
          800: "#141f38",
          900: "#0d1526",
        },
        signal: {
          50: "#fef8ec",
          100: "#fdedc8",
          200: "#fbd98d",
          300: "#f9c454",
          400: "#f5a524", // primary accent
          500: "#e0890f",
          600: "#b96a0a",
        },
        teal: {
          50: "#eefcfa",
          100: "#d1f5ee",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(13, 21, 38, 0.06), 0 4px 10px rgba(13, 21, 38, 0.06)",
      },
    },
  },
  plugins: [],
};
