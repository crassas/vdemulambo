import React from 'react';
import { motion } from 'motion/react';

export function BentoBox({ children, className = '', onClick, ...props }: { children: React.ReactNode, className?: string, onClick?: () => void } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      onClick={onClick}
      {...props}
      whileHover={onClick ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`bg-white/[0.02] backdrop-blur-[24px] border border-white/[0.08] rounded-[32px] p-6 lg:p-8 relative overflow-hidden group/bento shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-colors duration-500 magic-noise ${onClick ? "cursor-pointer hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_25px_50px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.2)]" : ""} ${className}`}
    >
      {/* Subtle interior glow on hover for interactive cards */}
      {onClick && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
