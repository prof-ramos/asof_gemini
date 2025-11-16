# 📚 Documentação Técnica para LLMs - ASOF Website

Este diretório contém documentação técnica estruturada especificamente para **Large Language Models (LLMs)** trabalharem no projeto ASOF sem cometer erros comuns.

## 🎯 OBJETIVO

Orientar LLMs na compreensão e implementação correta do projeto, prevenindo erros relacionados a:
- Server vs Client Components (Next.js 15 App Router)
- TypeScript strict mode patterns
- TailwindCSS customização
- E2E testing com Playwright
- MDX content management
- Performance e accessibility standards

## 📋 GUIAS DISPONÍVEIS

### 🔧 Core Infrastructure
- **[Projeto Overview](./llm-project-overview.md)** - Visão geral completa do projeto e regras críticas
- **[Next.js 15 App Router](./llm-nextjs-15-app-router.md)** - Server/Client Components, App Router patterns
- **[TypeScript Strict Mode](./llm-typescript-strict.md)** - Tipagem rigorosa, utility types, error prevention

### 🎨 Frontend & Styling
- **[TailwindCSS Customization](./llm-tailwind-customization.md)** - Sistema de design ASOF, patterns de styling
- **[React 19 Patterns](./llm-react-19-patterns.md)** - Componentes, hooks, state management

### 📄 Content & Data
- **[MDX Integration](./llm-mdx-integration.md)** - Sistema de blog, frontmatter, reading time
- **[Prisma ORM](./prisma-documentation.md)** - Database setup, schema, queries, migrations, best practices
- **[API Patterns](./llm-api-patterns.md)** - Server actions, data fetching patterns

### 🧪 Testing & Quality
- **[E2E Testing com Playwright](./llm-e2e-testing.md)** - Page objects, isolation, accessibility testing
- **[Component Testing](./llm-component-testing.md)** - Unit/integration tests, Storybook
- **[Performance Testing](./llm-performance-testing.md)** - Web Vitals, Core Web Vitals

### 🚀 Deployment & Production
- **[Vercel Deployment](./llm-deployment-vercel.md)** - Build optimization, CDN, environment variables
- **[CI/CD Pipeline](./llm-cicd-pipeline.md)** - GitHub Actions, automated testing

### 📚 Development Workflow
- **[File Structure](./llm-file-structure.md)** - Estrutura obrigatória, naming conventions
- **[Coding Conventions](./llm-coding-convents.md)** - ESLint rules, code style, commit messages
- **[Error Prevention](./llm-error-prevention.md)** - Common mistakes e soluções

## ⚠️ LEITURA OBRIGATÓRIA

**ANTES de qualquer modificação no código:**

1. **Leia o [Projeto Overview](./llm-project-overview.md)** - Regras críticas e arquitetura
2. **Entenda [App Router patterns](./llm-nextjs-15-app-router.md)** - Server vs Client Components
3. **Revise [TypeScript strict mode](./llm-typescript-strict.md)** - Tipagem rigorosa obrigatória
4. **Consulte guias específicos** da tecnologia que será modificada

## 🎨 CONVENÇÕES DE DOCUMENTAÇÃO

### Código Examples
```typescript
// ✅ CORRECT - Sempre mostrar o jeito certo primeiro
export function MyComponent() {
  return <div>Hello</div>
}

// ❌ WRONG - Em seguida mostrar o erro comum
export function MyComponent() {
  const data = useState() // ERROR: Server Component
  return <div>Hello</div>
}
```

### Alertas Importantes
- 🚨 **CRITICAL**: Erros que quebram a aplicação
- ⚠️ **WARNING**: Problemas de performance ou DX
- 💡 **TIP**: Melhores práticas recomendadas

## 🔄 ATUALIZAÇÃO DA DOCUMENTAÇÃO

Quando novas tecnologias forem adicionadas ou patterns mudarem:

1. **Atualize os guias relevantes**
2. **Adicione novos guias** se necessário
3. **Documente breaking changes** claramente
4. **Inclua exemplos práticos** de implementação

## 🤝 CONTRIBUIÇÃO

Esta documentação é mantida pela equipe de desenvolvimento. Contribuições são bem-vindas:

1. **Proponha mudanças** via Issues
2. **Siga o padrão** dos guias existentes
3. **Inclua exemplos** e casos de erro
4. **Foque em especificidade** para LLMs

---

## 📞 SUPORTE

- **Documentação Técnica**: Este repositório `/docs/`
- **Código Fonte**: Verifique `README.md` na raiz
- **Issues**: Abra tickets para melhorias na documentação

**LEMBRADOR**: Sempre priorize **Server Components**, **TypeScript strict**, **accessibility** e **performance** ao trabalhar neste projeto.
