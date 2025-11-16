'use client';

import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const IconCard = ({ icon: Icon, title, description }: IconCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt máximo de 4° (sutil mas perceptível)
    const rotateXValue = ((y - centerY) / centerY) * -4;
    const rotateYValue = ((x - centerX) / centerX) * 4;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  if (prefersReducedMotion) {
    return (
      <div className="bg-white p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-transparent hover:border-accent group rounded-sm h-full flex flex-col">
        <div className="w-8 h-8 bg-neutral rounded-full flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300 shrink-0">
          <Icon className="text-primary-dark group-hover:text-white transition-colors" size={24} />
        </div>
        <h3 className="text-xl font-serif font-bold mb-4 text-primary">{title}</h3>
        <p className="text-slate-700 leading-relaxed font-light text-base">{description}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-transparent hover:border-accent group rounded-sm h-full flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{ y: -6, scale: 1.01 }}
    >
      <div className="w-8 h-8 bg-neutral rounded-full flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300 shrink-0">
        <Icon className="text-primary-dark group-hover:text-white transition-colors" size={24} />
      </div>
      <h3 className="text-xl font-serif font-bold mb-4 text-primary">{title}</h3>
      <p className="text-slate-700 leading-relaxed font-light text-base">{description}</p>
    </motion.div>
  );
};

export default IconCard;
