# Implementation Plan

Implementar correções de UI/UX para alcançar conformidade rigorosa às regras de acessibilidade WCAG, consistência visual, tipografia, cores, espaçamentos e layouts no repositório asof_gemini.

O projeto apresenta conformidade parcial, com áreas críticas como tipografia <16px em texto body e espaçamentos não padronizados à grade 8pt. A implementação priorizará acessibilidade (alto impacto) sobre refinamentos estéticos, utilizando o stack existente Next.js + Tailwind sem introduzir dependências desnecessárias.

## Types
Sem alterações em tipos existentes, porém introduzir tipagem para novos props (ex.: size para Button).

Detail type definitions: interface ButtonProps extends ... { size?: 'sm' | 'md' | 'lg'; };
Color types em config: contrast-valid: 'valid' | 'invalid';
Spacing types: multiples of 8: 4,8,12,16,24,32,40,48.

## Files
Novo arquivo: Nenhum arquivo totalmente novo necessário, focando em modificações.

Arquivos modificados:
- tailwind.config.ts: Adicionar tokens design (cores, espaçamentos múltiplos de 8, escalas tipográficas).
- components/ui/Button.tsx: Adicionar props size, ajustar padding para py-3, adicionar validação contraste.
- components/ui/NewsCard.tsx: Mudar text-sm para text-base (≥16px).
- components/ui/Badge.tsx: Mudar text-xs para text-sm.
- components/ui/IconCard.tsx: Padronizar gap-2 para flex layouts.
- Seções (newsabout.tsx et al): Substituir gap-6 por gap-8, padronizar margens.

Arquivos deletados: Nenhum.

Configuração headless: Nenhum update necessário.

## Functions
Nova função: contrastChecker(color1, color2) return ratio for validation in build time.
Função modificada: formatDate em utils.ts add parameter for font size if needed.
Função removida: Nenhuma.

## Classes
Nova classe: Button com subclasses sm/md/lg for sizes.
Classe modificada: Card com padding standardization.
Classe removida: Nenhuma.

## Dependencies
Sem novas dependências; visualizar Existing tailwind/ Next.js.

## Testing
Manual check contrast ratios with browser dev tools.
Test touch zones ~48-50px with mobile emulator.
Validate typography legibility >16px.

## Implementation Order
1. Configurar design tokens (cores, spacing, typography) em tailwind.config.ts.
2. Atualizar Button.tsx com size props e min heights.
3. Modificar NewsCard, Badge, IconCard para tipografia ≥16px e gaps padronizados.
4. Ajustar seções variar gap-6 para gap-8.
5. Testar e validar contrastes, faZER touch zones, alinhamentos.
