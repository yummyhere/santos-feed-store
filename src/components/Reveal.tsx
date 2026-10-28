import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
}

export function Reveal({
  children,
  delay = 0,
  className = '',
  immediate = false,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const [fallbackShown, setFallbackShown] = useState(immediate);

  useEffect(() => {
    if (immediate || shouldReduceMotion) return;
    // Guarantee content never stays hidden if IntersectionObserver is throttled
    const timer = window.setTimeout(() => {
      setFallbackShown(true);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [immediate, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (immediate || fallbackShown) {
    return (
      <motion.div
        initial={{ opacity: immediate ? 0 : 1, y: immediate ? 12 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.44,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
