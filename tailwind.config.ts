import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFBF5",
          100: "#FFF6EB",
          200: "#FCECD7",
          300: "#F5D9B8",
        },
        clay: {
          400: "#E8A87C",
          500: "#D4896A",
          600: "#C06B4F",
          700: "#A3523A",
        },
        sage: {
          400: "#A8C5A0",
          500: "#7FA876",
          600: "#5F8A57",
          700: "#476B41",
        },
        ink: {
          700: "#3D3A36",
          800: "#2C2926",
          900: "#1A1816",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
