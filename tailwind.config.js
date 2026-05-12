/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "soc-bg": "#020617",
        "soc-panel": "#0f172a",
        "soc-border": "#1e293b",
        "soc-text": "#e2e8f0",
        "soc-muted": "#94a3b8",
        "soc-accent": "#38bdf8",
      },
    },
  },
  plugins: [],
}
