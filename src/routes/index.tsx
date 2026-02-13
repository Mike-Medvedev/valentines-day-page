import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Box, Checkbox, Container, Stack, Text, Title } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { CaptchaGrid } from "../components/CaptchaGrid";
import { generateAuthToken, isAuthenticated } from "../lib/auth";
import classes from "./index.module.css";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/challenges" });
    }
  },
  component: AuthGatePage,
});

function AuthGatePage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked;
    setChecked(isChecked);
    if (isChecked) {
      setTimeout(() => setShowCaptcha(true), 400);
    } else {
      setShowCaptcha(false);
    }
  };

  const handleCaptchaSuccess = () => {
    generateAuthToken();
    navigate({ to: "/challenges" });
  };

  return (
    <Box className={classes.pageWrapper}>
      <Container size={420}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}>
          <Stack gap="xl" align="center">
            <Stack gap="xs" align="center">
              <Title order={1} ta="center" className={classes.greeting}>
                Hello Marissa
              </Title>
            </Stack>
            <Stack gap="xs" align="center">
              <Title order={1} ta="center" className={classes.subtitle}>
                Something Special Awaits You. ❤️
              </Title>
            </Stack>

            <Box
              w="100%"
              className={classes.checkboxRow}
              data-checked={String(checked)}
              onClick={() => {
                const fakeEvent = {
                  currentTarget: { checked: !checked },
                } as React.ChangeEvent<HTMLInputElement>;
                handleCheck(fakeEvent);
              }}>
              <Checkbox
                checked={checked}
                onChange={handleCheck}
                color="valentine"
                size="md"
                styles={{ input: { cursor: "pointer" } }}
              />
              <Text size="sm" fw={500} className={classes.checkboxLabel}>
                I confirm that I am a certified Gmail Guzzler
              </Text>
            </Box>

            <AnimatePresence>
              {showCaptcha && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}>
                  <CaptchaGrid onSuccess={handleCaptchaSuccess} />
                </motion.div>
              )}
            </AnimatePresence>

            <Text size="xs" ta="center" maw={300} style={{ color: "var(--color-text-dimmed)" }}>
              This site is protected by advanced Gmail Guzzler detection technology
            </Text>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
