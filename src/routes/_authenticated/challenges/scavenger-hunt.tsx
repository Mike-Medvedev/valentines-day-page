import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Button,
  Card,
  Stack,
  Text,
  TextInput,
  Title,
  Progress,
  Box,
  ActionIcon,
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { completeChallenge, getProgress } from "../../../lib/progress";

export const Route = createFileRoute(
  "/_authenticated/challenges/scavenger-hunt",
)({
  component: ScavengerHunt,
});

// Replace these with real questions and answers!
// Answers are lowercased for comparison.
const QUESTIONS = [
  {
    question: "What was the subject line of the first email I ever sent you?",
    hint: "Check your Gmail inbox, go way back...",
    answer: "hello",
  },
  {
    question: "What did I text you at 2am that one night?",
    hint: "Check our text messages around that time...",
    answer: "i miss you",
  },
  {
    question: "What restaurant did I suggest in our emails for our first date?",
    hint: "Search your emails for restaurant names...",
    answer: "olive garden",
  },
];

function ScavengerHunt() {
  const progress = getProgress();
  const alreadyComplete = progress.scavengerHunt;

  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(alreadyComplete);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = () => {
    const correct = QUESTIONS[currentQ].answer.toLowerCase();
    if (answer.trim().toLowerCase() === correct) {
      setError(false);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ((prev) => prev + 1);
        setAnswer("");
      } else {
        completeChallenge("scavengerHunt");
        setCompleted(true);
        setRefreshKey((k) => k + 1);
      }
    } else {
      setError(true);
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
          <Text style={{ fontSize: 40 }}>🔍</Text>
          <Title
            order={2}
            ta="center"
            style={{ color: "#2C1810" }}
          >
            Scavenger Hunt
          </Title>
          <Text size="sm" c="dimmed" ta="center" maw={400}>
            Go through our emails and texts to find the answers!
          </Text>
        </Stack>

        {!completed ? (
          <>
            <Progress
              value={((currentQ) / QUESTIONS.length) * 100}
              color="rose"
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
                <Card
                  p="xl"
                  radius="lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Stack gap="md">
                    <Text size="xs" c="dimmed">
                      Question {currentQ + 1} of {QUESTIONS.length}
                    </Text>
                    <Text
                      fw={600}
                      size="lg"
                      style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        color: "#2C1810",
                      }}
                    >
                      {QUESTIONS[currentQ].question}
                    </Text>
                    <Text size="sm" c="dimmed" fs="italic">
                      {QUESTIONS[currentQ].hint}
                    </Text>
                    <TextInput
                      placeholder="Type your answer..."
                      value={answer}
                      onChange={(e) => {
                        setAnswer(e.currentTarget.value);
                        setError(false);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      error={error ? "Not quite... try again!" : undefined}
                      styles={{
                        input: {
                          borderColor: "#e8ddd6",
                          "&:focus": { borderColor: "#BE3455" },
                        },
                      }}
                    />
                    <Button
                      color="rose"
                      onClick={handleSubmit}
                      disabled={!answer.trim()}
                    >
                      Submit Answer
                    </Button>
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
                  You really do pay attention to our conversations!
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
