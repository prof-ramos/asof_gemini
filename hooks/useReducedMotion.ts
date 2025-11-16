'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para detectar preferência de movimento reduzido do usuário
 *
 * Respeita a configuração de acessibilidade `prefers-reduced-motion`
 * conforme WCAG 2.1 AA compliance
 *
 * @returns {boolean} true se o usuário prefere movimento reduzido
 *
 * @example
 * const prefersReducedMotion = useReducedMotion()
 *
 * if (prefersReducedMotion) {
 *   // Não animar ou usar animações instantâneas
 * } else {
 *   // Animar normalmente
 * }
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Verifica se o navegador suporta matchMedia
    if (!window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set inicial
    setPrefersReducedMotion(mediaQuery.matches);

    // Listener para mudanças dinâmicas
    const listener = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      // Fallback para navegadores antigos
      mediaQuery.addListener(listener as any);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener as any);
      }
    };
  }, []);

  return prefersReducedMotion;
}
