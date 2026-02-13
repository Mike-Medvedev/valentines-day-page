import { useState, useCallback } from "react";
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Box, Button, Stack, Text, Title, Card } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { isAllComplete } from "../../lib/progress";

export const Route = createFileRoute("/_authenticated/finale")({
  beforeLoad: () => {
    if (!isAllComplete()) {
      throw redirect({ to: "/challenges" });
    }
  },
  component: FinalePage,
});

function FinalePage() {
  const [answered, setAnswered] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const { width: windowWidth, height: windowHeight } = useViewportSize();

  const dodgeNo = useCallback(() => {
    const maxX = 200;
    const maxY = 150;
    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;
    setNoPosition({ x: randomX, y: randomY });
  }, []);

  const handleYes = () => {
    setAnswered(true);
  };

  return (
    <Box
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        position: "relative",
      }}
    >
      {answered && (
        <ReactConfetti
          width={windowWidth}
          height={windowHeight}
          recycle={true}
          numberOfPieces={300}
          colors={["#ff3334", "#ff6465", "#ff9a9b", "#ffcece", "#ff0309", "#cc0000"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}
        />
      )}

      {!answered ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          <Card
            p="xl"
            radius="lg"
            ta="center"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Stack gap="xl" align="center">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Text style={{ fontSize: 64 }}>💝</Text>
              </motion.div>

              <Stack gap="xs">
                <Title
                  order={1}
                  style={{
                    color: "#3d0d0d",
                    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                    lineHeight: 1.3,
                  }}
                >
                  Will You Be
                  <br />
                  My Valentine?
                </Title>
                <Text c="dimmed" size="md">
                  You've proven your love through every challenge.
                  <br />
                  Now there's just one question left...
                </Text>
              </Stack>

              <Box
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  minHeight: 60,
                  width: "100%",
                }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="xl"
                    color="valentine"
                    px={48}
                    onClick={handleYes}
                    style={{
                      fontSize: 18,
                      fontFamily: '"Playfair Display", Georgia, serif',
                    }}
                  >
                    Yes!
                  </Button>
                </motion.div>

                <motion.div
                  animate={{ x: noPosition.x, y: noPosition.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  onHoverStart={dodgeNo}
                  style={{ position: "relative" }}
                >
                  <Button
                    size="md"
                    variant="subtle"
                    color="gray"
                    onClick={dodgeNo}
                    onMouseEnter={dodgeNo}
                    onTouchStart={dodgeNo}
                    style={{ fontSize: 14, opacity: 0.6 }}
                  >
                    No
                  </Button>
                </motion.div>
              </Box>
            </Stack>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%", maxWidth: 480, zIndex: 1001 }}
        >
          <Card
            p="xl"
            radius="lg"
            ta="center"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Stack gap="lg" align="center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              >
                <Text style={{ fontSize: 80 }}>🥰</Text>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Stack gap="md">
                  <Title
                    order={1}
                    style={{
                      color: "#ff0309",
                      fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                    }}
                  >
                    I Knew You'd Say Yes!
                  </Title>
                  <Text
                    size="lg"
                    style={{
                      color: "#3d0d0d",
                      lineHeight: 1.8,
                      fontFamily: '"Playfair Display", Georgia, serif',
                    }}
                  >
                    You've made me the happiest person in the world.
                    <br />
                    Happy Valentine's Day, my love.
                  </Text>
                  <Text size="md" c="dimmed" mt="sm">
                    Now close this and come give me a hug 🤗
                  </Text>
                </Stack>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <Button
                  component={Link}
                  to="/challenges"
                  variant="subtle"
                  color="valentine"
                  size="sm"
                  mt="md"
                >
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
