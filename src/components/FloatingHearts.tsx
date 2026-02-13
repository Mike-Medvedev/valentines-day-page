import { useMemo } from "react";
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
    <div className={classes.container}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={classes.particle}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0, scale: 0.5 }}
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
          style={{ fontSize: p.size, color: p.emoji === "♥" ? p.color : undefined }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
