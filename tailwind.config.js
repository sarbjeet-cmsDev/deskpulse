import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        'theme-primary': '#7980ff', 
        'theme-secondary': '#6366f1',
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    require("tailwindcss-animate"),
     require('@tailwindcss/typography'),
  ],
}

module.exports = config;