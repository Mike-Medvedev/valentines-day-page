import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Container, Box } from "@mantine/core";
import { isAuthenticated } from "../lib/auth";

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
    <Box
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px",
      }}
    >
      <Container size={640} w="100%" style={{ flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
