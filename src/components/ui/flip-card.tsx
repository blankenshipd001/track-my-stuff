"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface FlipCardProps {
  /** Whether the card is currently flipped */
  isFlipped: boolean;
  /** Content to show on the front of the card */
  frontContent: ReactNode;
  /** Content to show on the back of the card */
  backContent: ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional custom styles for the container */
  style?: React.CSSProperties;
  /** Optional className for the container */
  className?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Whether to enable pointer cursor */
  pointer?: boolean;
}

/**
 * Reusable flip card component with 3D rotation animation.
 * Handles the flip animation logic so child components only need to provide content.
 */
export const FlipCard: React.FC<FlipCardProps> = ({
  isFlipped,
  frontContent,
  backContent,
  onClick,
  style,
  className,
  duration = 0.6,
  pointer = true,
}) => {
  const containerVariants = {
    rest: { rotateY: 0 },
    flipped: { rotateY: 180 },
  };

  return (
    <motion.div
      initial="rest"
      animate={isFlipped ? "flipped" : "rest"}
      variants={containerVariants}
      transition={{ duration }}
      onClick={onClick}
      className={className}
      style={{
        perspective: 1000,
        height: '100%',
        cursor: pointer ? 'pointer' : 'default',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {!isFlipped ? frontContent : backContent}
    </motion.div>
  );
};

FlipCard.displayName = 'FlipCard';
