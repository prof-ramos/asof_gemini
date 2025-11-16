'use client';

import { useState, useEffect, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface UseMousePositionOptions {
  /**
   * Throttle interval em ms (default: 16ms = ~60fps)
   */
  throttle?: number;
  /**
   * Se true, retorna posição relativa à viewport
   * Se false, retorna posição absoluta na página
   */
  relative?: boolean;
}

/**
 * Hook para rastrear posição do mouse com throttling para performance
 *
 * @param options - Configurações opcionais
 * @returns Posição atual do mouse {x, y}
 *
 * @example
 * // Posição básica (60fps)
 * const { x, y } = useMousePosition()
 *
 * @example
 * // Com throttle customizado (30fps)
 * const { x, y } = useMousePosition({ throttle: 33 })
 */
export function useMousePosition(
  options: UseMousePositionOptions = {}
): MousePosition {
  const { throttle = 16, relative = true } = options;

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  const updateMousePosition = useCallback(
    (event: MouseEvent) => {
      setMousePosition({
        x: relative ? event.clientX : event.pageX,
        y: relative ? event.clientY : event.pageY,
      });
    },
    [relative]
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastRun = 0;

    const throttledUpdate = (event: MouseEvent) => {
      const now = Date.now();

      if (now - lastRun >= throttle) {
        updateMousePosition(event);
        lastRun = now;
      } else {
        // Schedule próxima atualização
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          updateMousePosition(event);
          lastRun = Date.now();
        }, throttle - (now - lastRun));
      }
    };

    window.addEventListener('mousemove', throttledUpdate);

    return () => {
      window.removeEventListener('mousemove', throttledUpdate);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [throttle, updateMousePosition]);

  return mousePosition;
}

/**
 * Hook para detectar posição do mouse relativa a um elemento específico
 *
 * @returns Posição relativa ao elemento {x, y} normalizada (0-1)
 *
 * @example
 * const elementRef = useRef(null)
 * const { x, y } = useElementMousePosition(elementRef)
 * // x e y variam de 0 a 1 (centro = 0.5)
 */
export function useElementMousePosition(
  elementRef: React.RefObject<HTMLElement>
): MousePosition & { isHovering: boolean } {
  const [position, setPosition] = useState<MousePosition>({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setPosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setPosition({ x: 0.5, y: 0.5 }); // Reset ao centro
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef]);

  return { ...position, isHovering };
}
