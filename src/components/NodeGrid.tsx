'use client';
import { motion } from "motion/react"
import { NodeCard } from './NodeCard';
import { Node } from '@/lib/types';

// Define the props for our new component
interface NodeGridProps {
  nodes: Node[];
  availableImages: string[];
  onActionComplete: () => void;
}

// 1. Define animation variants for the grid container
// This will orchestrate the animation of its children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Delay children animations by 0.3s and stagger them by 0.2s
      staggerChildren: 0.2,
    },
  },
};

// 2. Define animation variants for each card (the items)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function NodeGrid({ nodes, availableImages, onActionComplete }: NodeGridProps) {
  return (
    // 3. Use the motion.div component and apply the container variants
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden" // Start in the 'hidden' state
      animate="visible" // Animate to the 'visible' state
    >
      {nodes.map((node) => (
        // 4. Wrap each card in its own motion.div to apply item variants
        <motion.div
          key={node.id}
          variants={itemVariants}
          layout // This smoothly animates position changes
        >
          <NodeCard
            node={node}
            onActionComplete={onActionComplete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}