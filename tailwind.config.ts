const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./components/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./app/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./app/globals.css",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      colors: {
        primary: {
          "100": "#d5eeff",
          DEFAULT: "#80A5B5",
        },
        secondary: "#5DFFE9",
        black: {
          "100": "#333333",
          "200": "#141413",
          "300": "#7D8087",
          DEFAULT: "#000000",
        },
        white: {
          "100": "#F7F7F7",
          DEFAULT: "#FFFFFF",
        },
      },
      fontFamily: {
        "work-sans": ["var(--font-work-sans)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        100: "2px 2px 0px 0px rgb(0, 0, 0)",
        200: "2px 2px 0px 2px rgb(0, 0, 0)",
        300: "2px 2px 0px 2px rgb(128, 165, 181)",
      },
    },
  },
  plugins: [
    function ({
      addVariant,
    }: {
      addVariant: (name: string, selector: string) => void;
    }) {
      addVariant("child", "& > *");
    },
  ],
};

export default config;
