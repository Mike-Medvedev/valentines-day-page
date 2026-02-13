import { useRef, useState, useEffect, useCallback } from "react";
import { Box } from "@mantine/core";
import { motion } from "framer-motion";
import { valentine } from "../theme";
import classes from "./ScratchCard.module.css";

interface ScratchCardProps {
  imageSrc: string;
  width?: number;
  height?: number;
  revealThreshold?: number;
  onReveal?: () => void;
}

export function ScratchCard({
  imageSrc,
  width = 400,
  height = 280,
  revealThreshold = 0.55,
  onReveal,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isScratchingRef = useRef(false);
  const hasCalledReveal = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, valentine[3]);
    gradient.addColorStop(0.5, valentine[6]);
    gradient.addColorStop(1, valentine[3]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "bold 16px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ Scratch to reveal ✨", canvas.width / 2, canvas.height / 2);
  }, []);

  const calculateRevealPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    const total = pixels.length / 4;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    return transparent / total;
  }, []);

  const scratch = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealed) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fill();
      const revealed = calculateRevealPercentage();
      if (revealed >= revealThreshold && !hasCalledReveal.current) {
        hasCalledReveal.current = true;
        setIsRevealed(true);
        onReveal?.();
      }
    },
    [isRevealed, revealThreshold, onReveal, calculateRevealPercentage],
  );

  const startScratching = useCallback(() => {
    isScratchingRef.current = true;
  }, []);
  const stopScratching = useCallback(() => {
    isScratchingRef.current = false;
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    startScratching();
    scratch(e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratchingRef.current) return;
    scratch(e.clientX, e.clientY);
  };
  const handleMouseUp = () => stopScratching();

  // Attach touch listeners with { passive: false } so preventDefault() works
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      startScratching();
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isScratchingRef.current) return;
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => stopScratching();

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scratch, startScratching, stopScratching]);

  return (
    <Box
      ref={containerRef}
      className={classes.container}
      data-revealed={String(isRevealed)}
      style={{ maxWidth: width, aspectRatio: `${width}/${height}` }}>
      <motion.img src={imageSrc} alt="Memory" className={classes.image} animate={{ opacity: 1 }} />

      <motion.div
        animate={{ opacity: isRevealed ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className={classes.canvasOverlay}
        style={{ pointerEvents: isRevealed ? "none" : "auto" }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={classes.canvas}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </motion.div>

      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className={classes.revealedBadge}>
          Revealed!
        </motion.div>
      )}
    </Box>
  );
}
