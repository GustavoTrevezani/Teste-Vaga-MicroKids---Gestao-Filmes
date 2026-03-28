/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        "primary-hover": "#4f46e5",
        secondary: "#1e293b",
        accent: "#f59e0b",
        background: "#0f172a",
        surface: "#1e293b",
        "surface-hover": "#334155",
        border: "#334155",
        text: "#f8fafc",
        "text-muted": "#94a3b8",
        success: "#22c55e",
        error: "#ef4444",
      },
    },
  },
  plugins: [],
};
