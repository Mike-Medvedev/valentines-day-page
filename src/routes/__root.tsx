import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Box } from "@mantine/core";
import { FloatingHearts } from "../components/FloatingHearts";
import classes from "./__root.module.css";

const RootLayout = () => (
  <Box className={classes.rootLayout}>
    <FloatingHearts />
    <Box className={classes.content}>
      <Outlet />
    </Box>
  </Box>
);

export const Route = createRootRoute({ component: RootLayout });
