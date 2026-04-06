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
        navy: {
          950: "#000918",
          900: "#001028",
          800: "#001540",
          700: "#001E55",
          600: "#002B6E",
          500: "#003DA5",
        },
        gold: {
          300: "#FFF080",
          400: "#FFE040",
          500: "#FFD200",
          600: "#CCB000",
          700: "#997F00",
        },
        jade: {
          400: "#00C65E",
          500: "#00A651",
          600: "#007A3D",
        },
        flagred: {
          DEFAULT: "#C8102E",
          light: "#E8102E",
          dark: "#9A0020",
        },
        slate: {
          muted: "#8BB8DC",
          dim: "#3D6080",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-outfit)", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,61,165,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,61,165,0.1) 1px, transparent 1px)",
        "radial-gold":
          "radial-gradient(ellipse at 50% 0%, rgba(255,210,0,0.12) 0%, transparent 60%)",
        "hero-gradient":
          "linear-gradient(135deg, #000918 0%, #001540 50%, #001E55 100%)",
      },
      backgroundSize: { grid: "40px 40px" },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        "scale-in":   "scaleIn 0.4s ease forwards",
        shimmer:      "shimmer 2s infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "spin-slow":  "spin 8s linear infinite",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn:    { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        scaleIn:   { "0%": { opacity: "0", transform: "scale(0.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        shimmer:   { "0%": { backgroundPosition: "-1000px 0" }, "100%": { backgroundPosition: "1000px 0" } },
        pulseGold: { "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,210,0,0.3)" }, "50%": { boxShadow: "0 0 0 8px rgba(255,210,0,0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
