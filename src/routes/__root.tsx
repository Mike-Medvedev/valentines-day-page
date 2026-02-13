import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Box } from "@mantine/core";
import { FloatingHearts } from "../components/FloatingHearts";

const RootLayout = () => (
  <Box
    style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}
  >
    <FloatingHearts />
    <Box style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
      <Outlet />
    </Box>
  </Box>
);

export const Route = createRootRoute({ component: RootLayout });
