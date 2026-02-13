import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, Stack, Text, Title, Image, SimpleGrid, Progress, Box } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { HeartCelebration } from "../../../components/HeartCelebration";
import { completeChallenge, getProgress } from "../../../lib/progress";
import shared from "./shared.module.css";

export const Route = createFileRoute("/_authenticated/challenges/photo-memory")({
  component: PhotoMemory,
});

const PHOTO_QUESTIONS = [
  {
    photo: "https://placehold.co/600x400/ffe7e7/ff0309?text=Our+Photo+1",
    question: "Where was this photo taken?",
    options: ["The park", "The beach", "The restaurant", "At home"],
    correctIndex: 1,
  },
  {
    photo: "https://placehold.co/600x400/ffe7e7/ff0309?text=Our+Photo+2",
    question: "What were we celebrating in this photo?",
    options: ["Birthday", "Anniversary", "Just because", "New Year"],
    correctIndex: 2,
  },
  {
    photo: "https://placehold.co/600x400/ffe7e7/ff0309?text=Our+Photo+3",
    question: "Who took this photo?",
    options: ["You", "Me", "A stranger", "Timer"],
    correctIndex: 3,
  },
];

function PhotoMemory() {
  const progress = getProgress();
  const alreadyComplete = progress.photoMemory;

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(alreadyComplete);
  const [refreshKey, setRefreshKey] = useState(0);

  const isCorrect = selectedOption === PHOTO_QUESTIONS[currentQ]?.correctIndex;

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);

    setTimeout(() => {
      if (index === PHOTO_QUESTIONS[currentQ].correctIndex) {
        if (currentQ < PHOTO_QUESTIONS.length - 1) {
          setCurrentQ((prev) => prev + 1);
          setSelectedOption(null);
          setShowResult(false);
        } else {
          completeChallenge("photoMemory");
          setCompleted(true);
          setRefreshKey((k) => k + 1);
        }
      } else {
        setSelectedOption(null);
        setShowResult(false);
      }
    }, 1200);
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

        <HeartTracker refreshKey={refreshKey} justCompletedKey={!alreadyComplete && completed ? "photoMemory" : undefined} />

        <Stack gap="xs" align="center">
          <Text className={shared.pageIcon}>📸</Text>
          <Title order={2} ta="center" className={shared.pageTitle}>
            Photo Memory
          </Title>
          <Text size="sm" ta="center" maw={400} style={{ color: "var(--color-text-dimmed)" }}>
            How well do you remember our moments together?
          </Text>
        </Stack>

        {!completed ? (
          <>
            <Progress
              value={(currentQ / PHOTO_QUESTIONS.length) * 100}
              color="valentine"
              size="sm"
              radius="xl"
              animated
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card p={{ base: "md", sm: "xl" }} radius="lg" className={shared.glassCard}>
                  <Stack gap="md">
                    <Text size="xs" c="dimmed">
                      Question {currentQ + 1} of {PHOTO_QUESTIONS.length}
                    </Text>

                    <Box className={shared.imageWrapper}>
                      <Image
                        src={PHOTO_QUESTIONS[currentQ].photo}
                        alt="Memory photo"
                        w="100%"
                        fit="cover"
                        radius="md"
                        style={{ aspectRatio: "3/2" }}
                      />
                    </Box>

                    <Text fw={600} size="lg" className={shared.questionText}>
                      {PHOTO_QUESTIONS[currentQ].question}
                    </Text>

                    <SimpleGrid cols={2} spacing="sm">
                      {PHOTO_QUESTIONS[currentQ].options.map((option, idx) => {
                        let bg = "rgba(255, 255, 255, 0.9)";
                        let borderColor = "var(--mantine-color-valentine-1)";

                        if (showResult && selectedOption === idx) {
                          if (isCorrect) {
                            bg = "#E8F5E9";
                            borderColor = "#66BB6A";
                          } else {
                            bg = "#FFEBEE";
                            borderColor = "#EF5350";
                          }
                        }

                        return (
                          <motion.div key={idx} whileTap={{ scale: 0.97 }}>
                            <Button
                              variant="default"
                              fullWidth
                              h="auto"
                              py="sm"
                              onClick={() => handleSelect(idx)}
                              disabled={showResult}
                              className={shared.optionButton}
                              style={{ background: bg, borderColor }}
                            >
                              {option}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </SimpleGrid>

                    <AnimatePresence>
                      {showResult && !isCorrect && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Text size="sm" c="red" ta="center">Hmm, not that one! Think harder...</Text>
                        </motion.div>
                      )}
                      {showResult && isCorrect && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Text size="sm" c="green" ta="center" fw={600}>That's right!</Text>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Stack>
                </Card>
              </motion.div>
            </AnimatePresence>
          </>
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
                <Text style={{ color: "var(--color-text-dimmed)" }}>Your memory of us is as strong as my love for you!</Text>
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
