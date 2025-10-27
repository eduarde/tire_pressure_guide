/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        carbon: {
          50: "#f4f7fb",
          100: "#e8edf6",
          200: "#cfd9eb",
          300: "#adbdd9",
          400: "#829cc3",
          500: "#5c7dae",
          600: "#405f93",
          700: "#324c77",
          800: "#293f63",
          900: "#233452",
          950: "#111a2c"
        },
        crimson: {
          50: "#ffe5ec",
          100: "#ffceda",
          200: "#ff9fb7",
          300: "#ff6a92",
          400: "#ff306c",
          500: "#f50f53",
          600: "#d00846",
          700: "#a40639",
          800: "#7b052c",
          900: "#4f031e",
          950: "#2c0111"
        }
      },
      fontFamily: {
        sans: ["'Inter var'", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 20px 45px -25px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};
