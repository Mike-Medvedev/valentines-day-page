import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, Stack, Text, TextInput, Title, Progress, Box, Group } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { HeartTracker } from "../../../components/HeartTracker";
import { HeartCelebration } from "../../../components/HeartCelebration";
import { useProgress } from "../../../lib/ProgressContext";
import shared from "./shared.module.css";

export const Route = createFileRoute("/_authenticated/challenges/scavenger-hunt")({
  component: ScavengerHunt,
});

const QUESTIONS = [
  { question: "What was the subject line of the first email I ever sent you?", answer: "hello" },
  { question: "What did I text you at 2am that one night?", answer: "i miss you" },
  { question: "What restaurant did I suggest in our emails for our first date?", answer: "olive garden" },
];

function ScavengerHunt() {
  const { progress, completeChallenge } = useProgress();
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

        <HeartTracker refreshKey={refreshKey} justCompletedKey={!alreadyComplete && completed ? "scavengerHunt" : undefined} />

        <Group gap="sm" justify="center">
          <Text className={shared.pageIcon}>🔍</Text>
          <Title order={2} className={shared.pageTitle}>
            Scavenger Hunt
          </Title>
        </Group>

        {!completed ? (
          <>
            <Progress
              value={(currentQ / QUESTIONS.length) * 100}
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
                    <Text fw={600} size="lg" className={shared.questionText}>
                      {QUESTIONS[currentQ].question}
                    </Text>
                    <TextInput
                      placeholder="Type your answer..."
                      value={answer}
                      onChange={(e) => { setAnswer(e.currentTarget.value); setError(false); }}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      error={error ? "Try again" : undefined}
                    />
                    <Button color="valentine" onClick={handleSubmit} disabled={!answer.trim()}>
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
            <Card p={{ base: "md", sm: "xl" }} radius="lg" ta="center" className={shared.completedCard}>
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
