import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Card,
  Checkbox,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { CaptchaGrid } from "../components/CaptchaGrid";
import { generateAuthToken, isAuthenticated } from "../lib/auth";

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
    <Box
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <Container size={420}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Stack gap="xl" align="center">
            <Stack gap="xs" align="center">
              <Title
                order={1}
                ta="center"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                  color: "#2C1810",
                  lineHeight: 1.2,
                }}
              >
                Something Special
                <br />
                Awaits You
              </Title>
              <Text
                size="lg"
                c="dimmed"
                ta="center"
                style={{ color: "#6B5B4F" }}
              >
                But first, we need to verify something...
              </Text>
            </Stack>

            <Card
              p="xl"
              radius="lg"
              w="100%"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Stack gap="lg">
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #e8ddd6",
                    background: checked ? "#FFF0F3" : "#FAFAF8",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const fakeEvent = {
                      currentTarget: { checked: !checked },
                    } as React.ChangeEvent<HTMLInputElement>;
                    handleCheck(fakeEvent);
                  }}
                >
                  <Checkbox
                    checked={checked}
                    onChange={handleCheck}
                    color="rose"
                    size="md"
                    styles={{
                      input: {
                        cursor: "pointer",
                      },
                    }}
                  />
                  <Text
                    size="sm"
                    fw={500}
                    style={{ color: "#2C1810", userSelect: "none" }}
                  >
                    I confirm that I am a certified Gmail Guzzler
                  </Text>
                </Box>

                <AnimatePresence>
                  {showCaptcha && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <CaptchaGrid onSuccess={handleCaptchaSuccess} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>
            </Card>

            <Text size="xs" c="dimmed" ta="center" maw={300}>
              This site is protected by advanced Gmail Guzzler detection
              technology
            </Text>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
