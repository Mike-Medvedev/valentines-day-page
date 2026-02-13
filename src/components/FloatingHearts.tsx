import { useMemo } from "react";
import { motion } from "framer-motion";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingHeartsProps {
  count?: number;
}

export function FloatingHearts({ count = 15 }: FloatingHeartsProps) {
  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 16,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 8,
      opacity: 0.06 + Math.random() * 0.1,
    }));
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
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            x: `${heart.x}vw`,
            y: "110vh",
            opacity: 0,
            rotate: -20 + Math.random() * 40,
          }}
          animate={{
            y: "-10vh",
            opacity: [0, heart.opacity, heart.opacity, 0],
            rotate: [-20, 20, -20],
            x: [
              `${heart.x}vw`,
              `${heart.x + (Math.random() - 0.5) * 6}vw`,
              `${heart.x + (Math.random() - 0.5) * 6}vw`,
              `${heart.x}vw`,
            ],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            fontSize: heart.size,
            userSelect: "none",
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}
