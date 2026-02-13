import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Box,
  Card,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Button,
  Badge,
} from "@mantine/core";
import { motion } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { getProgress, isAllComplete, type ChallengeKey } from "../../../lib/progress";

export const Route = createFileRoute("/_authenticated/challenges/")({
  component: ChallengeHub,
});

interface ChallengeInfo {
  key: ChallengeKey;
  title: string;
  description: string;
  icon: string;
  route: string;
}

const CHALLENGES: ChallengeInfo[] = [
  {
    key: "scavengerHunt",
    title: "Scavenger Hunt",
    description:
      "Dig through our emails and texts to answer these questions about us",
    icon: "🔍",
    route: "/challenges/scavenger-hunt",
  },
  {
    key: "photoMemory",
    title: "Photo Memory",
    description:
      "How well do you remember our moments? Answer questions about our photos",
    icon: "📸",
    route: "/challenges/photo-memory",
  },
  {
    key: "timeline",
    title: "Our Timeline",
    description:
      "Read quotes from our journey and scratch to reveal the memories",
    icon: "✨",
    route: "/challenges/timeline",
  },
  {
    key: "loveLetter",
    title: "Love Letter",
    description: "A letter from my heart to yours. Read it to claim this heart",
    icon: "💌",
    route: "/challenges/love-letter",
  },
];

function ChallengeHub() {
  const [refreshKey] = useState(0);
  const progress = getProgress();
  const allComplete = isAllComplete();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Stack gap="xl" py="lg">
        <Stack gap="xs" align="center">
          <Title
            order={2}
            ta="center"
            style={{ color: "#3d0d0d", lineHeight: 1.2 }}
          >
            Your Journey Awaits
          </Title>
          <Text size="md" c="dimmed" ta="center" maw={400}>
            Complete each challenge to collect hearts and unlock a special
            surprise
          </Text>
        </Stack>

        <HeartTracker refreshKey={refreshKey} />

        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing="md"
          mt="sm"
        >
          {CHALLENGES.map((challenge, i) => {
            const completed = progress[challenge.key];
            return (
              <motion.div
                key={challenge.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card
                  component={Link}
                  to={challenge.route}
                  p="xl"
                  radius="lg"
                  style={{
                    background: completed
                      ? "linear-gradient(135deg, #ffe7e7, #ffcece)"
                      : "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(8px)",
                    border: completed
                      ? "2px solid #ff9a9b"
                      : "1px solid rgba(255, 206, 206, 0.6)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  styles={{
                    root: {
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 24px rgba(255, 3, 9, 0.12)",
                      },
                    },
                  }}
                >
                  {completed && (
                    <Badge
                      color="valentine"
                      variant="filled"
                      size="sm"
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                      }}
                    >
                      Complete
                    </Badge>
                  )}
                  <Stack gap="sm">
                    <Text style={{ fontSize: 36 }}>{challenge.icon}</Text>
                    <div>
                      <Text
                        fw={700}
                        size="lg"
                        style={{
                          fontFamily:
                            '"Playfair Display", Georgia, serif',
                          color: "#3d0d0d",
                        }}
                      >
                        {challenge.title}
                      </Text>
                      <Text size="sm" c="dimmed" mt={4}>
                        {challenge.description}
                      </Text>
                    </div>
                  </Stack>
                </Card>
              </motion.div>
            );
          })}
        </SimpleGrid>

        {allComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Box ta="center" mt="md">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 3, 9, 0.2)",
                    "0 0 40px rgba(255, 3, 9, 0.4)",
                    "0 0 20px rgba(255, 3, 9, 0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ display: "inline-block", borderRadius: 999 }}
              >
                <Button
                  component={Link}
                  to="/finale"
                  size="xl"
                  color="valentine"
                  radius="xl"
                  px={48}
                  style={{
                    fontSize: 18,
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  Unlock Your Surprise
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </Stack>
    </motion.div>
  );
}
