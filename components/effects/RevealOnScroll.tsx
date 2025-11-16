'use client';

import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { VIEWPORT } from '@/lib/motion-config';
import * as variants from '@/lib/motion-variants';

interface RevealOnScrollProps {
  children: ReactNode;
  /**
   * Tipo de animação a aplicar
   */
  variant?:
    | 'fadeIn'
    | 'fadeInUp'
    | 'fadeInDown'
    | 'fadeInLeft'
    | 'fadeInRight'
    | 'scaleIn'
    | 'scaleInSubtle';
  /**
   * Delay adicional em segundos
   */
  delay?: number;
  /**
   * Duração customizada em segundos
   */
  duration?: number;
  /**
   * Configuração de viewport (quando trigger a animação)
   */
  viewportConfig?: 'default' | 'immediate' | 'half' | 'full';
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Se true, permite múltiplas animações (volta ao hidden quando sai da viewport)
   */
  repeat?: boolean;
}

/**
 * Componente que anima elementos quando entram na viewport
 *
 * @example
 * <RevealOnScroll variant="fadeInUp">
 *   <div>Conteúdo que será animado</div>
 * </RevealOnScroll>
 *
 * @example
 * <RevealOnScroll variant="scaleIn" delay={0.2} viewportConfig="half">
 *   <Card>Card que aparece quando metade está visível</Card>
 * </RevealOnScroll>
 */
export default function RevealOnScroll({
  children,
  variant = 'fadeInUp',
  delay = 0,
  duration,
  viewportConfig = 'default',
  className,
  repeat = false,
}: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  // Se o usuário prefere movimento reduzido, renderiza sem animação
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Pega a variante correspondente
  const selectedVariant = variants[variant] as Variants;

  // Cria variante customizada se duration ou delay foram passados
  let customVariant = selectedVariant;

  if (duration !== undefined || delay > 0) {
    customVariant = {
      ...selectedVariant,
      visible: {
        ...selectedVariant.visible,
        transition: {
          ...(typeof selectedVariant.visible === 'object' &&
          'transition' in selectedVariant.visible
            ? selectedVariant.visible.transition
            : {}),
          ...(duration !== undefined && { duration }),
          ...(delay > 0 && { delay }),
        },
      },
    };
  }

  // Configuração de viewport
  const viewportOptions = repeat
    ? { ...VIEWPORT[viewportConfig], once: false }
    : VIEWPORT[viewportConfig];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={customVariant}
      className={className}
    >
      {children}
    </motion.div>
  );
}
