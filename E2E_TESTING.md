# Guia de Testes E2E - ASOF Website

Documentação completa da suíte de testes End-to-End (E2E) implementada com Playwright para o site institucional da ASOF.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Executando Testes](#executando-testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tipos de Testes](#tipos-de-testes)
- [Page Object Model](#page-object-model)
- [CI/CD](#cicd)
- [Boas Práticas](#boas-práticas)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

Esta suíte de testes E2E foi desenvolvida para garantir a qualidade, acessibilidade e performance do site da ASOF. Utiliza Playwright, uma ferramenta moderna de automação de testes que oferece:

- ✅ **Cross-browser**: Testes em Chrome, Firefox e Safari
- ✅ **Mobile testing**: Simulação de dispositivos móveis
- ✅ **Acessibilidade**: Validação WCAG 2.1 AA com axe-core
- ✅ **Performance**: Medição de Core Web Vitals
- ✅ **TypeScript**: Type-safety em todos os testes
- ✅ **CI/CD**: Integração com GitHub Actions

### Tecnologias Utilizadas

- **Playwright** v1.56+: Framework de testes E2E
- **@axe-core/playwright**: Testes de acessibilidade
- **TypeScript**: Linguagem principal
- **GitHub Actions**: Automação CI/CD

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- macOS, Linux ou Windows

### Passo a Passo

```bash
# 1. Instalar dependências do projeto
npm install

# 2. Instalar navegadores do Playwright
npm run test:install

# Ou instalar navegadores específicos
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### Verificar Instalação

```bash
# Executar teste simples
npm run test:e2e -- --grep "deve carregar a homepage"
```

## 🧪 Executando Testes

### Comandos Principais

```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar com interface visual
npm run test:e2e:ui

# Executar em modo headed (ver navegador)
npm run test:e2e:headed

# Debug de testes
npm run test:e2e:debug
```

### Executar por Browser

```bash
# Apenas Chrome
npm run test:e2e:chromium

# Apenas Firefox
npm run test:e2e:firefox

# Apenas Safari (WebKit)
npm run test:e2e:webkit

# Testes mobile
npm run test:e2e:mobile
```

### Executar por Categoria

```bash
# Testes de acessibilidade
npm run test:a11y

# Testes de performance
npm run test:performance

# Testes de uma página específica
npx playwright test e2e/tests/static/home.spec.ts

# Executar teste específico
npx playwright test --grep "deve carregar a homepage"
```

### Visualizar Relatórios

```bash
# Abrir relatório HTML
npm run test:report

# Ou diretamente
npx playwright show-report
```

## 📁 Estrutura do Projeto

```
e2e/
├── pages/                          # Page Object Models
│   ├── base.page.ts               # Classe base com elementos comuns
│   ├── home.page.ts               # POM da homepage
│   ├── news.page.ts               # POM das notícias
│   ├── contact.page.ts            # POM do contato
│   └── index.ts                   # Barrel file
│
├── tests/                         # Arquivos de teste
│   ├── static/                    # Testes de páginas estáticas
│   │   ├── home.spec.ts
│   │   └── contact.spec.ts
│   ├── news/                      # Testes do sistema de notícias
│   │   └── news.spec.ts
│   ├── accessibility/             # Testes de acessibilidade
│   │   └── a11y.a11y.spec.ts
│   ├── performance/               # Testes de performance
│   │   └── web-vitals.spec.ts
│   └── cross-browser.spec.ts      # Testes cross-browser
│
├── fixtures/                      # Dados de teste
│   └── test-data.ts
│
├── utils/                         # Funções auxiliares
│   └── helpers.ts
│
└── __snapshots__/                 # Snapshots visuais

playwright.config.ts               # Configuração principal
playwright-report/                 # Relatórios HTML
test-results/                      # Resultados JSON/screenshots
```

## 🧩 Tipos de Testes

### 1. Testes de Páginas Estáticas

**Localização**: `e2e/tests/static/`

Validam a renderização e funcionalidade das páginas principais:
- Homepage
- Quem Somos
- Áreas de Atuação
- Transparência
- Contato

**Exemplo**:
```typescript
test('deve carregar a homepage com sucesso', async () => {
  await homePage.goto();
  await expect(homePage.heroTitle).toBeVisible();
});
```

### 2. Testes de Notícias

**Localização**: `e2e/tests/news/`

Validam o sistema de blog/notícias:
- Listagem de notícias
- Página individual de artigo
- Navegação entre artigos
- SEO e metadata

**Exemplo**:
```typescript
test('deve exibir artigo de notícia completo', async () => {
  await newsArticlePage.gotoBySlug('avanco-negociacao-salarial');
  await expect(newsArticlePage.articleTitle).toBeVisible();
});
```

### 3. Testes de Acessibilidade

**Localização**: `e2e/tests/accessibility/`

Validam conformidade com WCAG 2.1 AA:
- Contraste de cores
- Navegação por teclado
- ARIA labels e landmarks
- Estrutura semântica
- Alt text em imagens

**Exemplo**:
```typescript
test('deve passar em testes de acessibilidade', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

### 4. Testes de Performance

**Localização**: `e2e/tests/performance/`

Medem Core Web Vitals:
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID/INP** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- **FCP** (First Contentful Paint) < 1.8s
- **TTI** (Time to Interactive) < 3.8s

**Exemplo**:
```typescript
test('deve ter LCP adequado', async ({ page }) => {
  const lcp = await measureLCP(page);
  expect(lcp).toBeLessThan(2500);
});
```

### 5. Testes Cross-Browser

**Localização**: `e2e/tests/cross-browser.spec.ts`

Garantem compatibilidade entre:
- Chrome (Chromium)
- Firefox
- Safari (WebKit)
- Mobile Chrome
- Mobile Safari

## 🎨 Page Object Model (POM)

### Estrutura

Todos os Page Objects herdam de `BasePage`:

```typescript
// base.page.ts
export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;

  async goto(path: string) { ... }
  async waitForPageLoad() { ... }
}

// home.page.ts
export class HomePage extends BasePage {
  readonly heroTitle: Locator;
  readonly newsCards: Locator;

  async goto() {
    await super.goto('/');
  }
}
```

### Uso nos Testes

```typescript
import { HomePage } from '../pages';

test('exemplo', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await expect(homePage.heroTitle).toBeVisible();
});
```

### Benefícios

- ✅ Reutilização de código
- ✅ Manutenção centralizada
- ✅ Type-safety com TypeScript
- ✅ Melhor legibilidade dos testes

## 🔄 CI/CD

### GitHub Actions

Os testes são executados automaticamente em:
- Push para `main` ou `develop`
- Pull Requests
- Manualmente via `workflow_dispatch`

### Workflow

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npx playwright test --project=${{ matrix.browser }}
```

### Artefatos

Relatórios são salvos por 7-30 dias:
- HTML reports
- Screenshots de falhas
- Videos de testes
- Resultados JSON

## 📚 Boas Práticas

### 1. Organização de Testes

```typescript
// ✅ BOM - Testes organizados e descritivos
test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir título principal', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });
});

// ❌ EVITAR - Testes genéricos
test('test1', async ({ page }) => {
  await page.goto('/');
  // ...
});
```

### 2. Seletores

```typescript
// ✅ BOM - Usar roles e texto visível
await page.getByRole('button', { name: 'Enviar' });
await page.getByText('Bem-vindo');
await page.getByLabel('Email');

// ⚠️ ACEITÁVEL - IDs/classes quando necessário
await page.locator('[data-testid="hero"]');

// ❌ EVITAR - Seletores frágeis
await page.locator('div > div > p:nth-child(3)');
```

### 3. Esperas

```typescript
// ✅ BOM - Esperas automáticas do Playwright
await expect(page.locator('h1')).toBeVisible();

// ⚠️ USE COM CUIDADO - Timeouts fixos
await page.waitForTimeout(1000); // Apenas quando necessário

// ❌ EVITAR - Esperas arbitrárias
await new Promise(r => setTimeout(r, 5000));
```

### 4. Fixtures e Test Data

```typescript
// ✅ BOM - Usar fixtures centralizadas
import { testContacts } from '../fixtures/test-data';

test('preencher formulário', async () => {
  await contactPage.fillForm(testContacts.valid);
});

// ❌ EVITAR - Dados hardcoded nos testes
await page.fill('#email', 'teste@teste.com');
```

### 5. Paralelização

```typescript
// ✅ BOM - Testes independentes
test.describe('Testes paralelos', () => {
  test('teste 1', async () => { ... });
  test('teste 2', async () => { ... });
});

// ⚠️ ATENÇÃO - Testes sequenciais quando necessário
test.describe.serial('Fluxo completo', () => {
  test('passo 1', async () => { ... });
  test('passo 2', async () => { ... });
});
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Navegadores não instalados

```bash
Error: browserType.launch: Executable doesn't exist
```

**Solução**:
```bash
npm run test:install
```

#### 2. Timeout nos testes

```bash
Test timeout of 30000ms exceeded
```

**Solução**:
- Aumentar timeout no `playwright.config.ts`
- Verificar se dev server está rodando
- Otimizar seletores

#### 3. Testes falhando no CI mas passando localmente

**Soluções**:
- Adicionar esperas explícitas
- Usar `waitForLoadState('networkidle')`
- Verificar diferenças de timezone/locale

#### 4. Screenshots/videos não sendo salvos

**Solução**: Verificar configuração em `playwright.config.ts`:
```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

### Debug Avançado

#### Modo UI
```bash
npm run test:e2e:ui
```

#### Modo Debug
```bash
npm run test:e2e:debug
```

#### Inspector do Playwright
```bash
npx playwright codegen http://localhost:3000
```

#### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

## 📊 Métricas e Relatórios

### HTML Report

Visualizar após execução:
```bash
npm run test:report
```

Contém:
- Status de cada teste
- Screenshots de falhas
- Videos de execução
- Traces detalhados
- Métricas de performance

### JSON Results

Localização: `test-results/results.json`

Formato:
```json
{
  "suites": [...],
  "stats": {
    "expected": 45,
    "unexpected": 0,
    "skipped": 2
  }
}
```

### CI Dashboard

No GitHub Actions:
- Actions → E2E Tests
- Ver logs detalhados
- Baixar artefatos

## 🎯 Metas de Qualidade

### Coverage de Testes

- ✅ Todas as páginas principais
- ✅ Todos os fluxos de navegação
- ✅ Formulários e interações
- ✅ Mobile e desktop
- ✅ Cross-browser

### Performance Targets

- LCP: < 2.5s (bom)
- FID: < 100ms (bom)
- CLS: < 0.1 (bom)
- Lighthouse Score: 95+

### Acessibilidade

- WCAG 2.1 AA: 100% compliance
- Navegação por teclado: ✅
- Screen readers: compatível
- Contraste: mínimo 4.5:1

## 📞 Suporte

Problemas ou dúvidas sobre os testes:

1. Verificar esta documentação
2. Consultar [Playwright Docs](https://playwright.dev)
3. Abrir issue no repositório
4. Contatar time de desenvolvimento

## 🔄 Atualizações

Última atualização: 15/11/2024

Versões:
- Playwright: 1.56.1
- Node.js: 20+
- TypeScript: 5+

---

**Desenvolvido com ❤️ para ASOF**
