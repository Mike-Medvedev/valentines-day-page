import { useState } from "react";
import { motion } from "framer-motion";
import { valentine } from "../theme";
import classes from "./FloatingHearts.module.css";

const HEART_COLORS = [valentine[4], valentine[3], valentine[2], valentine[1], valentine[6], valentine[8]];
const EMOJIS = ["♥", "♥", "♥", "🌻", "🌻"];

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
  peakOpacity: number;
  fadeDuration: number;
  color: string;
}

interface FloatingHeartsProps {
  count?: number;
}

function generateParticles(count: number): Particle[] {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 576;
  const effectiveCount = isMobile ? Math.min(count, 12) : count;

  return Array.from({ length: effectiveCount }, (_, i) => {
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const isSunflower = emoji === "🌻";
    return {
      id: i,
      x: Math.random() * 95,
      y: Math.random() * 95,
      emoji,
      size: isSunflower
        ? (isMobile ? 22 : 28) + Math.random() * (isMobile ? 14 : 20)
        : (isMobile ? 16 : 22) + Math.random() * (isMobile ? 14 : 22),
      swayAmount: 3 + Math.random() * 5,
      swayDuration: 3 + Math.random() * 3,
      bobAmount: 2 + Math.random() * 4,
      bobDuration: 2 + Math.random() * 3,
      spinSpeed: 6 + Math.random() * 8,
      delay: Math.random() * 6,
      peakOpacity: 0.25 + Math.random() * 0.3,
      fadeDuration: 4 + Math.random() * 4,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    };
  });
}

export function FloatingHearts({ count = 24 }: FloatingHeartsProps) {
  const [particles] = useState(() => generateParticles(count));

  return (
    <div className={classes.container}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={classes.particle}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, p.peakOpacity, 0, p.peakOpacity, 0],
            scale: [0.6, 1.05, 0.85, 1.05, 0.6],
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
            duration: p.fadeDuration + p.swayDuration + p.bobDuration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ fontSize: p.size, color: p.emoji === "♥" ? p.color : undefined }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
