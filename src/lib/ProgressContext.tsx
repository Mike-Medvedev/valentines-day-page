import { createContext, useContext, useState, useCallback } from "react";
import {
  getProgress as getStoredProgress,
  completeChallenge as persistChallenge,
  type ChallengeProgress,
  type ChallengeKey,
} from "./progress";

interface ProgressContextValue {
  progress: ChallengeProgress;
  completedCount: number;
  isAllComplete: boolean;
  completeChallenge: (key: ChallengeKey) => void;
  showUnlockNotification: boolean;
  dismissUnlockNotification: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ChallengeProgress>(getStoredProgress);
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);

  const completeChallenge = useCallback((key: ChallengeKey) => {
    persistChallenge(key);
    const next = getStoredProgress();
    setProgress(next);
    const newCount = Object.values(next).filter(Boolean).length;
    if (newCount === 4) {
      setShowUnlockNotification(true);
    }
  }, []);

  const dismissUnlockNotification = useCallback(() => {
    setShowUnlockNotification(false);
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const isAllComplete = completedCount === 4;

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completedCount,
        isAllComplete,
        completeChallenge,
        showUnlockNotification,
        dismissUnlockNotification,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
