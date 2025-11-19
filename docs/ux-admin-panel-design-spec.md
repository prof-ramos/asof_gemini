# Admin Panel Design Specification

**Project**: ASOF Website Admin Panel Redesign
**Date**: November 19, 2025
**Version**: 1.0
**Status**: Design Proposal

---

## Design System Reference

### Colors

```
Primary:
  - primary-DEFAULT: #040920 (Dark Blue)
  - primary-dark: #0D2A4A (Medium Blue)

Accent:
  - accent-DEFAULT: #82b4d6 (Light Blue)
  - accent-light: #a0c8e4 (Very Light Blue)

Neutral:
  - neutral-DEFAULT: #e7edf4 (Light Gray Background)

Semantic:
  - Success: #10b981 (Green)
  - Error: #ef4444 (Red)
  - Warning: #f59e0b (Orange)
  - Info: #3b82f6 (Blue)

Grays:
  - gray-50: #f9fafb
  - gray-100: #f3f4f6
  - gray-200: #e5e7eb
  - gray-600: #4b5563
  - gray-900: #111827
```

### Typography

```
Headings (Playfair Display):
  - h1: 2.25rem (36px) / font-serif font-bold
  - h2: 1.875rem (30px) / font-serif font-bold
  - h3: 1.5rem (24px) / font-serif font-semibold

Body (Inter):
  - Base: 1rem (16px) / font-sans
  - Small: 0.875rem (14px)
  - Extra small: 0.75rem (12px)
```

### Spacing (8pt Grid)

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### Button Heights

```
Mobile:
  - sm: 48px (minimum touch target)
  - md: 50px
  - lg: 52px

Desktop:
  - md: 48px
  - lg: 52px
```

---

## Component Specifications

### 1. Enhanced Admin Header

#### Visual Mockup
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ASOF Admin              [🔍 Buscar... (Cmd+K)]         [🔔3] [👤JD ▾]  │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Component Structure
```tsx
<header className="bg-white border-b border-gray-200 sticky top-0 z-10 h-16">
  <div className="px-6 h-full flex items-center justify-between">
    {/* Left Section */}
    <div className="flex items-center gap-6">
      <Link href="/admin">
        <h1 className="font-serif text-xl font-bold text-primary">
          ASOF Admin
        </h1>
      </Link>
      <SearchBar /> {/* Optional - Phase 2 */}
    </div>

    {/* Right Section */}
    <div className="flex items-center gap-4">
      <NotificationBell count={3} /> {/* Optional - Phase 2 */}
      <Link href="/" target="_blank">
        <Home className="w-4 h-4" />
        Ver Site
      </Link>
      <UserMenu user={currentUser} />
    </div>
  </div>
</header>
```

#### Dimensions
- Height: 64px (h-16)
- Horizontal padding: 24px (px-6)
- Gap between elements: 16px (gap-4)
- User avatar: 32px × 32px (w-8 h-8)

#### States
- **Default**: White background, gray border
- **Sticky**: Shadow-sm when scrolled

---

### 2. User Menu Dropdown

#### Visual Mockup
```
┌─────────────────────────────────┐
│  João Silva                     │
│  admin@asof.org.br              │
│  [SUPER_ADMIN]                  │
├─────────────────────────────────┤
│  👤  Meu Perfil                 │
│  ⚙️   Configurações              │
│  ❓  Ajuda                       │
├─────────────────────────────────┤
│  🚪  Sair                        │
└─────────────────────────────────┘
```

#### Component Structure
```tsx
<div className="w-64 bg-white rounded-lg shadow-lg border border-gray-200">
  {/* User Info Section */}
  <div className="px-4 py-3 border-b border-gray-100">
    <p className="font-medium text-gray-900">{user.name}</p>
    <p className="text-sm text-gray-500">{user.email}</p>
    <RoleBadge role={user.role} />
  </div>

  {/* Menu Items */}
  <nav className="py-2">
    <MenuItem icon={User} label="Meu Perfil" href="/admin/profile" />
    <MenuItem icon={Settings} label="Configurações" href="/admin/settings" />
    <MenuItem icon={HelpCircle} label="Ajuda" href="/admin/help" />
  </nav>

  {/* Logout Section */}
  <div className="border-t border-gray-100 pt-2">
    <MenuItem icon={LogOut} label="Sair" onClick={handleLogout} variant="danger" />
  </div>
</div>
```

#### Role Badge Variants
```tsx
const roleBadgeStyles = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-blue-100 text-blue-800',
  EDITOR: 'bg-green-100 text-green-800',
  AUTHOR: 'bg-yellow-100 text-yellow-800',
  VIEWER: 'bg-gray-100 text-gray-800',
}

<span className={cn(
  'inline-block px-2 py-1 rounded text-xs font-medium',
  roleBadgeStyles[role]
)}>
  {role}
</span>
```

#### Animations
```tsx
// Dropdown enter/exit
transition={{ duration: 0.15, ease: 'easeOut' }}
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
```

---

### 3. Enhanced Sidebar Navigation

#### Visual Mockup
```
┌────────────────────────┐
│  [✓] Dashboard      D  │ ← Active state
│  [ ] Mídia          M  │
│  [ ] Notícias       N  │
│  ─────────────────────│
│  [ ] Usuários       U  │
│  [ ] Configurações  S  │
└────────────────────────┘
```

#### Component Structure
```tsx
<aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
  <nav className="p-4" aria-label="Navegação principal">
    <ul className="space-y-1">
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
              'group relative',
              isActive
                ? 'bg-accent/20 text-primary font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {/* Active Indicator */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r" />
            )}

            {/* Icon */}
            <item.icon className="w-5 h-5 flex-shrink-0" />

            {/* Label */}
            <span className="flex-1">{item.label}</span>

            {/* Keyboard Shortcut */}
            {item.shortcut && (
              <kbd className="hidden group-hover:inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                {item.shortcut}
              </kbd>
            )}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
</aside>
```

#### Active State Styles
```css
Active Item:
  - Background: rgba(130, 180, 214, 0.2) /* accent/20 */
  - Text color: #040920 (primary)
  - Font weight: 500 (medium)
  - Left border: 4px solid primary
  - No hover effect (already active)

Inactive Item:
  - Background: transparent
  - Text color: #374151 (gray-700)
  - Font weight: 400 (normal)

Inactive Hover:
  - Background: #f9fafb (gray-50)
  - Text color: #111827 (gray-900)
```

#### Dimensions
- Width: 256px (w-64)
- Item height: 48px (py-3 + px-4)
- Icon size: 20px (w-5 h-5)
- Gap between icon and text: 12px (gap-3)
- Spacing between items: 4px (space-y-1)

---

### 4. Breadcrumb Navigation

#### Visual Mockup
```
🏠 > Notícias > Editar "ASOF celebra 50 anos"
```

#### Component Structure
```tsx
<nav aria-label="Breadcrumb" className="mb-6">
  <ol className="flex items-center gap-2 text-sm">
    {/* Home Icon */}
    <li>
      <Link href="/admin" className="text-gray-500 hover:text-gray-700">
        <Home className="w-4 h-4" />
      </Link>
    </li>

    {/* Breadcrumb Items */}
    {items.map((item, index) => (
      <li key={index} className="flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-gray-400" />
        {item.current ? (
          <span className="font-medium text-gray-900">
            {item.label}
          </span>
        ) : (
          <Link href={item.href} className="text-gray-500 hover:text-gray-700">
            {item.label}
          </Link>
        )}
      </li>
    ))}
  </ol>
</nav>
```

#### Styles
```
Icons: 16px (w-4 h-4)
Text: 14px (text-sm)
Gap: 8px (gap-2)

Colors:
  - Links: #6b7280 (gray-500)
  - Links hover: #374151 (gray-700)
  - Current: #111827 (gray-900)
  - Separator: #9ca3af (gray-400)
```

---

### 5. Toast Notifications

#### Visual Mockup
```
┌────────────────────────────────────────┐
│  ✓  Upload completo!                   │
│     3 arquivos adicionados à biblioteca │
│                           [Desfazer] [×]│
└────────────────────────────────────────┘
```

#### Component Structure (using sonner)
```tsx
import { toast } from 'sonner'

// Success
toast.success('Upload completo!', {
  description: '3 arquivos adicionados à biblioteca',
  action: {
    label: 'Desfazer',
    onClick: () => handleUndo(),
  },
})

// Error
toast.error('Erro ao fazer upload', {
  description: 'O arquivo excede o tamanho máximo de 10MB.',
  action: {
    label: 'Ver detalhes',
    onClick: () => showDetails(),
  },
})

// Loading
const id = toast.loading('Fazendo upload...')
// Later:
toast.success('Upload completo!', { id })
```

#### Variants
```
Success:
  - Icon: CheckCircle (green-600)
  - Background: white
  - Border: green-200
  - Title: gray-900
  - Description: gray-600

Error:
  - Icon: XCircle (red-600)
  - Background: white
  - Border: red-200
  - Title: gray-900
  - Description: gray-600

Info:
  - Icon: Info (blue-600)
  - Background: white
  - Border: blue-200

Warning:
  - Icon: AlertTriangle (orange-600)
  - Background: white
  - Border: orange-200
```

#### Position & Animation
- Position: top-right
- Distance from edge: 16px
- Max width: 400px
- Animation: slide-in-right + fade
- Duration: 4000ms (auto-dismiss)
- Stack: max 3 visible

---

### 6. Loading Skeletons

#### Visual Mockup (Dashboard)
```
┌────────────────────────────────┐
│  ████████                      │ ← Title skeleton
│  ██████████████                │ ← Description skeleton
│                                │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │██████│ │██████│ │██████│   │ ← Stat cards
│  │█     │ │█     │ │█     │   │
│  └──────┘ └──────┘ └──────┘   │
└────────────────────────────────┘
```

#### Component Structure
```tsx
// Base Skeleton
<div className="animate-pulse bg-gray-200 rounded h-4 w-32" />

// Stat Card Skeleton
<div className="bg-white p-6 rounded-lg border border-gray-200">
  <div className="flex items-center justify-between">
    <div className="space-y-3 flex-1">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-8 bg-gray-200 rounded w-16" />
      <div className="h-3 bg-gray-200 rounded w-32" />
    </div>
    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
  </div>
</div>

// Media Grid Skeleton
<div className="grid grid-cols-4 gap-4">
  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
    <div key={i} className="bg-white rounded-lg border overflow-hidden">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  ))}
</div>
```

#### Animation
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

### 7. Empty States

#### Visual Mockup
```
┌──────────────────────────────────────┐
│                                      │
│            ╭────────╮                │
│            │   📄   │                │
│            ╰────────╯                │
│                                      │
│      Nenhum arquivo encontrado       │
│  Faça upload de imagens, vídeos ou   │
│  documentos para começar.            │
│                                      │
│        [➕ Fazer Upload]              │
│                                      │
└──────────────────────────────────────┘
```

#### Component Structure
```tsx
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  {/* Icon Container */}
  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
    <Icon className="w-8 h-8 text-gray-400" />
  </div>

  {/* Title */}
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    {title}
  </h3>

  {/* Description */}
  <p className="text-sm text-gray-600 max-w-sm mb-6">
    {description}
  </p>

  {/* Action Button (Optional) */}
  {action && (
    <button
      onClick={action.onClick}
      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
    >
      {action.label}
    </button>
  )}
</div>
```

#### Variants

**No Media Files**:
- Icon: ImageIcon
- Title: "Nenhum arquivo encontrado"
- Description: "Faça upload de imagens, vídeos ou documentos para começar."
- Action: "Fazer Upload"

**No Posts**:
- Icon: FileText
- Title: "Nenhuma notícia ainda"
- Description: "Crie sua primeira notícia para começar a compartilhar conteúdo."
- Action: "Nova Notícia"

**No Search Results**:
- Icon: Search
- Title: "Nenhum resultado encontrado"
- Description: "Tente usar palavras-chave diferentes ou limpar os filtros."
- Action: "Limpar Filtros"

**No Users**:
- Icon: Users
- Title: "Nenhum usuário cadastrado"
- Description: "Adicione membros da equipe para colaborar no gerenciamento do site."
- Action: "Adicionar Usuário"

---

### 8. Confirmation Dialogs

#### Visual Mockup
```
┌────────────────────────────────────────┐
│  ⚠️  Excluir arquivo?                   │
│                                        │
│  Esta ação não pode ser desfeita.      │
│  O arquivo "imagem.jpg" será removido  │
│  permanentemente da biblioteca.        │
│                                        │
│            [Cancelar]  [Excluir]       │
└────────────────────────────────────────┘
```

#### Component Structure
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-md">
    {/* Header */}
    <div className="flex items-start gap-4">
      <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <div className="flex-1">
        <DialogTitle className="text-lg font-semibold text-gray-900 mb-2">
          Excluir arquivo?
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          Esta ação não pode ser desfeita. O arquivo "imagem.jpg" será
          removido permanentemente da biblioteca.
        </DialogDescription>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-3 mt-6 justify-end">
      <button
        onClick={() => setIsOpen(false)}
        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Cancelar
      </button>
      <button
        onClick={handleConfirm}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Excluir
      </button>
    </div>
  </DialogContent>
</Dialog>
```

#### Variants

**Danger (Delete)**:
- Icon background: bg-red-100
- Icon color: text-red-600
- Primary button: bg-red-600 hover:bg-red-700

**Warning**:
- Icon background: bg-orange-100
- Icon color: text-orange-600
- Primary button: bg-orange-600 hover:bg-orange-700

**Info**:
- Icon background: bg-blue-100
- Icon color: text-blue-600
- Primary button: bg-primary hover:bg-primary-dark

---

## Page Layout Specifications

### Standard Admin Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ASOF Admin        [🔍 Search]          [🔔3] [👤JD ▾]      │ ← Header (64px)
├───────────┬─────────────────────────────────────────────────┤
│ [✓] Dash  │  🏠 > Notícias                                  │ ← Breadcrumb
│ [ ] Mídia │                                                 │
│ [ ] Posts │  Notícias                                       │ ← Page Title
│           │  Gerencie, crie e edite as notícias             │ ← Description
│           │                               [➕ Nova Notícia]  │ ← Action
│           │                                                 │
│   256px   │  [Filters/Search Bar]                          │ ← Filters
│           │                                                 │
│           │  [Content Area]                                │ ← Main Content
│           │                                                 │
│           │                                                 │
│           │                                                 │
│           │                     Padding: 32px               │
└───────────┴─────────────────────────────────────────────────┘
```

### Measurements

```
Header:
  - Height: 64px
  - Horizontal padding: 24px
  - Z-index: 10 (sticky)

Sidebar:
  - Width: 256px
  - Background: white
  - Border right: 1px gray-200

Main Content Area:
  - Padding: 32px (p-8)
  - Max width: none (full remaining space)
  - Background: #e7edf4 (neutral)

Breadcrumb:
  - Margin bottom: 24px (mb-6)
  - Font size: 14px (text-sm)

Page Header:
  - Margin bottom: 32px (mb-8)
  - Title: 36px (text-3xl)
  - Description: 16px (text-base)
  - Action button: Aligned right
```

---

## Responsive Behavior

### Breakpoints

```
sm: 640px   (Mobile landscape)
md: 768px   (Tablet)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
```

### Mobile Adaptations (< 768px)

**Header**:
- Remove search bar (or hide in menu)
- User name hidden, only avatar shown
- Notification count badge on bell icon

**Sidebar**:
- Converts to mobile menu (drawer)
- Toggle button (hamburger) in header
- Overlays content when open
- Full-screen on mobile

**Content**:
- Padding reduced to 16px (p-4)
- Stat cards stack vertically (grid-cols-1)
- Media grid: 2 columns (grid-cols-2)

**Example Mobile Header**:
```
┌────────────────────────────────────┐
│ [☰] ASOF Admin         [🔔3] [JD]  │
└────────────────────────────────────┘
```

### Tablet Adaptations (768px - 1024px)

**Sidebar**:
- Can be collapsible (icon-only mode)
- Width: 64px when collapsed
- Expands on hover

**Content**:
- Padding: 24px (p-6)
- Media grid: 3 columns
- Stat cards: 2 columns

---

## Accessibility Requirements

### Keyboard Navigation

**Tab Order**:
1. Skip to main content link
2. Logo (ASOF Admin)
3. Search bar (if present)
4. Notification bell
5. User menu
6. Sidebar navigation items
7. Main content area

**Keyboard Shortcuts**:
```
/       → Focus search
Escape  → Close modals/dropdowns
Enter   → Activate focused item
Space   → Toggle checkboxes
Arrow keys → Navigate lists
```

### ARIA Labels

```tsx
// Navigation
<nav aria-label="Navegação principal">

// Breadcrumb
<nav aria-label="Breadcrumb">

// User menu
<button aria-label="Menu do usuário" aria-expanded={isOpen}>

// Icon-only buttons
<button aria-label="Notificações">
  <Bell className="w-5 h-5" aria-hidden="true" />
</button>

// Current page in nav
<a aria-current="page">Dashboard</a>

// Loading states
<div role="status" aria-live="polite">
  <span className="sr-only">Carregando conteúdo...</span>
</div>
```

### Focus States

```css
All interactive elements must have visible focus indicators:

Button focus:
  - Ring: 2px offset 2px
  - Color: primary with 20% opacity

Link focus:
  - Underline + ring

Input focus:
  - Border: 2px primary
  - Ring: 2px primary/20
```

---

## Animation Specifications

### Transitions

```tsx
// Button hover
transition-colors duration-150

// Dropdown open/close
transition-all duration-200 ease-out

// Page transitions
transition-opacity duration-300

// Toast slide-in
transition-transform duration-200 ease-out
```

### Motion Variants

```tsx
// Fade in
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}

// Slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 20 }}

// Scale
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
```

### Performance

- Prefer `transform` and `opacity` for animations
- Use `will-change` sparingly
- Respect `prefers-reduced-motion`

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion'

const prefersReducedMotion = useReducedMotion()

<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
  animate={{ opacity: 1, y: 0 }}
/>
```

---

## Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] Update AdminHeader with UserMenu
- [ ] Implement active navigation states
- [ ] Add Breadcrumb component
- [ ] Integrate toast notifications (sonner)
- [ ] Create loading skeleton components
- [ ] Design empty state component

### Phase 2: Content Management (Week 2)
- [ ] Build PostEditor with MDX support
- [ ] Add image upload to post editor
- [ ] Implement post preview
- [ ] Add autosave functionality
- [ ] Create post listing with filters

### Phase 3: Polish (Week 3)
- [ ] Add keyboard shortcuts
- [ ] Implement bulk actions in media library
- [ ] Create command palette (Cmd+K)
- [ ] Add onboarding tour
- [ ] Enhance error boundaries

### Phase 4: Testing & Launch
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] Mobile responsive testing
- [ ] Performance optimization
- [ ] User acceptance testing

---

**Document Status**: Design Proposal
**Next Action**: Review with stakeholders → Create development tickets
**Contact**: UI/UX Design Team
