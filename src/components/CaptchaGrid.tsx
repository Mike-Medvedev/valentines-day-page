import { useState, useMemo } from "react";
import { Box, SimpleGrid, Text, Button, Image, Stack, Paper } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";

// Placeholder images — replace these paths with your actual images
// Put your gf's photos in src/assets/captcha/ and import them,
// or use URLs. The "correct" ones should be photos of your gf.
const CAPTCHA_IMAGES = [
  { id: 1, src: "https://placehold.co/200x200/ffe7e7/ff0309?text=1", isCorrect: true },
  { id: 2, src: "https://placehold.co/200x200/ffe7e7/ff0309?text=2", isCorrect: false },
  { id: 3, src: "https://placehold.co/200x200/ffe7e7/ff0309?text=3", isCorrect: true },
  { id: 4, src: "https://placehold.co/200x200/ffe7e7/ff0309?text=4", isCorrect: false },
  { id: 5, src: "https://placehold.co/200x200/ffe7e7/ff0309?text=5", isCorrect: false },
  { id: 6, src: "https://placehold.co/200x200/ffe7e7/ff0309?text=6", isCorrect: true },
  { id: 7, src: "https://placehold.co/200x200/ffe7e7/ff0309?text=7", isCorrect: false },
  { id: 8, src: "https://placehold.co/200x200/ffe7e7/ff0309?text=8", isCorrect: false },
  { id: 9, src: "https://placehold.co/200x200/ffe7e7/ff0309?text=9", isCorrect: true },
];

interface CaptchaGridProps {
  onSuccess: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function CaptchaGrid({ onSuccess }: CaptchaGridProps) {
  const shuffledImages = useMemo(() => shuffleArray(CAPTCHA_IMAGES), []);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSelection = (id: number) => {
    if (success) return;
    setError(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleVerify = () => {
    const correctIds = new Set(shuffledImages.filter((img) => img.isCorrect).map((img) => img.id));
    const isCorrect =
      selected.size === correctIds.size && [...selected].every((id) => correctIds.has(id));

    if (isCorrect) {
      setSuccess(true);
      setTimeout(() => onSuccess(), 800);
    } else {
      setError(true);
      setSelected(new Set());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}>
      <Paper
        p="lg"
        radius="lg"
        style={{
          background: "#fff",
          border: "2px solid #ff3334",
          overflow: "hidden",
        }}>
        <Stack gap="md">
          <Box
            style={{
              background: "#ff3334",
              margin: "calc(var(--mantine-spacing-lg) * -1)",
              marginBottom: 0,
              padding: "16px 20px",
            }}>
            <Text c="white" fw={600} size="sm">
              Select all images of the most beautiful person in the world
            </Text>
          </Box>

          <SimpleGrid cols={3} spacing="xs" mt="sm">
            {shuffledImages.map((img) => (
              <motion.div
                key={img.id}
                whileTap={{ scale: 0.95 }}
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => toggleSelection(img.id)}>
                <Box
                  style={{
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: selected.has(img.id) ? "3px solid #ff3334" : "3px solid transparent",
                    transition: "border-color 0.2s ease",
                  }}>
                  <Image
                    src={img.src}
                    alt={`captcha-${img.id}`}
                    h={100}
                    w="100%"
                    fit="cover"
                    style={{
                      opacity: selected.has(img.id) ? 0.8 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                  />
                  <AnimatePresence>
                    {selected.has(img.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "#ff3334",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: 14,
                          fontWeight: 700,
                        }}>
                        ✓
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}>
                <Text size="sm" c="red" ta="center">
                  Hmm, try again! You should know this...
                </Text>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}>
                <Text size="sm" c="green" ta="center" fw={600}>
                  That's right! Opening the door...
                </Text>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            fullWidth
            color="valentine"
            size="md"
            onClick={handleVerify}
            disabled={selected.size === 0 || success}>
            {success ? "Verified!" : "Verify"}
          </Button>
        </Stack>
      </Paper>
    </motion.div>
  );
}
