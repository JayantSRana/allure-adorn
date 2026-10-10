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
        background: "#F7F2E8",
        foreground: "#171717",
        brand: {
          ivory: "#F7F2E8",
          champagne: "#EFE5D4",
          charcoal: "#171717",
          burgundy: "#6B1F24",
          gold: "#B08A4A",
          blush: "#F8D7D7",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
