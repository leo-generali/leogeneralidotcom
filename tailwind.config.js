const theme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{njk,js}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Consolas", ...theme.fontFamily.mono],
      },
      keyframes: {
        "fade-in-from-bottom": {
          from: { opacity: 0, transform: "translateY(2rem)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in-from-top": {
          from: { opacity: 0, transform: "translateY(-2rem)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-from-bottom":
          "fade-in-from-bottom 0.3s ease var(--delay) both",
        "fade-in-from-top": "fade-in-from-top 0.3s ease var(--delay) both",
      },
      colors: {
        blue: {
          50: "#F5FCFF",
          100: "#D9EDFF",
          200: "#ACCFFC",
          300: "#85ACF4",
          400: "#758CEC",
          500: "#5C66D2",
          600: "#414AA6",
          700: "#313B84",
          800: "#262C62",
          900: "#152041",
        },
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addUtilities, theme }) {
      const colors = theme("colors");
      const spacing = theme("spacing");
      const utilities = {};

      for (const [color, shade] of Object.entries(colors)) {
        if (typeof shade === "string") {
          const key = `.bg-dotted-${color}`;
          utilities[key] = {
            backgroundImage: `radial-gradient(${shade} 35%, transparent 35%)`,
            backgroundSize: "0.25rem 0.25rem",
          };
          continue;
        }

        for (const [variant, hex] of Object.entries(shade)) {
          const key = `.bg-dotted-${color}-${variant}`;
          utilities[key] = {
            backgroundImage: `radial-gradient(${hex} 35%, transparent 35%)`,
            backgroundSize: "0.25rem 0.25rem",
          };
        }
      }

      addUtilities(utilities, ["hover"]);
    }),
  ],
};
