import React from 'react';
import { motion } from 'motion/react';

export function BentoBox({ children, className = '', onClick, ...props }: { children: React.ReactNode, className?: string, onClick?: () => void } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div 
      onClick={onClick}
      {...props}
      whileHover={onClick ? { y: -2, scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.96 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`bg-white/[0.04] backdrop-blur-[12px] border border-white/10 rounded-[24px] p-5 relative overflow-hidden group/bento shadow-xl ${onClick ? "cursor-pointer hover:border-white/15 hover:bg-white/[0.06]" : ""} ${className}`}
    >
      {/* Subtle interior glow on hover for interactive cards */}
      {onClick && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
