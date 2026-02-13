import { useState, useMemo } from "react";
import { Box, SimpleGrid, Text, Button, Image, Stack, Paper } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./CaptchaGrid.module.css";

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
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
      <Paper p="lg" radius="lg" className={classes.wrapper}>
        <Stack gap="md">
          <Box className={classes.header}>
            <Text c="white" fw={600} size="sm">
              Select all images of the most beautiful person in the world
            </Text>
          </Box>

          <SimpleGrid cols={3} spacing="xs" mt="sm">
            {shuffledImages.map((img) => (
              <motion.div
                key={img.id}
                whileTap={{ scale: 0.95 }}
                className={classes.imageItem}
                onClick={() => toggleSelection(img.id)}>
                <Box className={classes.imageBox} data-selected={String(selected.has(img.id))}>
                  <Image
                    src={img.src}
                    alt={`captcha-${img.id}`}
                    w="100%"
                    fit="cover"
                    className={`${classes.captchaImage} ${selected.has(img.id) ? classes.selectedImage : ""}`}
                  />
                  <AnimatePresence>
                    {selected.has(img.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={classes.checkBadge}>
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
