import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#e790de",
          mint: "#89ead6",
          cyan: "#5fd0ff",
          yellow: "#e5f782",
          navy: "#3d3f72",
          cream: "#e5d5af",
        },
      },
      boxShadow: {
        soft: "0 6px 30px -12px rgba(0,0,0,.20)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      screens: {
        xs: "380px",
      },
    },
  },
  plugins: [typography],
};
export default config;
