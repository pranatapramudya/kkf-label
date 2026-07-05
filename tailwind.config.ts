import type { Config } from "tailwindcss";

const konfigurasi: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "soft-pink": {
          50: "#fff1f5",
          100: "#ffe4ec",
          200: "#fecddc",
          300: "#fda4bf",
          400: "#fb7197",
          500: "#f43f74",
          600: "#e11d5b",
          700: "#be1249",
          800: "#9f123f",
          900: "#881337"
        },
        "kkf-putih": "#fffafa",
        "kkf-teks": "#18181b"
      },
      boxShadow: {
        lembut: "0 18px 50px rgba(244, 63, 116, 0.14)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marquee 0.1s linear infinite"
      }
    }
  },
  plugins: []
};

export default konfigurasi;
