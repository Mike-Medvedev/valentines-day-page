import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Box, Button, Group, Image, Stack, Text, Title, Card } from "@mantine/core";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { valentine } from "../../theme";
import { isAllComplete } from "../../lib/progress";
import classes from "./finale.module.css";

import bestPhoto from "../../assets/photos/best-photo.jpg";

export const Route = createFileRoute("/_authenticated/finale")({
  beforeLoad: () => {
    if (!isAllComplete()) {
      throw redirect({ to: "/challenges" });
    }
  },
  component: FinalePage,
});

const CONFETTI_COLORS = [
  valentine[4],
  valentine[3],
  valentine[2],
  valentine[1],
  valentine[6],
  valentine[8],
];

function getViewportSize() {
  if (typeof window === "undefined") return { width: 1920, height: 1080 };
  return { width: window.innerWidth, height: window.innerHeight };
}

function FinalePage() {
  const [answered, setAnswered] = useState(false);
  const [viewportSize, setViewportSize] = useState(getViewportSize);

  useEffect(() => {
    const update = () => setViewportSize(getViewportSize());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Re-measure when confetti appears (useViewportSize can return 0 before paint)
  useEffect(() => {
    if (answered) {
      const id = requestAnimationFrame(() => setViewportSize(getViewportSize()));
      return () => cancelAnimationFrame(id);
    }
  }, [answered]);

  const handleYes = () => setAnswered(true);

  return (
    <Box className={classes.pageWrapper}>
      {answered &&
        createPortal(
          <ReactConfetti
            width={viewportSize.width}
            height={viewportSize.height}
            recycle
            numberOfPieces={300}
            colors={CONFETTI_COLORS}
            className={classes.confetti}
          />,
          document.body
        )}

      {!answered ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className={classes.questionCard}>
          <Card p={{ base: "lg", sm: "xl" }} radius="lg" ta="center" className={classes.glassCard}>
            <Stack gap="xl" align="center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
                <Image
                  src={bestPhoto}
                  alt="Us"
                  w={120}
                  h={120}
                  radius="xl"
                  fit="cover"
                  className={classes.photoImage}
                />
              </motion.div>

              <Stack gap="xs">
                <Title order={1} className={classes.questionTitle}>
                  Will You Be
                  <br />
                  My Valentine?
                </Title>
              </Stack>

              <Group gap="md" justify="center" wrap="wrap">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    color="valentine"
                    px={32}
                    onClick={handleYes}
                    className={classes.yesButton}>
                    Yes!
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    color="valentine"
                    px={32}
                    onClick={handleYes}
                    className={classes.yesButton}>
                    Yes!
                  </Button>
                </motion.div>
              </Group>
            </Stack>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={classes.answerCard}>
          <Card
            p={{ base: "lg", sm: "xl" }}
            radius="lg"
            ta="center"
            className={classes.glassCardStrong}>
            <Stack gap="lg" align="center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}>
                <Text className={classes.celebrationEmoji}>🥰</Text>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}>
                <Stack gap="md">
                  <Title order={1} className={classes.yesTitle}>
                    I Knew You'd Say Yes!
                  </Title>
                  <Text size="lg" className={classes.messageText}>
                    You've made me the happiest person in the world.
                    <br />
                    Happy Valentine's Day, my love.
                  </Text>
                  <Text size="md" mt="sm" style={{ color: "var(--color-text-dimmed)" }}>
                    Now close this and come give me a hug 🤗
                  </Text>
                </Stack>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}>
                <Button
                  component={Link}
                  to="/challenges"
                  variant="subtle"
                  color="valentine"
                  size="sm"
                  mt="md">
                  Back to our memories
                </Button>
              </motion.div>
            </Stack>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}
