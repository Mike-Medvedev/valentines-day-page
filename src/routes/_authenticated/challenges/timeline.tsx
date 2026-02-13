import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Card, Stack, Text, Title, Button } from "@mantine/core";
import { motion } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { HeartCelebration } from "../../../components/HeartCelebration";
import { ScratchCard } from "../../../components/ScratchCard";
import { completeChallenge, getProgress } from "../../../lib/progress";
import shared from "./shared.module.css";

export const Route = createFileRoute("/_authenticated/challenges/timeline")({
  component: TimelinePage,
});

const TIMELINE_ITEMS = [
  {
    quote: '"The moment I knew you were different..."',
    date: "First Meeting",
    photo: "https://placehold.co/400x300/ffe7e7/ff0309?text=Memory+1",
  },
  {
    quote: '"I never thought I could laugh this hard with someone."',
    date: "Three Months In",
    photo: "https://placehold.co/400x300/ffe7e7/ff0309?text=Memory+2",
  },
  {
    quote: '"Home is wherever you are."',
    date: "Our Favorite Day",
    photo: "https://placehold.co/400x300/ffe7e7/ff0309?text=Memory+3",
  },
];

function TimelinePage() {
  const progress = getProgress();
  const alreadyComplete = progress.timeline;

  const [revealedCount, setRevealedCount] = useState(0);
  const [completed, setCompleted] = useState(alreadyComplete);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReveal = () => {
    const newCount = revealedCount + 1;
    setRevealedCount(newCount);
    if (newCount >= TIMELINE_ITEMS.length) {
      completeChallenge("timeline");
      setCompleted(true);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Stack gap="xl" py="lg">
        <Box>
          <Button
            component={Link}
            to="/challenges"
            variant="light"
            color="valentine"
            size="sm"
            leftSection="←"
          >
            Back to Challenges
          </Button>
        </Box>

        <HeartTracker refreshKey={refreshKey} justCompletedKey={!alreadyComplete && completed ? "timeline" : undefined} />

        <Stack gap="xs" align="center">
          <Text className={shared.pageIcon}>✨</Text>
          <Title order={2} ta="center" className={shared.pageTitle}>
            Our Timeline
          </Title>
          <Text size="sm" ta="center" maw={400} style={{ color: "var(--color-text-dimmed)" }}>
            Scratch each card to reveal the memory behind the words
          </Text>
        </Stack>

        {!completed ? (
          <Stack gap="lg">
            {TIMELINE_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                <Card p={{ base: "md", sm: "xl" }} radius="lg" className={shared.glassCard}>
                  <Stack gap="md">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600} className={shared.letterSpaced}>
                      {item.date}
                    </Text>
                    <Text size="xl" fw={600} fs="italic" className={shared.questionText}>
                      {item.quote}
                    </Text>
                    <Box className={shared.imageWrapper}>
                      <ScratchCard imageSrc={item.photo} width={400} height={280} onReveal={handleReveal} />
                    </Box>
                  </Stack>
                </Card>
              </motion.div>
            ))}
          </Stack>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Card p={{ base: "md", sm: "xl" }} radius="lg" ta="center" className={shared.completedCard}>
              <Stack gap="md" align="center">
                <HeartCelebration animate={!alreadyComplete} />
                <Title order={3} className={shared.completedTitle}>Heart Earned!</Title>
                <Text style={{ color: "var(--color-text-dimmed)" }}>Every moment with you is worth remembering</Text>
                <Button component={Link} to="/challenges" color="valentine" variant="light" mt="sm">
                  Back to Challenges
                </Button>
              </Stack>
            </Card>
          </motion.div>
        )}
      </Stack>
    </motion.div>
  );
}
