import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand P&L Skateboarding
        mustard: {
          DEFAULT: "#D19E1B", // stesso giallo dei frame dell'hero
          dark: "#B58C00",
          light: "#E8BE2E",
        },
        ink: {
          DEFAULT: "#141414", // nero brand (non #000 puro)
        },
        // Token shadcn/ui -> CSS variable in app/globals.css.
        // Servono ai componenti del registry (@efferd/header-2, ui/button).
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        display: ["var(--font-cubano)", "var(--font-sostituto)", "sans-serif"], // titoli/headline
        sans: ["var(--font-inter)", "sans-serif"], // body/UI
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "14px",
        btn: "6px",
        card: "12px",
      },
      maxWidth: {
        prose: "70ch",
      },
      boxShadow: {
        // Hard shadows neo-brutalist: zero blur, offset netto.
        "hard-sm": "4px 4px 0px 0px #141414",
        "hard-lg": "8px 8px 0px 0px #141414",
        "hard-sm-pressed": "0px 0px 0px 0px #141414",
      },
      borderWidth: {
        3: "2px",
      },
      transitionProperty: {
        press: "transform, box-shadow",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
