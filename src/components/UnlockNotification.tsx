import { Link } from "@tanstack/react-router";
import { Box, Button, CloseButton, Stack, Text } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "../lib/ProgressContext";
import classes from "./UnlockNotification.module.css";

export function UnlockNotification() {
  const { showUnlockNotification, dismissUnlockNotification } = useProgress();

  return (
    <AnimatePresence>
      {showUnlockNotification && (
        <motion.div
          className={classes.notification}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <Box className={classes.content}>
            <CloseButton
              size="sm"
              variant="subtle"
              color="valentine"
              onClick={dismissUnlockNotification}
              className={classes.closeBtn}
              aria-label="Dismiss notification"
            />
            <Stack gap="xs">
              <Text fw={700} size="lg" className={classes.title}>
                🎉 All 4 Hearts Complete!
              </Text>
              <Text size="sm" className={classes.message}>
                You've unlocked the Valentine's surprise. Head to the challenges page to claim it!
              </Text>
              <Button
                component={Link}
                to="/challenges"
                color="valentine"
                size="sm"
                variant="filled"
                mt="xs"
                onClick={dismissUnlockNotification}
              >
                Unlock Your Surprise
              </Button>
            </Stack>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
