const PROGRESS_KEY = "valentine-progress";

export type ChallengeKey =
  | "scavengerHunt"
  | "photoMemory"
  | "timeline"
  | "loveLetter";

export interface ChallengeProgress {
  scavengerHunt: boolean;
  photoMemory: boolean;
  timeline: boolean;
  loveLetter: boolean;
}

const DEFAULT_PROGRESS: ChallengeProgress = {
  scavengerHunt: false,
  photoMemory: false,
  timeline: false,
  loveLetter: false,
};

export function getProgress(): ChallengeProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function completeChallenge(key: ChallengeKey): ChallengeProgress {
  const progress = getProgress();
  progress[key] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return progress;
}

export function getCompletedCount(): number {
  const progress = getProgress();
  return Object.values(progress).filter(Boolean).length;
}

export function isAllComplete(): boolean {
  return getCompletedCount() === 4;
}

export function resetProgress(): void {
  localStorage.removeItem(PROGRESS_KEY);
}
