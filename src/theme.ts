import { createTheme } from "@mantine/core";
import type { MantineColorsTuple } from "@mantine/core";

export const valentine: MantineColorsTuple = [
  "#ffe7e7",
  "#ffcece",
  "#ff9a9b",
  "#ff6465",
  "#ff3334",
  "#ff1819",
  "#ff0309",
  "#e40000",
  "#cc0000",
  "#b30000",
];

export const theme = createTheme({
  primaryColor: "valentine",
  colors: {
    valentine,
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
          boxShadow: "0 2px 16px rgba(179, 0, 0, 0.08)",
          border: "none",
        },
      },
    },
    Paper: {
      styles: {
        root: {
          boxShadow: "0 2px 12px rgba(179, 0, 0, 0.08)",
        },
      },
    },
  },
});
