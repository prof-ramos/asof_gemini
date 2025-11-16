/**
 * Motion Variants - ASOF Website
 *
 * Variantes reutilizáveis para Framer Motion
 * Mantém consistência visual em todas as animações
 */

import { Variants } from 'framer-motion';
import { EASING, DURATION, STAGGER } from './motion-config';

/**
 * FADE VARIANTS
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.elegant,
      ease: EASING.elegant,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeIn,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.elegant,
      ease: EASING.elegant,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeIn,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.elegant,
      ease: EASING.elegant,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.elegant,
      ease: EASING.elegant,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.elegant,
      ease: EASING.elegant,
    },
  },
};

/**
 * SCALE VARIANTS
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING.elegant,
    },
  },
};

export const scaleInSubtle: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.elegant,
      ease: EASING.elegant,
    },
  },
};

/**
 * STAGGER CONTAINER VARIANTS
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.md,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.sm,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.lg,
      delayChildren: 0.3,
    },
  },
};

/**
 * HOVER VARIANTS (para whileHover)
 */
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.01,
    transition: {
      duration: DURATION.normal,
      ease: EASING.smooth,
    },
  },
};

export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: DURATION.fast,
      ease: EASING.smooth,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export const hoverGlow = {
  rest: { boxShadow: '0 0 0 rgba(130, 180, 214, 0)' },
  hover: {
    boxShadow: '0 8px 24px rgba(130, 180, 214, 0.2)',
    transition: {
      duration: DURATION.normal,
      ease: EASING.smooth,
    },
  },
};

/**
 * BUTTON VARIANTS
 */
export const buttonVariants: Variants = {
  rest: {
    scale: 1,
    backgroundColor: 'var(--button-bg-rest)',
  },
  hover: {
    scale: 1.02,
    backgroundColor: 'var(--button-bg-hover)',
    transition: {
      duration: DURATION.fast,
      ease: EASING.smooth,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: DURATION.fast,
      ease: EASING.smooth,
    },
  },
};

/**
 * IMAGE REVEAL VARIANTS
 */
export const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    clipPath: 'inset(0 100% 0 0)',
  },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: DURATION.elegant,
      ease: EASING.elegant,
    },
  },
};

export const imageScale: Variants = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: DURATION.verySlow,
      ease: EASING.elegant,
    },
  },
};

/**
 * TEXT VARIANTS (para títulos)
 */
export const textReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03, // 30ms delay entre palavras
      duration: DURATION.slow,
      ease: EASING.elegant,
    },
  }),
};

/**
 * UNDERLINE ANIMATION (para links)
 */
export const underlineExpand = {
  rest: { width: 0 },
  hover: {
    width: '100%',
    transition: {
      duration: DURATION.normal,
      ease: EASING.smooth,
    },
  },
};

/**
 * CARD VARIANTS
 */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASING.elegant,
    },
  },
};

/**
 * HERO SECTION VARIANTS
 */
export const heroContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
      duration: DURATION.normal,
    },
  },
};

export const heroBadge: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASING.elegant,
    },
  },
};

export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.elegant,
      ease: EASING.elegant,
    },
  },
};

export const heroDescription: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.elegant,
      ease: EASING.elegant,
      delay: 0.1,
    },
  },
};

export const heroButtons: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASING.elegant,
      delay: 0.2,
    },
  },
};

/**
 * ICON FLOAT ANIMATION
 */
export const iconFloat = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      ease: EASING.smooth,
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
};

/**
 * PULSE SUBTLE (para badges)
 */
export const pulseSubtle = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.95, 1],
    transition: {
      duration: 4,
      ease: EASING.smooth,
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
};

/**
 * Helper: Cria variant com delay customizado
 */
export function createDelayedVariant(baseVariant: Variants, delay: number): Variants {
  return {
    ...baseVariant,
    visible: {
      ...baseVariant.visible,
      transition: {
        ...(typeof baseVariant.visible === 'object' && 'transition' in baseVariant.visible
          ? baseVariant.visible.transition
          : {}),
        delay,
      },
    },
  };
}

/**
 * Type exports
 */
export type VariantName =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'scaleIn'
  | 'scaleInSubtle'
  | 'cardVariants'
  | 'imageReveal';
