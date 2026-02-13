import { useState, useEffect } from "react";
import { Group, Text } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { getProgress, type ChallengeKey } from "../lib/progress";
import classes from "./HeartTracker.module.css";

const CHALLENGES: { key: ChallengeKey; label: string }[] = [
  { key: "scavengerHunt", label: "Scavenger Hunt" },
  { key: "photoMemory", label: "Photo Memory" },
  { key: "timeline", label: "Timeline" },
  { key: "loveLetter", label: "Love Letter" },
];

interface HeartTrackerProps {
  refreshKey?: number;
  /** When set, this heart will play a dramatic "receive" animation */
  justCompletedKey?: ChallengeKey;
}

export function HeartTracker({ refreshKey, justCompletedKey }: HeartTrackerProps) {
  const progress = getProgress();
  void refreshKey;

  const completedCount = Object.values(progress).filter(Boolean).length;

  // Delay showing the just-completed heart so the celebration plays first
  const [receivedKey, setReceivedKey] = useState<ChallengeKey | null>(null);

  useEffect(() => {
    if (!justCompletedKey) return;
    // Wait for the celebration animation, then trigger the receive
    const timer = setTimeout(() => {
      setReceivedKey(justCompletedKey);
    }, 600);
    return () => clearTimeout(timer);
  }, [justCompletedKey]);

  return (
    <div className={classes.container}>
      <Group justify="center" gap="lg" mb={4}>
        {CHALLENGES.map((challenge) => {
          const filled = progress[challenge.key];
          const isReceiving = challenge.key === justCompletedKey;
          const hasReceived = challenge.key === receivedKey;

          // For hearts being received: show filled only after animation starts
          // For other hearts: show their saved state
          const showFilled = isReceiving ? hasReceived : filled;

          return (
            <div key={challenge.key} className={classes.heartItem}>
              {/* Glow backdrop when receiving */}
              <AnimatePresence>
                {isReceiving && hasReceived && (
                  <motion.div
                    className={classes.heartGlow}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 2.5, 0], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              {/* Sparkle ring when receiving */}
              <AnimatePresence>
                {isReceiving && hasReceived && (
                  <>
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <motion.div
                        key={angle}
                        className={classes.sparkle}
                        initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          x: Math.cos((angle * Math.PI) / 180) * 28,
                          y: Math.sin((angle * Math.PI) / 180) * 28,
                        }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* The heart itself */}
              <motion.div
                initial={false}
                animate={
                  isReceiving && hasReceived
                    ? {
                        scale: [0.3, 1.8, 0.9, 1.3, 1],
                        rotate: [0, -15, 15, -8, 0],
                      }
                    : showFilled
                      ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }
                      : { scale: 1 }
                }
                transition={
                  isReceiving && hasReceived
                    ? { duration: 0.7, ease: "easeOut" }
                    : { duration: 0.5 }
                }
              >
                <span
                  className={classes.heartEmoji}
                  data-filled={String(showFilled)}
                  data-receiving={String(isReceiving && hasReceived)}
                >
                  {showFilled ? "❤️" : "🤍"}
                </span>
              </motion.div>
            </div>
          );
        })}
      </Group>
      <Text size="sm" mt={4} className={classes.statusText}>
        {completedCount} of 4 hearts collected
      </Text>
    </div>
  );
}
