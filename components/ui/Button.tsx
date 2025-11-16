'use client';

import { useState, useRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types';
import { BUTTON_HEIGHTS } from '@/lib/design-tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  asChild = false,
  ...props
}: ButtonProps) => {
  const prefersReducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Alturas fixas para consistência (sem py- para evitar alturas irregulares)
  // Mobile-first: garante 48px mínimo (atende iOS 44px e Android 48px)
  const sizes = {
    sm: `px-8 text-sm h-[${BUTTON_HEIGHTS.mobile.sm}]`,
    md: `px-10 text-base h-[${BUTTON_HEIGHTS.mobile.md}]`,
    lg: `px-12 text-lg h-[${BUTTON_HEIGHTS.mobile.lg}]`,
  };

  const baseStyle =
    'rounded-sm transition-all duration-300 font-medium tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark hover:shadow-lg border border-transparent focus:ring-2 focus:ring-primary focus:ring-offset-2',
    outline:
      'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary focus:ring-offset-2',
    highlight:
      'bg-accent text-primary hover:bg-primary-dark hover:text-white border border-transparent font-bold focus:ring-2 focus:ring-primary focus:ring-offset-2',
    ghost:
      'bg-white text-primary border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-primary focus:ring-offset-2',
  };

  // Magnetic effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Limitar movimento a um máximo de 8px
    const maxDistance = 8;
    const distance = Math.sqrt(x * x + y * y);
    const limitedX = distance > 0 ? (x / distance) * Math.min(distance, maxDistance) * 0.3 : 0;
    const limitedY = distance > 0 ? (y / distance) * Math.min(distance, maxDistance) * 0.3 : 0;

    setMousePosition({ x: limitedX, y: limitedY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Motion props
  const motionProps: MotionProps = prefersReducedMotion
    ? {}
    : {
        animate: {
          x: mousePosition.x,
          y: mousePosition.y,
        },
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: {
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        },
      };

  // Se asChild, use Slot sem motion
  if (asChild) {
    return (
      <Slot className={cn(baseStyle, sizes[size], variants[variant], className)} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <motion.button
      ref={buttonRef}
      className={cn(baseStyle, sizes[size], variants[variant], className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
