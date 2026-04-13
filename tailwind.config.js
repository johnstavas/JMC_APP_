/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#d97706",
          500: "#b45309",
          600: "#92400e",
          700: "#78350f",
        },
        surface: {
          DEFAULT: "var(--bg)",
          raised: "var(--bg-card)",
          overlay: "var(--bg-surface)",
          border: "var(--border)",
          "border-light": "var(--border-accent)",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
