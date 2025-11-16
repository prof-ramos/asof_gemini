# Design System - ASOF Website

## Índice
1. [Visão Geral](#visão-geral)
2. [Princípios de Design](#princípios-de-design)
3. [Sistema 8pt Grid](#sistema-8pt-grid)
4. [Escala Tipográfica](#escala-tipográfica)
5. [Paleta de Cores](#paleta-de-cores)
6. [Componentes](#componentes)
7. [Acessibilidade](#acessibilidade)
8. [Guias de Uso](#guias-de-uso)

---

## Visão Geral

O Design System da ASOF foi desenvolvido seguindo as melhores práticas de UI/UX e acessibilidade, incluindo:

- ✅ **WCAG 2.1 Level AAA** para contraste de cores
- ✅ **Sistema 8pt Grid** para consistência de espaçamentos
- ✅ **Mobile-first** com tamanhos de toque adequados (iOS 44px, Android 48px)
- ✅ **Tipografia otimizada** para legibilidade
- ✅ **Componentes reutilizáveis** padronizados

### Stack Tecnológico
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Estilização**: Tailwind CSS 3.4
- **Tipografia**: Playfair Display (serif) + Inter (sans-serif)
- **Ícones**: Lucide React

---

## Princípios de Design

### 1. Consistência
Todos os espaçamentos, tamanhos e cores seguem padrões predefinidos no sistema.

### 2. Acessibilidade
Todos os componentes atendem WCAG 2.1 Level AA no mínimo, com preferência para AAA.

### 3. Mobile-First
Design pensado para dispositivos móveis primeiro, expandindo para desktop.

### 4. Simplicidade
Interface limpa e focada no conteúdo, sem elementos desnecessários.

### 5. Profissionalismo
Visual sóbrio e confiável, adequado para uma associação governamental.

---

## Sistema 8pt Grid

Todos os espaçamentos devem ser **múltiplos de 8px**.

### Escala de Espaçamentos

```typescript
SPACING = {
  xs: '4px',      // 0.5 rem (tailwind: spacing[4px])
  sm: '8px',      // 0.5 rem (tailwind: 2)
  md: '16px',     // 1 rem (tailwind: 4)
  lg: '24px',     // 1.5 rem (tailwind: 6)
  xl: '32px',     // 2 rem (tailwind: 8)
  '2xl': '48px',  // 3 rem (tailwind: 12)
  '3xl': '64px',  // 4 rem (tailwind: 16)
  '4xl': '96px',  // 6 rem (tailwind: 24)
}
```

### Uso Semântico

| Contexto | Tamanho | Uso |
|----------|---------|-----|
| **Fechado** | 4-8px | Elementos intimamente relacionados (label + campo, ícone + texto) |
| **Médio** | 16-24px | Separação entre seções dentro de um componente |
| **Amplo** | 32-48px | Separação entre seções distintas |
| **Muito Amplo** | 64-96px | Quebras principais entre seções |

### Exemplos de Código

```tsx
// ❌ ERRADO - Valores arbitrários
<div className="mb-5 mt-7">

// ✅ CORRETO - Múltiplos de 8
<div className="mb-4 mt-8">  {/* 16px e 32px */}

// ✅ CORRETO - Usando tokens
<div className="mb-[16px] mt-[32px]">
```

---

## Escala Tipográfica

### Tamanhos de Fonte

| Classe | Tamanho | Line Height | Uso |
|--------|---------|-------------|-----|
| `text-xs` | 12px | 1.2 | Labels, legendas |
| `text-sm` | 14px | 1.4 | Textos secundários |
| `text-base` | 16px | 1.5 | **Corpo de texto padrão** |
| `text-lg` | 18px | 1.5 | Leads, destaques |
| `text-xl` | 20px | 1.6 | Subtítulos |
| `text-2xl` | 24px | 1.6 | H4 |
| `text-3xl` | 30px | 1.5 | H3 |
| `text-4xl` | 36px | 1.4 | H2 |
| `text-5xl` | 48px | 1.3 | H1 Desktop |
| `text-6xl` | 60px | 1.2 | H1 Grande |
| `text-7xl` | 72px | 1.1 | Hero Headings |

### Hierarquia de Títulos

```tsx
// H1 - Página principal
<h1 className="text-5xl md:text-6xl font-serif font-bold text-primary">
  Título Principal
</h1>

// H2 - Seções principais
<h2 className="text-4xl font-serif font-bold text-primary mb-6">
  Seção Principal
</h2>

// H3 - Subsections
<h3 className="text-2xl font-serif font-bold text-primary mb-3">
  Subtítulo
</h3>

// Corpo de texto
<p className="text-base text-slate-700 leading-relaxed">
  Texto principal...
</p>
```

### Pesos de Fonte

- **Light (300)**: Textos decorativos
- **Regular (400)**: Corpo de texto
- **Medium (500-600)**: Subtítulos, destaques
- **Bold (700+)**: Títulos, CTAs

### Letter Spacing

```tsx
// Para texto em UPPERCASE
<span className="uppercase tracking-widest">  {/* 0.1em */}
  CATEGORIA
</span>

// Para headings em uppercase
<h2 className="uppercase tracking-[0.2em]">  {/* 0.2em */}
  TÍTULO
</h2>
```

### Comprimento de Linha

Para textos longos, use `max-w-prose` (65 caracteres):

```tsx
<p className="text-lg text-slate-700 max-w-prose leading-relaxed">
  Texto longo que não deve ultrapassar 65 caracteres por linha...
</p>
```

---

## Paleta de Cores

### Cores Primárias

```typescript
colors: {
  primary: {
    DEFAULT: '#040920',  // Quase preto
    dark: '#0D2A4A',     // Azul escuro
  },
  accent: {
    DEFAULT: '#82b4d6',  // Azul claro
    light: '#a0c8e4',    // Azul muito claro
  },
  neutral: {
    DEFAULT: '#e7edf4',  // Cinza muito claro
  },
}
```

### Combinações Aprovadas (WCAG AAA)

#### Texto em Fundo Claro

| Classe | Contraste | WCAG | Uso |
|--------|-----------|------|-----|
| `text-primary` | 18:1 | AAA ✅ | Texto principal |
| `text-primary-dark` | 12:1 | AAA ✅ | Texto secundário |
| `text-slate-700` | 8.5:1 | AAA ✅ | Descrições |

```tsx
<p className="text-primary">Texto principal</p>
<p className="text-slate-700">Texto descritivo</p>
```

#### Texto em Fundo Escuro

| Classe | Contraste | WCAG | Uso |
|--------|-----------|------|-----|
| `text-white` | 18:1 | AAA ✅ | Texto principal |
| `text-neutral` | 12:1 | AAA ✅ | Texto secundário |
| `text-accent` | 8:1 | AAA ✅ | Destaques, links |

```tsx
<div className="bg-primary">
  <p className="text-white">Texto principal</p>
  <a className="text-accent">Link destacado</a>
</div>
```

### ❌ Combinações NÃO RECOMENDADAS

- `text-accent` sobre `bg-white` (contraste ~2.5:1 - Falha WCAG)
- `text-neutral` sobre `bg-white` (contraste ~1.2:1 - Falha WCAG)

---

## Componentes

### Button

#### Variantes

```tsx
import Button from '@/components/ui/Button';

// Primary - CTA principal
<Button variant="primary">
  Ação Principal
</Button>

// Accent/Highlight - Destaque
<Button variant="highlight">
  Destaque
</Button>

// Outline - Ação secundária
<Button variant="outline">
  Ação Secundária
</Button>

// Ghost - Ação terciária
<Button variant="ghost">
  Ação Terciária
</Button>
```

#### Tamanhos

```tsx
// Small - 48px altura (atende iOS 44px e Android 48px)
<Button size="sm">Pequeno</Button>

// Medium - 50px altura (padrão)
<Button size="md">Médio</Button>

// Large - 52px altura
<Button size="lg">Grande</Button>
```

#### Espaçamento entre Botões

```tsx
// ✅ CORRETO
<div className="flex gap-4 md:gap-6">  {/* 16px mobile, 24px desktop */}
  <Button variant="primary">Primário</Button>
  <Button variant="outline">Secundário</Button>
</div>

// ❌ ERRADO - Gap muito pequeno
<div className="flex gap-2">
  <Button>Botão 1</Button>
  <Button>Botão 2</Button>
</div>
```

### Card

#### Uso Básico

```tsx
import Card from '@/components/ui/Card';

<Card>
  <h3 className="text-2xl font-serif font-bold text-primary mb-4">
    Título do Card
  </h3>
  <p className="text-slate-700 leading-relaxed">
    Conteúdo do card...
  </p>
</Card>
```

#### Card com Altura Uniforme (para grids)

```tsx
// Grid com cards de altura uniforme
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <Card fullHeight>
    <h3>Título 1</h3>
    <p>Texto curto</p>
  </Card>
  <Card fullHeight>
    <h3>Título 2</h3>
    <p>Texto mais longo que quebra em várias linhas...</p>
  </Card>
  <Card fullHeight>
    <h3>Título 3</h3>
    <p>Outro texto</p>
  </Card>
</div>
```

#### Padding dos Cards

- **Padrão**: `p-6` (24px em todos os lados)
- **IconCard**: `p-8` (32px em todos os lados)

### NewsCard

```tsx
import NewsCard from '@/components/ui/NewsCard';

<NewsCard
  date="2025-01-15"
  category="Notícias"
  title="Título da Notícia"
  image="/images/noticia.jpg"
  slug="titulo-da-noticia"
  excerpt="Resumo da notícia..."
/>
```

### IconCard

```tsx
import IconCard from '@/components/ui/IconCard';
import { Heart } from 'lucide-react';

<IconCard
  icon={Heart}
  title="Título"
  description="Descrição do card com ícone"
/>
```

---

## Acessibilidade

### Contraste de Cores

Todas as combinações de cores atendem **WCAG 2.1**:

- **AA**: Contraste mínimo de 4.5:1 (texto normal) ou 3:1 (texto grande)
- **AAA**: Contraste mínimo de 7:1 (texto normal) ou 4.5:1 (texto grande)

### Tamanhos de Toque (Mobile)

- **iOS**: Mínimo 44×44px
- **Android**: Mínimo 48×48px
- **Ideal**: ~50px

Todos os botões do sistema atendem esses requisitos.

### Tamanhos de Texto

- **Mínimo absoluto**: 12px (`text-xs`)
- **Corpo de texto**: 16px (`text-base`) ou maior
- **Nunca usar**: Texto menor que 12px

### Aria Labels

```tsx
// ❌ ERRADO - Ícone sem contexto
<button>
  <Icon />
</button>

// ✅ CORRETO - Com aria-label
<button aria-label="Abrir menu">
  <Menu />
</button>

// ✅ CORRETO - Ícone decorativo
<Heart aria-hidden="true" />
<span>Favoritar</span>
```

### Estados de Foco

Todos os componentes interativos têm estado de foco visível:

```tsx
<button className="focus:ring-2 focus:ring-accent focus:ring-offset-2">
  Botão Acessível
</button>
```

---

## Guias de Uso

### Alinhamento de Ícones com Texto

#### Tamanho Proporcional

Baseie o tamanho do ícone no `line-height` do texto adjacente:

| Texto | Line Height | Tamanho de Ícone |
|-------|-------------|------------------|
| `text-xs` | ~16px | 16px |
| `text-sm` | ~20px | **20px** |
| `text-base` | ~24px | **24px** |
| `text-lg` | ~27px | 28px |
| `text-xl` | ~32px | 32px |

```tsx
// ✅ CORRETO - Ícone proporcional ao texto
<div className="flex items-center gap-4">
  <Mail size={20} />  {/* text-sm tem line-height ~20px */}
  <span className="text-sm">contato@asof.org.br</span>
</div>

// ❌ ERRADO - Ícone desproporcional
<div className="flex items-center gap-4">
  <Mail size={16} />  {/* Muito pequeno para text-sm */}
  <span className="text-sm">contato@asof.org.br</span>
</div>
```

#### Espaçamento entre Ícone e Texto

```tsx
// Gap típico: ~10px ou gap-4 (16px)
<div className="flex items-center gap-4">
  <Icon size={24} />
  <span>Texto</span>
</div>
```

### Grid de Cards

```tsx
// Grid responsivo com espaçamento adequado
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {items.map(item => (
    <Card fullHeight key={item.id}>
      {/* Conteúdo do card */}
    </Card>
  ))}
</div>
```

### Containers e Margens

```tsx
// Container com margens mínimas de 16px (mobile)
<div className="container mx-auto px-6">  {/* 24px = 16px + segurança */}
  {/* Conteúdo */}
</div>

// Section com padding vertical adequado
<section className="py-24">  {/* 96px */}
  {/* Conteúdo */}
</section>
```

### Texto Longo

```tsx
// ✅ CORRETO - Limitado a 65 caracteres
<div className="max-w-3xl mx-auto">
  <p className="text-lg text-slate-700 max-w-prose leading-relaxed">
    Texto longo que precisa ser legível...
  </p>
</div>

// ❌ ERRADO - Sem limite de largura
<div className="w-full">
  <p className="text-lg text-slate-700">
    Texto longo que vai ficar difícil de ler em telas grandes...
  </p>
</div>
```

---

## Checklist de Implementação

Ao criar um novo componente ou página, verifique:

### Espaçamentos
- [ ] Todos os espaçamentos são múltiplos de 8px
- [ ] Margens de container ≥ 16px
- [ ] Padding de botões: margem externa ≥ padding interno
- [ ] Gap entre botões: mínimo 16px (mobile), 8px (desktop)

### Botões
- [ ] Altura mínima de 48px em mobile
- [ ] Usa componente `<Button>` padrão (não customizado)
- [ ] Hierarquia visual clara (primary vs secondary)
- [ ] Contraste adequado (WCAG AA no mínimo)
- [ ] Estado de foco visível

### Tipografia
- [ ] Corpo de texto ≥ 16px
- [ ] Nenhum texto < 12px
- [ ] Textos longos com `max-w-prose`
- [ ] Line-height adequado (1.5 para body)
- [ ] Hierarquia de títulos consistente

### Cores
- [ ] Combinação de cores atende WCAG AA (preferência AAA)
- [ ] Texto sobre fundo claro: `text-primary` ou `text-slate-700`
- [ ] Texto sobre fundo escuro: `text-white` ou `text-accent`
- [ ] Evita combinações da lista de não recomendadas

### Ícones
- [ ] Tamanho proporcional ao line-height do texto
- [ ] Gap adequado entre ícone e texto (~10px ou gap-4)
- [ ] Ícones decorativos com `aria-hidden="true"`
- [ ] Ícones interativos com `aria-label`

### Cards
- [ ] Padding interno de 16px ou 24px
- [ ] Em grids, usa `fullHeight` para alinhamento
- [ ] Gap entre cards de 12-16px
- [ ] Espaçamento interno vertical de 12-16px

### Acessibilidade
- [ ] Contraste WCAG AA no mínimo
- [ ] Tamanhos de toque ≥ 48px (mobile)
- [ ] Estados de foco visíveis
- [ ] Aria labels adequados
- [ ] Hierarquia semântica de headings

---

## Recursos

### Arquivos de Referência

- **Design Tokens**: `/lib/design-tokens.ts`
- **Combinações de Cores**: `/lib/color-combinations.ts`
- **Configuração Tailwind**: `/tailwind.config.ts`

### Ferramentas

- [Contrast Checker (WCAG)](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

### Padrões de Código

```tsx
// Import dos tokens
import { ICON_SIZES, SPACING } from '@/lib/design-tokens';
import { getButtonClasses } from '@/lib/color-combinations';

// Uso dos componentes padrão
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
```

---

## Contribuindo

Ao adicionar novos componentes ou modificar existentes:

1. Siga o sistema 8pt grid
2. Verifique contraste com ferramenta WCAG
3. Teste em dispositivos móveis (tamanhos de toque)
4. Adicione aria labels apropriados
5. Documente o componente neste guia

---

## Contato

Para dúvidas ou sugestões sobre o Design System:
- **Email**: dev@asof.org.br
- **Documentação**: `/docs/design-system.md`

---

**Última atualização**: 2025-01-16
**Versão**: 1.0.0
