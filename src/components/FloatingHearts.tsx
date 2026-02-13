import { useMemo } from "react";
import { motion } from "framer-motion";

const HEART_COLORS = ["#ff3334", "#ff6465", "#ff9a9b", "#ffcece", "#ff0309", "#cc0000"];
const EMOJIS = ["♥", "♥", "♥", "🌻", "🌻"]; // ~60% hearts, ~40% sunflowers

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  swayAmount: number;
  swayDuration: number;
  bobAmount: number;
  bobDuration: number;
  spinSpeed: number;
  delay: number;
  opacity: number;
  color: string;
}

interface FloatingHeartsProps {
  count?: number;
}

export function FloatingHearts({ count = 24 }: FloatingHeartsProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const isSunflower = emoji === "🌻";
      return {
        id: i,
        x: Math.random() * 95,
        y: Math.random() * 95,
        emoji,
        size: isSunflower ? 20 + Math.random() * 16 : 14 + Math.random() * 18,
        swayAmount: 3 + Math.random() * 5,
        swayDuration: 3 + Math.random() * 3,
        bobAmount: 2 + Math.random() * 4,
        bobDuration: 2 + Math.random() * 3,
        spinSpeed: 6 + Math.random() * 8,
        delay: Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.25,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      };
    });
  }, [count]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: [0, p.opacity, p.opacity, p.opacity, 0],
            scale: [0.5, 1, 1, 1, 0.5],
            x: [
              `${p.x}vw`,
              `${p.x + p.swayAmount}vw`,
              `${p.x - p.swayAmount}vw`,
              `${p.x + p.swayAmount * 0.5}vw`,
              `${p.x}vw`,
            ],
            y: [
              `${p.y}vh`,
              `${p.y - p.bobAmount}vh`,
              `${p.y + p.bobAmount}vh`,
              `${p.y - p.bobAmount * 0.5}vh`,
              `${p.y}vh`,
            ],
            rotate: [0, 15, -15, 10, -10, 0],
          }}
          transition={{
            duration: p.swayDuration + p.bobDuration + 4,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            fontSize: p.size,
            color: p.emoji === "♥" ? p.color : undefined,
            userSelect: "none",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
