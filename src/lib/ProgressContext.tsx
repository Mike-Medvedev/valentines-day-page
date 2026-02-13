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
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ChallengeProgress>(getStoredProgress);

  const completeChallenge = useCallback((key: ChallengeKey) => {
    persistChallenge(key);
    setProgress(getStoredProgress());
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const isAllComplete = completedCount === 4;

  return (
    <ProgressContext.Provider value={{ progress, completedCount, isAllComplete, completeChallenge }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
