import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Card, Stack, Text, Title, Button } from "@mantine/core";
import { motion } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { HeartCelebration } from "../../../components/HeartCelebration";
import { completeChallenge, getProgress } from "../../../lib/progress";
import shared from "./shared.module.css";

export const Route = createFileRoute("/_authenticated/challenges/love-letter")({
  component: LoveLetter,
});

const LETTER_PARAGRAPHS = [
  "My dearest,",
  "There are so many things I want to tell you, and yet words never feel like enough. From the moment you walked into my life, everything changed — not in some dramatic, movie-style way, but in the quiet way that matters most.",
  "You taught me that love isn't just about the big gestures. It's in the way you laugh at my terrible jokes. It's in the texts you send me when you see something that reminds you of me. It's in the comfortable silences we share.",
  "Every day with you feels like unwrapping a gift I didn't know I was waiting for. You make the ordinary extraordinary, and I am endlessly grateful for that.",
  "I know I don't always say it perfectly, and sometimes I forget to say it at all — but you are the best thing that has ever happened to me. Period.",
  "So here I am, putting it in writing so you can never say I didn't tell you:",
  "You are my favorite person. My best friend. My home.",
  "With all my love,\nYours forever ❤️",
];

function LoveLetter() {
  const progress = getProgress();
  const alreadyComplete = progress.loveLetter;

  const [completed, setCompleted] = useState(alreadyComplete);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const handleAcknowledge = () => {
    completeChallenge("loveLetter");
    setCompleted(true);
    setRefreshKey((k) => k + 1);
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

        <HeartTracker refreshKey={refreshKey} justCompletedKey={!alreadyComplete && completed ? "loveLetter" : undefined} />

        <Stack gap="xs" align="center">
          <Text className={shared.pageIcon}>💌</Text>
          <Title order={2} ta="center" className={shared.pageTitle}>
            A Letter For You
          </Title>
          <Text size="sm" ta="center" maw={400} style={{ color: "var(--color-text-dimmed)" }}>
            Read it with your whole heart
          </Text>
        </Stack>

        {!completed ? (
          <Card p={{ base: "md", sm: "xl" }} radius="lg" className={shared.letterCard}>
            <Stack gap="lg">
              {LETTER_PARAGRAPHS.map((paragraph, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.3, duration: 0.5 }}
                  onAnimationComplete={() => {
                    if (i === LETTER_PARAGRAPHS.length - 1) setHasScrolledToEnd(true);
                  }}
                >
                  <Text
                    size={i === 0 || i === LETTER_PARAGRAPHS.length - 1 ? "lg" : "md"}
                    fw={i === 0 ? 600 : 400}
                    className={shared.letterText}
                    style={{
                      fontFamily:
                        i === 0 || i >= LETTER_PARAGRAPHS.length - 2
                          ? "var(--mantine-font-family-headings)"
                          : undefined,
                    }}
                  >
                    {paragraph}
                  </Text>
                </motion.div>
              ))}

              <div ref={endRef} />

              {hasScrolledToEnd && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Box ta="center" mt="md">
                    <Button color="valentine" size="md" onClick={handleAcknowledge}>
                      I read every word ❤️
                    </Button>
                  </Box>
                </motion.div>
              )}
            </Stack>
          </Card>
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
                <Text style={{ color: "var(--color-text-dimmed)" }}>Thank you for reading my heart out</Text>
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
