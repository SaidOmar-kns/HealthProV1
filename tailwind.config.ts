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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          '50': '#f0f8ff',
          '100': '#e0f0fe',
          '200': '#bae1fd',
          '300': '#7dcafc',
          '400': '#38aff8',
          '500': '#0e95e9',
          '600': '#0270bd',
          '700': '#035ea1',
          '800': '#075085',
          '900': '#0c436e',
          '950': '#082a49',
        },
        secondary: {
          '50': '#f2fbfa',
          '100': '#d5f2ef',
          '200': '#aae5e1',
          '300': '#78d0cc',
          '400': '#4cb5b4',
          '500': '#36a5a6',
          '600': '#26787b',
          '700': '#226063',
          '800': '#1f4d50',
          '900': '#1e4143',
          '950': '#0c2527',
        },
      },
    },
  },
  plugins: [],
};
export default config;
