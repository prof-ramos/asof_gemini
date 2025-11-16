/**
 * Motion Configuration - ASOF Website
 *
 * Configurações centralizadas para Framer Motion
 * Mantém consistência em durações, easing functions e timings
 */

/**
 * EASING FUNCTIONS CUSTOMIZADAS
 *
 * Baseadas em curvas bezier elegantes para movimento suave
 */
export const EASING = {
  /**
   * Elegant - Movimento suave e sofisticado
   * Ideal para: Hero animations, fade-ins principais
   */
  elegant: [0.22, 1, 0.36, 1] as const,

  /**
   * Smooth - Transição padrão suave
   * Ideal para: Hover effects, state changes
   */
  smooth: [0.4, 0, 0.2, 1] as const,

  /**
   * Spring - Movimento com bounce sutil
   * Ideal para: Interactive elements, micro-interactions
   * USAR COM MODERAÇÃO (site institucional)
   */
  spring: [0.68, -0.55, 0.265, 1.55] as const,

  /**
   * Sharp - Entrada/saída rápida
   * Ideal para: Modais, dropdowns
   */
  sharp: [0.4, 0, 0.6, 1] as const,

  /**
   * Ease Out - Saída suave natural
   * Ideal para: Scroll reveals, appear animations
   */
  easeOut: [0, 0, 0.2, 1] as const,

  /**
   * Ease In - Entrada suave natural
   * Ideal para: Exit animations, dismissals
   */
  easeIn: [0.4, 0, 1, 1] as const,
} as const;

/**
 * DURAÇÕES PADRÃO
 *
 * Sistema de durações consistente para todas as animações
 */
export const DURATION = {
  /**
   * Instant - Para mudanças imediatas
   */
  instant: 0,

  /**
   * Fast - Micro-interactions rápidas
   * Uso: Button hover, link hover
   */
  fast: 0.15,

  /**
   * Quick - Transições curtas
   * Uso: Dropdowns, tooltips
   */
  quick: 0.25,

  /**
   * Normal - Duração padrão
   * Uso: Cards hover, state changes
   */
  normal: 0.4,

  /**
   * Slow - Transições médias
   * Uso: Section reveals, image loads
   */
  slow: 0.6,

  /**
   * Elegant - Durações mais longas e sofisticadas
   * Uso: Hero animations, page transitions
   */
  elegant: 0.8,

  /**
   * Very Slow - Animações longas
   * Uso: Background effects, parallax
   */
  verySlow: 1.2,
} as const;

/**
 * DELAYS PARA STAGGER
 *
 * Delays incrementais para criar efeito cascata
 */
export const STAGGER = {
  /**
   * Small - Stagger rápido
   * Uso: Lista pequena de items (3-5)
   */
  sm: 0.05,

  /**
   * Medium - Stagger padrão
   * Uso: Grid de cards, navigation items
   */
  md: 0.1,

  /**
   * Large - Stagger mais espaçado
   * Uso: Seções grandes, muitos elementos
   */
  lg: 0.15,

  /**
   * Extra Large - Stagger bem espaçado
   * Uso: Timeline effects, sequential reveals
   */
  xl: 0.2,
} as const;

/**
 * CONFIGURAÇÕES DE SPRING PHYSICS
 *
 * Para animações com física natural (usar com moderação)
 */
export const SPRING = {
  /**
   * Gentle - Spring muito sutil (recomendado para ASOF)
   */
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
    mass: 1,
  },

  /**
   * Bouncy - Spring com mais bounce
   * EVITAR em site institucional - usar apenas em micro-interactions
   */
  bouncy: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 10,
    mass: 0.5,
  },

  /**
   * Soft - Spring macio e suave
   */
  soft: {
    type: 'spring' as const,
    stiffness: 80,
    damping: 25,
    mass: 1.2,
  },
} as const;

/**
 * TRANSIÇÕES PRÉ-CONFIGURADAS
 *
 * Combinações de easing + duration prontas para uso
 */
export const TRANSITION = {
  /**
   * Default - Transição padrão do site
   */
  default: {
    duration: DURATION.normal,
    ease: EASING.smooth,
  },

  /**
   * Elegant - Para animações principais
   */
  elegant: {
    duration: DURATION.elegant,
    ease: EASING.elegant,
  },

  /**
   * Fast - Para hover effects
   */
  fast: {
    duration: DURATION.fast,
    ease: EASING.smooth,
  },

  /**
   * Slow - Para reveals
   */
  slow: {
    duration: DURATION.slow,
    ease: EASING.easeOut,
  },

  /**
   * Fade - Para fade in/out
   */
  fade: {
    duration: DURATION.normal,
    ease: EASING.easeOut,
  },
} as const;

/**
 * VIEWPORT CONFIGURATION
 *
 * Configurações para scroll-triggered animations
 */
export const VIEWPORT = {
  /**
   * Default - Trigger quando 20% do elemento está visível
   */
  default: {
    once: true, // Anima apenas uma vez
    amount: 0.2, // 20% visível
    margin: '0px 0px -100px 0px', // Trigger 100px antes
  },

  /**
   * Immediate - Trigger assim que aparecer
   */
  immediate: {
    once: true,
    amount: 0.1,
    margin: '0px',
  },

  /**
   * Half - Trigger quando metade está visível
   */
  half: {
    once: true,
    amount: 0.5,
    margin: '0px',
  },

  /**
   * Full - Trigger quando completamente visível
   */
  full: {
    once: true,
    amount: 0.9,
    margin: '0px',
  },

  /**
   * Repeating - Anima toda vez que entrar/sair
   */
  repeating: {
    once: false,
    amount: 0.2,
    margin: '0px',
  },
} as const;

/**
 * REDUCED MOTION OVERRIDES
 *
 * Configurações para quando prefers-reduced-motion está ativo
 */
export const REDUCED_MOTION = {
  /**
   * Transition instantânea (sem animação)
   */
  instant: {
    duration: 0,
    ease: 'linear' as const,
  },

  /**
   * Transição muito rápida (quase instantânea)
   */
  minimal: {
    duration: 0.05,
    ease: 'linear' as const,
  },
} as const;

/**
 * Helper function para aplicar reduced motion
 */
export function getTransition(
  transition: keyof typeof TRANSITION,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) {
    return REDUCED_MOTION.instant;
  }
  return TRANSITION[transition];
}

/**
 * Type exports
 */
export type EasingFunction = (typeof EASING)[keyof typeof EASING];
export type TransitionPreset = keyof typeof TRANSITION;
export type StaggerAmount = (typeof STAGGER)[keyof typeof STAGGER];
