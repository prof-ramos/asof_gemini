/**
 * Design Tokens - ASOF Website
 *
 * Sistema centralizado de tokens de design seguindo:
 * - Sistema 8pt Grid
 * - WCAG 2.1 Guidelines
 * - Mobile-first approach (iOS 44px, Android 48px)
 */

/**
 * SPACING SYSTEM (8pt Grid)
 * Todos os espaçamentos devem ser múltiplos de 8px
 */
export const SPACING = {
  xs: '4px',      // 0.5 rem (tailwind: 2)
  sm: '8px',      // 0.5 rem (tailwind: 2)
  md: '16px',     // 1 rem (tailwind: 4)
  lg: '24px',     // 1.5 rem (tailwind: 6)
  xl: '32px',     // 2 rem (tailwind: 8)
  '2xl': '48px',  // 3 rem (tailwind: 12)
  '3xl': '64px',  // 4 rem (tailwind: 16)
  '4xl': '96px',  // 6 rem (tailwind: 24)
} as const;

/**
 * SPACING LEVELS (Uso Semântico)
 */
export const SPACING_LEVELS = {
  // Elementos intimamente relacionados (label + campo, ícone + texto)
  tight: SPACING.xs,    // 4px
  close: SPACING.sm,    // 8px

  // Separação entre seções dentro de um componente
  medium: SPACING.md,   // 16px
  comfortable: SPACING.lg, // 24px

  // Separação entre seções distintas / quebras principais
  spacious: SPACING.xl,   // 32px
  loose: SPACING['2xl'], // 48px
} as const;

/**
 * BUTTON HEIGHTS (Acessibilidade Mobile)
 * - iOS mínimo: 44x44px
 * - Android mínimo: 48x48px
 * - Ideal: ~50px (MIT Touch Lab recommendation)
 */
export const BUTTON_HEIGHTS = {
  mobile: {
    sm: '48px',  // Atende iOS (44px) e Android (48px)
    md: '50px',  // Tamanho ideal
    lg: '52px',  // Para CTAs principais
  },
  desktop: {
    sm: '44px',  // Menor aceitável
    md: '48px',  // Padrão
    lg: '52px',  // CTAs destacadas
  },
} as const;

/**
 * BUTTON SPACING
 * Espaçamento mínimo entre botões adjacentes
 */
export const BUTTON_SPACING = {
  mobile: SPACING.md,    // 16px mínimo
  desktop: SPACING.sm,   // 8px mínimo
  ideal: SPACING.lg,     // 24px recomendado
} as const;

/**
 * ICON SIZES
 * Baseado no line-height do texto adjacente para alinhamento perfeito
 */
export const ICON_SIZES = {
  // Para text-xs (12px, line-height ~16px)
  xs: 16,
  // Para text-sm (14px, line-height ~20px)
  sm: 20,
  // Para text-base (16px, line-height ~24px)
  base: 24,
  // Para text-lg (18px, line-height ~27px)
  lg: 28,
  // Para text-xl (20px, line-height ~32px)
  xl: 32,
  // Para text-2xl (24px, line-height ~36px)
  '2xl': 36,
} as const;

/**
 * ICON TO TEXT GAP
 * Espaçamento entre ícone e texto
 * Típico: ~10px (25-50% maior que padding padrão)
 */
export const ICON_TEXT_GAP = {
  tight: SPACING.xs,     // 4px - muito próximo
  normal: '10px',        // 10px - ideal para maioria dos casos
  comfortable: SPACING.md, // 16px - mais espaço
} as const;

/**
 * CARD SPACING
 */
export const CARD = {
  // Padding interno dos cards
  paddingSmall: SPACING.md,   // 16px
  paddingMedium: SPACING.lg,  // 24px
  paddingLarge: SPACING.xl,   // 32px

  // Espaçamento interno entre elementos do card
  gapVertical: SPACING.md,    // 16px

  // Gap entre cards em grids
  gapBetweenCards: SPACING.md, // 16px
} as const;

/**
 * CONTAINER MARGINS
 * Margens mínimas do container principal das bordas da tela
 */
export const CONTAINER = {
  marginMobile: SPACING.md,   // 16px mínimo
  marginTablet: SPACING.lg,   // 24px
  marginDesktop: SPACING.xl,  // 32px
} as const;

/**
 * TYPOGRAPHY SCALE
 */
export const TYPOGRAPHY = {
  // Tamanhos de fonte
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
  },

  // Line heights
  lineHeights: {
    tight: 1.1,      // Headlines grandes
    snug: 1.2,       // Headlines médios
    normal: 1.4,     // Headlines pequenos
    relaxed: 1.5,    // Body text
    loose: 1.6,      // Textos longos/artigos
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',    // Para uppercase
    extraWidest: '0.2em', // Para headers uppercase
  },

  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Comprimento de linha ideal
  maxLineLength: '65ch', // 50-75 caracteres
} as const;

/**
 * CONTRAST RATIOS (WCAG 2.1)
 */
export const WCAG_CONTRAST = {
  AA: {
    normalText: 4.5,   // ≥ 4.5:1
    largeText: 3.0,    // ≥ 3:1 (18px+ ou 14px+ bold)
  },
  AAA: {
    normalText: 7.0,   // ≥ 7:1
    largeText: 4.5,    // ≥ 4.5:1
  },
} as const;

/**
 * BREAKPOINTS (Tailwind default)
 * Mantido para referência
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * GRID SYSTEM
 */
export const GRID = {
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },
  gutter: SPACING.md,  // 16px
  margin: SPACING.lg,  // 24px
} as const;

/**
 * ANIMATION DURATIONS
 */
export const ANIMATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

/**
 * HELPER FUNCTIONS
 */

/**
 * Valida se um valor é múltiplo de 8
 */
export function isMultipleOf8(value: number): boolean {
  return value % 8 === 0;
}

/**
 * Arredonda para o múltiplo de 8 mais próximo
 */
export function roundToNearestMultipleOf8(value: number): number {
  return Math.round(value / 8) * 8;
}

/**
 * Calcula o tamanho ideal de ícone baseado no line-height do texto
 */
export function getIconSizeForText(lineHeight: number): number {
  return roundToNearestMultipleOf8(lineHeight);
}

/**
 * Type exports para uso em componentes
 */
export type SpacingKey = keyof typeof SPACING;
export type IconSizeKey = keyof typeof ICON_SIZES;
export type ButtonHeightKey = keyof typeof BUTTON_HEIGHTS.mobile;
