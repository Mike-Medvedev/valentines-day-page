import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Card, SimpleGrid, Stack, Text, Title, Button, Badge } from "@mantine/core";
import { motion } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { getProgress, isAllComplete, type ChallengeKey } from "../../../lib/progress";
import classes from "./index.module.css";

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
    description: "Dig through our emails and texts to answer these questions about us",
    icon: "🔍",
    route: "/challenges/scavenger-hunt",
  },
  {
    key: "photoMemory",
    title: "Photo Memory",
    description: "How well do you remember our moments? Answer questions about our photos",
    icon: "📸",
    route: "/challenges/photo-memory",
  },
  {
    key: "timeline",
    title: "Our Timeline",
    description: "Read quotes from our journey and scratch to reveal the memories",
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Stack gap="xl" py="lg">
        <Stack gap="xs" align="center">
          <Title order={2} ta="center" className={classes.pageTitle}>
            Your Journey Awaits
          </Title>
          <Text size="md" ta="center" maw={400} className={classes.subtitle}>
            Complete each challenge to collect hearts and unlock a special surprise
          </Text>
        </Stack>

        <HeartTracker refreshKey={refreshKey} />

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="sm">
          {CHALLENGES.map((challenge, i) => {
            const completed = progress[challenge.key];
            return (
              <motion.div
                key={challenge.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ height: "100%" }}
              >
                <Card
                  component={Link}
                  to={challenge.route}
                  p={{ base: "md", sm: "xl" }}
                  radius="lg"
                  className={classes.challengeCard}
                  data-completed={String(!!completed)}
                  h="100%"
                >
                  {completed && (
                    <Badge color="valentine" variant="filled" size="sm" className={classes.completeBadge}>
                      Complete
                    </Badge>
                  )}
                  <Stack gap="sm">
                    <Text className={classes.challengeIcon}>{challenge.icon}</Text>
                    <div>
                      <Text fw={700} size="lg" className={classes.challengeTitle}>
                        {challenge.title}
                      </Text>
                      <Text size="sm" mt={4} className={classes.cardDescription}>
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
                    `0 0 20px rgba(255, 3, 9, 0.2)`,
                    `0 0 40px rgba(255, 3, 9, 0.4)`,
                    `0 0 20px rgba(255, 3, 9, 0.2)`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={classes.glowWrap}
              >
                <Button
                  component={Link}
                  to="/finale"
                  size="lg"
                  color="valentine"
                  radius="xl"
                  px={32}
                  className={classes.unlockButton}
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
