import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Container, Box } from "@mantine/core";
import { isAuthenticated } from "../lib/auth";
import { ProgressProvider } from "../lib/ProgressContext";
import classes from "./_authenticated.module.css";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <ProgressProvider>
      <Box className={classes.layout}>
        <Container size={640} w="100%" className={classes.container}>
          <Outlet />
        </Container>
      </Box>
    </ProgressProvider>
  );
}
