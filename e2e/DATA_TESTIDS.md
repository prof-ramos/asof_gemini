# Data Test IDs - Guia de Implementação

Este documento lista todos os `data-testid` que devem ser adicionados aos componentes React para melhorar a confiabilidade dos testes E2E.

## 📋 Por que usar data-testid?

Os `data-testid` fornecem seletores estáveis que não dependem de:
- ✅ Ordem dos elementos no DOM
- ✅ Classes CSS que podem mudar
- ✅ Estrutura HTML específica

Isso torna os testes mais resilientes a mudanças no design e layout.

---

## 🏠 Homepage (`app/page.tsx`)

### Hero Section
```tsx
<section data-testid="hero-section">
  {/* Conteúdo do hero */}
</section>
```

### About Section
```tsx
<section data-testid="about-section">
  {/* Conteúdo sobre */}
</section>
```

### Pillars Section
```tsx
<section data-testid="pillars-section">
  {/* Cards dos pilares */}
  <div data-testid="pillar-card">
    {/* Cada card de pilar */}
  </div>
</section>
```

### News Section
```tsx
<section data-testid="news-section">
  {/* Cards de notícias */}
  <article data-testid="news-card">
    {/* Cada card de notícia */}
  </article>
</section>
```

### CTA Section
```tsx
<section data-testid="cta-section">
  {/* Call to action final */}
</section>
```

---

## 📰 Página de Notícias (`app/noticias/page.tsx`)

### Grid de Notícias
```tsx
<div data-testid="news-grid">
  {noticias.map((noticia) => (
    <article key={noticia.slug} data-testid="news-card">
      {/* Card de notícia */}
    </article>
  ))}
</div>
```

---

## 📞 Página de Contato (`app/contato/page.tsx`)

### Formulário
```tsx
<form data-testid="contact-form">
  <input data-testid="contact-name" />
  <input data-testid="contact-email" />
  <input data-testid="contact-phone" />
  <textarea data-testid="contact-message" />
  <button data-testid="contact-submit">Enviar</button>
</form>
```

### Mensagens de Feedback
```tsx
<div data-testid="success-message">
  Mensagem enviada com sucesso!
</div>

<div data-testid="error-message">
  Erro ao enviar mensagem
</div>
```

### FAQ
```tsx
<section data-testid="faq-section">
  <details data-testid="faq-item">
    <summary>Pergunta</summary>
    <div data-testid="faq-content">Resposta</div>
  </details>
</section>
```

---

## 🧩 Componentes Reutilizáveis

### NewsCard (`components/ui/NewsCard.tsx`)
```tsx
export function NewsCard({ noticia }: Props) {
  return (
    <article data-testid="news-card" className="...">
      <time data-testid="news-date" dateTime={noticia.date}>
        {formatDate(noticia.date)}
      </time>
      <h3 data-testid="news-title">{noticia.title}</h3>
      <p data-testid="news-excerpt">{noticia.excerpt}</p>
    </article>
  );
}
```

### IconCard/PillarCard (`components/ui/IconCard.tsx`)
```tsx
export function IconCard({ title, description, icon }: Props) {
  return (
    <div data-testid="pillar-card" className="...">
      <div data-testid="pillar-icon">{icon}</div>
      <h3 data-testid="pillar-title">{title}</h3>
      <p data-testid="pillar-description">{description}</p>
    </div>
  );
}
```

---

## 📐 Layout

### Header (`components/layout/Header.tsx`)
```tsx
<header data-testid="site-header">
  <nav data-testid="main-nav">
    <a data-testid="nav-home" href="/">Início</a>
    <a data-testid="nav-about" href="/sobre">Sobre</a>
    <a data-testid="nav-news" href="/noticias">Notícias</a>
    <a data-testid="nav-contact" href="/contato">Contato</a>
  </nav>

  <button data-testid="mobile-menu-toggle">
    Menu
  </button>
</header>
```

### Footer (`components/layout/Footer.tsx`)
```tsx
<footer data-testid="site-footer">
  <div data-testid="footer-content">
    {/* Conteúdo */}
  </div>
</footer>
```

---

## 🎯 Prioridades de Implementação

### Alta Prioridade
1. ✅ **Homepage sections** (hero, about, pillars, news, cta)
2. ✅ **NewsCard component** (usado em múltiplas páginas)
3. ✅ **Contact form** (formulário principal)

### Média Prioridade
4. ⚠️ **Navigation** (header e footer)
5. ⚠️ **FAQ component**

### Baixa Prioridade
6. 🔵 **Elementos decorativos**
7. 🔵 **Componentes internos**

---

## 💻 Exemplo de Implementação

### Antes
```tsx
// components/sections/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="hero">
      <h1>Título</h1>
      <p>Subtítulo</p>
    </section>
  );
}
```

### Depois
```tsx
// components/sections/HeroSection.tsx
export function HeroSection() {
  return (
    <section data-testid="hero-section" className="hero">
      <h1>Título</h1>
      <p>Subtítulo</p>
    </section>
  );
}
```

---

## 🔄 Fallbacks

Todos os Page Objects já estão preparados com fallbacks:

```typescript
// Se data-testid não existir, usa seletor alternativo
this.heroSection = page.getByTestId('hero-section')
  .or(page.locator('section').first());
```

Isso significa que:
- ✅ **Testes funcionam AGORA** (com seletores alternativos)
- ✅ **Testes melhoram DEPOIS** (quando data-testids forem adicionados)
- ✅ **Sem breaking changes**

---

## 📝 Checklist de Implementação

### Homepage
- [ ] Hero Section (`data-testid="hero-section"`)
- [ ] About Section (`data-testid="about-section"`)
- [ ] Pillars Section (`data-testid="pillars-section"`)
- [ ] Pillar Cards (`data-testid="pillar-card"`)
- [ ] News Section (`data-testid="news-section"`)
- [ ] News Cards (`data-testid="news-card"`)
- [ ] CTA Section (`data-testid="cta-section"`)

### Notícias
- [ ] News Grid (`data-testid="news-grid"`)
- [ ] News Card Component (`data-testid="news-card"`)

### Contato
- [ ] Contact Form (`data-testid="contact-form"`)
- [ ] Form Fields (`data-testid="contact-*"`)
- [ ] Success Message (`data-testid="success-message"`)
- [ ] Error Message (`data-testid="error-message"`)
- [ ] FAQ Section (`data-testid="faq-section"`)
- [ ] FAQ Items (`data-testid="faq-item"`)

### Layout
- [ ] Header (`data-testid="site-header"`)
- [ ] Navigation (`data-testid="main-nav"`)
- [ ] Mobile Menu (`data-testid="mobile-menu-toggle"`)
- [ ] Footer (`data-testid="site-footer"`)

---

## 🚀 Próximos Passos

1. **Implementar data-testids prioritários** (Homepage sections)
2. **Executar testes E2E** (`npm run test:e2e`)
3. **Verificar melhorias** (testes mais estáveis)
4. **Continuar com média prioridade**

---

## 📚 Referências

- [Playwright Best Practices - Test IDs](https://playwright.dev/docs/best-practices#use-data-testid)
- [Testing Library - data-testid](https://testing-library.com/docs/queries/bytestid/)

---

**Nota**: Os testes E2E já funcionam com os seletores alternativos (fallback). Adicionar data-testids é uma **otimização** que melhora a confiabilidade, não um requisito bloqueante.
