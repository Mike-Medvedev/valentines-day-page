import { createTheme } from "@mantine/core";
import type { MantineColorsTuple } from "@mantine/core";

const rose: MantineColorsTuple = [
  "#fff0f3",
  "#ffdfe5",
  "#ffbcc9",
  "#ff96ab",
  "#f67391",
  "#eb5c7f",
  "#BE3455",
  "#a82a4a",
  "#8f2140",
  "#761836",
];

const gold: MantineColorsTuple = [
  "#fdf6ef",
  "#f5e8d8",
  "#edd5b6",
  "#e4c08f",
  "#D4A574",
  "#c69560",
  "#b8854d",
  "#9a6e3e",
  "#7d5831",
  "#604325",
];

export const theme = createTheme({
  primaryColor: "rose",
  colors: {
    rose,
    gold,
  },
  fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: "700",
  },
  defaultRadius: "lg",
  components: {
    Button: {
      defaultProps: {
        radius: "xl",
      },
      styles: {
        root: {
          fontWeight: 600,
          letterSpacing: "0.02em",
        },
      },
    },
    Card: {
      styles: {
        root: {
          boxShadow: "0 2px 16px rgba(44, 24, 16, 0.06)",
          border: "none",
        },
      },
    },
    Paper: {
      styles: {
        root: {
          boxShadow: "0 2px 12px rgba(44, 24, 16, 0.06)",
        },
      },
    },
  },
});
