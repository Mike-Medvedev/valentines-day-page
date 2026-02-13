import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Card, Stack, Text, Title, Button, Group } from "@mantine/core";
import { motion } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { HeartCelebration } from "../../../components/HeartCelebration";
import { useProgress } from "../../../lib/ProgressContext";
import shared from "./shared.module.css";

export const Route = createFileRoute("/_authenticated/challenges/love-letter")({
  component: LoveLetter,
});

const LETTER_PARAGRAPHS = [
  "Dear Baby,",
  "Happy Valentines day :) There are so many things I want to tell you, but words are not enough. You changed my life in so many ways and I hope this special day shows you my appreciation for you",
  "You take up most of my thoughts throughout the days and nights and your happiness is all I ever want to achieve. I know I sometimes dont listen and make you upset but I promise my intentions are and have always been good",
  "Goofing off and having a silly time with you is the best possible feeling I've ever had and I hope we have many more of those moments",
  "I know I don't always show it perfectly, but I love you so much and cannot wait to move across the country and start a new life with you",
  "So here I am, putting it in writing so you can never say I didn't tell you:",
  "You are my favorite person. My best friend. My home.",
  "Mike,\nYours forever ❤️",
];

function LoveLetter() {
  const { progress, completeChallenge } = useProgress();
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
            leftSection="←">
            Back to Challenges
          </Button>
        </Box>

        <HeartTracker
          refreshKey={refreshKey}
          justCompletedKey={!alreadyComplete && completed ? "loveLetter" : undefined}
        />

        <Group gap="sm" justify="center">
          <Text className={shared.pageIcon}>💌</Text>
          <Title order={2} className={shared.pageTitle}>
            A Letter For You
          </Title>
        </Group>

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
                  }}>
                  <Text
                    size={i === 0 || i === LETTER_PARAGRAPHS.length - 1 ? "lg" : "md"}
                    fw={i === 0 ? 600 : 400}
                    className={shared.letterText}
                    style={{
                      fontFamily:
                        i === 0 || i >= LETTER_PARAGRAPHS.length - 2
                          ? "var(--mantine-font-family-headings)"
                          : undefined,
                    }}>
                    {paragraph}
                  </Text>
                </motion.div>
              ))}

              <div ref={endRef} />

              {hasScrolledToEnd && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}>
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
            transition={{ duration: 0.5, type: "spring" }}>
            <Card
              p={{ base: "md", sm: "xl" }}
              radius="lg"
              ta="center"
              className={shared.completedCard}>
              <Stack gap="md" align="center">
                <HeartCelebration animate={!alreadyComplete} />
                <Title order={3} className={shared.completedTitle}>
                  Heart Earned!
                </Title>
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
