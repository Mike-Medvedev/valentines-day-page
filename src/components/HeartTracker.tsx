import { Group, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { getProgress, type ChallengeKey } from "../lib/progress";

const CHALLENGES: { key: ChallengeKey; label: string }[] = [
  { key: "scavengerHunt", label: "Scavenger Hunt" },
  { key: "photoMemory", label: "Photo Memory" },
  { key: "timeline", label: "Timeline" },
  { key: "loveLetter", label: "Love Letter" },
];

interface HeartTrackerProps {
  refreshKey?: number;
}

export function HeartTracker({ refreshKey }: HeartTrackerProps) {
  const progress = getProgress();
  // refreshKey forces re-read from localStorage on state change
  void refreshKey;

  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <div style={{ textAlign: "center" }}>
      <Group justify="center" gap="lg" mb={4}>
        {CHALLENGES.map((challenge, i) => {
          const filled = progress[challenge.key];
          return (
            <motion.div
              key={challenge.key}
              initial={false}
              animate={
                filled
                  ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.5, delay: filled ? i * 0.1 : 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <span
                style={{
                  fontSize: 32,
                  filter: filled ? "none" : "grayscale(1) opacity(0.3)",
                  transition: "filter 0.4s ease",
                }}
              >
                {filled ? "❤️" : "🤍"}
              </span>
            </motion.div>
          );
        })}
      </Group>
      <Text size="sm" c="dimmed" mt={4}>
        {completedCount} of 4 hearts collected
      </Text>
    </div>
  );
}
