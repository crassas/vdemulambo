import React from 'react';
import { motion } from 'motion/react';

interface HorizontalCarouselProps {
  title?: string;
  children: React.ReactNode;
}

export function HorizontalCarousel({ title, children }: HorizontalCarouselProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-sans text-rose-400/80 uppercase tracking-widest mb-4 px-4 sm:px-0">
          {title}
        </h3>
      )}
      <div className="overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
        <div className="flex gap-4 px-4 sm:px-0">
          {children}
        </div>
      </div>
    </div>
  );
}
