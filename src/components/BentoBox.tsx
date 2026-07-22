import React from 'react';
import { motion } from 'motion/react';

export function BentoBox({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-3xl glass-mystic shadow-mystic hover:shadow-mystic-elevated transition-all duration-500 cursor-pointer ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-30 pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
