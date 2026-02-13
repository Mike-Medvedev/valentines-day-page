import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./HeartCelebration.module.css";

const PARTICLE_COUNT = 12;
const SPARKLE_EMOJIS = ["✨", "💕", "💗", "💖", "❤️", "🩷", "⭐"];

interface HeartCelebrationProps {
  /** Whether to play the celebration animation */
  animate: boolean;
  /** Called when the animation finishes */
  onComplete?: () => void;
}

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * 360;
    const rad = (angle * Math.PI) / 180;
    const distance = 60 + Math.random() * 50;
    return {
      id: i,
      emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8,
      delay: Math.random() * 0.15,
    };
  });
}

export function HeartCelebration({ animate, onComplete }: HeartCelebrationProps) {
  const [particles] = useState(generateParticles);

  return (
    <div className={classes.container}>
      {/* Main heart */}
      <motion.div
        className={classes.mainHeart}
        initial={animate ? { scale: 0, rotate: -20 } : { scale: 1 }}
        animate={
          animate
            ? {
                scale: [0, 1.6, 1.3, 1.5, 1],
                rotate: [-20, 10, -5, 0],
              }
            : { scale: 1 }
        }
        transition={
          animate
            ? { duration: 0.8, ease: "easeOut", times: [0, 0.3, 0.5, 0.7, 1] }
            : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (animate) onComplete?.();
        }}
      >
        ❤️

        {/* Glow ring */}
        <AnimatePresence>
          {animate && (
            <motion.div
              className={classes.glowRing}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Second glow ring (delayed) */}
        <AnimatePresence>
          {animate && (
            <motion.div
              className={classes.glowRing}
              initial={{ scale: 0.5, opacity: 0.6 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Burst particles */}
      <AnimatePresence>
        {animate &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              className={classes.particle}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [0, p.scale, 0],
                opacity: [0, 1, 0],
                rotate: p.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.1 + p.delay,
                ease: "easeOut",
              }}
            >
              {p.emoji}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* +1 badge floating up */}
      <AnimatePresence>
        {animate && (
          <motion.div
            className={classes.plusOne}
            initial={{ y: 20, opacity: 0, scale: 0.5 }}
            animate={{ y: -50, opacity: [0, 1, 1, 0], scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            +1
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
