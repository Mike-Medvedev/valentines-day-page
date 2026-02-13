import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Card, SimpleGrid, Stack, Text, Title, Button, Badge } from "@mantine/core";
import { motion } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { useProgress } from "../../../lib/ProgressContext";
import type { ChallengeKey } from "../../../lib/progress";
import classes from "./index.module.css";

export const Route = createFileRoute("/_authenticated/challenges/")({
  component: ChallengeHub,
});

interface ChallengeInfo {
  key: ChallengeKey;
  title: string;
  icon: string;
  route: string;
}

const CHALLENGES: ChallengeInfo[] = [
  { key: "scavengerHunt", title: "Scavenger Hunt", icon: "🔍", route: "/challenges/scavenger-hunt" },
  { key: "photoMemory", title: "Photo Memory", icon: "📸", route: "/challenges/photo-memory" },
  { key: "timeline", title: "Our Timeline", icon: "✨", route: "/challenges/timeline" },
  { key: "loveLetter", title: "Love Letter", icon: "💌", route: "/challenges/love-letter" },
];

function ChallengeHub() {
  const [refreshKey] = useState(0);
  const { progress, isAllComplete } = useProgress();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Stack gap="xl" py="lg">
        <Stack gap="xs" align="center">
          <Title order={2} ta="center" className={classes.pageTitle}>
            Your Journey Awaits
          </Title>
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
                  <Stack gap="sm" align="center">
                    <Text className={classes.challengeIcon}>{challenge.icon}</Text>
                    <Text fw={700} size="lg" ta="center" className={classes.challengeTitle}>
                      {challenge.title}
                    </Text>
                  </Stack>
                </Card>
              </motion.div>
            );
          })}
        </SimpleGrid>

        {isAllComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Box ta="center" mt="md">
              <Button
                component={Link}
                to="/finale"
                size="lg"
                color="valentine"
                radius="xl"
                px={32}
                rightSection="🤍"
              >
                Unlock Your Surprise
              </Button>
            </Box>
          </motion.div>
        )}
      </Stack>
    </motion.div>
  );
}
