import { useRef, useState, useEffect, useCallback } from "react";
import { Box } from "@mantine/core";
import { motion } from "framer-motion";

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
  const [isScratching, setIsScratching] = useState(false);
  const hasCalledReveal = useRef(false);

  // Fill canvas with scratch overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create a soft overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#D4A574");
    gradient.addColorStop(0.5, "#BE3455");
    gradient.addColorStop(1, "#D4A574");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add scratch text
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "bold 16px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ Scratch to reveal ✨", canvas.width / 2, canvas.height / 2);
  }, []);

  const calculateRevealPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext("2d");
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

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      // Check reveal percentage
      const revealed = calculateRevealPercentage();
      if (revealed >= revealThreshold && !hasCalledReveal.current) {
        hasCalledReveal.current = true;
        setIsRevealed(true);
        onReveal?.();
      }
    },
    [isRevealed, revealThreshold, onReveal, calculateRevealPercentage],
  );

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => setIsScratching(false);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isScratching) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => setIsScratching(false);

  return (
    <Box
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: width,
        aspectRatio: `${width}/${height}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: isRevealed ? "default" : "crosshair",
        touchAction: "none",
        margin: "0 auto",
      }}
    >
      {/* The image underneath */}
      <motion.img
        src={imageSrc}
        alt="Memory"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        animate={{ opacity: isRevealed ? 1 : 1 }}
      />

      {/* Canvas overlay for scratching */}
      <motion.div
        animate={{ opacity: isRevealed ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: isRevealed ? "none" : "auto",
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ width: "100%", height: "100%", display: "block" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </motion.div>

      {/* Revealed badge */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            background: "rgba(190, 52, 85, 0.9)",
            color: "white",
            padding: "6px 12px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Revealed!
        </motion.div>
      )}
    </Box>
  );
}
