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
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 0.1s linear infinite",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slide-down 0.3s cubic-bezier(0.7, 0, 0.84, 0) forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "fade-out": "fade-out 0.2s ease-in forwards",
      }
    }
  },
  plugins: []
};

export default konfigurasi;
