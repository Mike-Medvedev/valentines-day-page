import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Box,
  Card,
  Stack,
  Text,
  Title,
  Button,
  ActionIcon,
} from "@mantine/core";
import { motion } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { ScratchCard } from "../../../components/ScratchCard";
import { completeChallenge, getProgress } from "../../../lib/progress";

export const Route = createFileRoute("/_authenticated/challenges/timeline")({
  component: TimelinePage,
});

// Replace with your real quotes and photos!
const TIMELINE_ITEMS = [
  {
    quote: '"The moment I knew you were different..."',
    date: "First Meeting",
    photo: "https://placehold.co/400x300/F5E6E0/BE3455?text=Memory+1",
  },
  {
    quote: '"I never thought I could laugh this hard with someone."',
    date: "Three Months In",
    photo: "https://placehold.co/400x300/F5E6E0/BE3455?text=Memory+2",
  },
  {
    quote: '"Home is wherever you are."',
    date: "Our Favorite Day",
    photo: "https://placehold.co/400x300/F5E6E0/BE3455?text=Memory+3",
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Stack gap="xl" py="lg">
        <Box>
          <ActionIcon
            component={Link}
            to="/challenges"
            variant="subtle"
            color="gray"
            size="lg"
            mb="sm"
          >
            ←
          </ActionIcon>
        </Box>

        <HeartTracker refreshKey={refreshKey} />

        <Stack gap="xs" align="center">
          <Text style={{ fontSize: 40 }}>✨</Text>
          <Title order={2} ta="center" style={{ color: "#2C1810" }}>
            Our Timeline
          </Title>
          <Text size="sm" c="dimmed" ta="center" maw={400}>
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
                <Card
                  p="xl"
                  radius="lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Stack gap="md">
                    <Text
                      size="xs"
                      c="dimmed"
                      tt="uppercase"
                      fw={600}
                      style={{ letterSpacing: "0.08em" }}
                    >
                      {item.date}
                    </Text>
                    <Text
                      size="xl"
                      fw={600}
                      fs="italic"
                      style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        color: "#2C1810",
                      }}
                    >
                      {item.quote}
                    </Text>
                    <Box style={{ borderRadius: 12, overflow: "hidden" }}>
                      <ScratchCard
                        imageSrc={item.photo}
                        width={400}
                        height={280}
                        onReveal={handleReveal}
                      />
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
            <Card
              p="xl"
              radius="lg"
              ta="center"
              style={{
                background: "linear-gradient(135deg, #FFF8F0, #FFF0F3)",
              }}
            >
              <Stack gap="md" align="center">
                <Text style={{ fontSize: 48 }}>❤️</Text>
                <Title order={3} style={{ color: "#2C1810" }}>
                  Heart Earned!
                </Title>
                <Text c="dimmed">
                  Every moment with you is worth remembering
                </Text>
                <Button
                  component={Link}
                  to="/challenges"
                  color="rose"
                  variant="light"
                  mt="sm"
                >
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
