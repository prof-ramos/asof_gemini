# E2E Test Suite - Quick Reference

## 🚀 Quick Start

```bash
# Instalar navegadores
npm run test:install

# Executar todos os testes
npm run test:e2e

# Ver interface visual
npm run test:e2e:ui

# Ver relatório
npm run test:report
```

## 📁 Estrutura de Arquivos

```
e2e/
├── pages/           → Page Object Models
├── tests/           → Arquivos de teste (.spec.ts)
├── fixtures/        → Dados de teste
├── utils/           → Funções auxiliares
└── __snapshots__/   → Snapshots visuais
```

## 🧪 Criar Novo Teste

### 1. Criar arquivo de teste

```typescript
// e2e/tests/minha-pagina.spec.ts
import { test, expect } from '@playwright/test';
import { MinhaPage } from '../pages';

test.describe('Minha Página', () => {
  test('deve fazer algo', async ({ page }) => {
    const minhaPage = new MinhaPage(page);
    await minhaPage.goto();

    await expect(minhaPage.elemento).toBeVisible();
  });
});
```

### 2. Criar Page Object (se necessário)

```typescript
// e2e/pages/minha-page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class MinhaPage extends BasePage {
  readonly elemento: Locator;

  constructor(page: Page) {
    super(page);
    this.elemento = page.locator('#meu-elemento');
  }

  async goto() {
    await super.goto('/minha-rota');
  }
}
```

### 3. Exportar no index.ts

```typescript
// e2e/pages/index.ts
export { MinhaPage } from './minha-page';
```

## 🎯 Comandos Úteis

### Desenvolvimento

```bash
# Debug de um teste específico
npx playwright test --debug --grep "nome do teste"

# Executar apenas testes modificados
npx playwright test --only-changed

# Modo headed (ver navegador)
npm run test:e2e:headed

# Gerar código de teste automaticamente
npx playwright codegen http://localhost:3000
```

### Browsers

```bash
# Apenas Chrome
npm run test:e2e:chromium

# Apenas Firefox
npm run test:e2e:firefox

# Apenas Safari
npm run test:e2e:webkit

# Mobile
npm run test:e2e:mobile
```

### Categorias

```bash
# Acessibilidade
npm run test:a11y

# Performance
npm run test:performance

# Arquivo específico
npx playwright test e2e/tests/static/home.spec.ts
```

## 📝 Padrões de Código

### Seletores (em ordem de preferência)

```typescript
// 1. Role
page.getByRole('button', { name: 'Enviar' })

// 2. Texto visível
page.getByText('Bem-vindo')

// 3. Label
page.getByLabel('Email')

// 4. Test ID
page.getByTestId('hero-section')

// 5. Locator (último recurso)
page.locator('.minha-classe')
```

### Assertions

```typescript
// Visibilidade
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// Conteúdo
await expect(element).toHaveText('Texto')
await expect(element).toContainText('parcial')

// Atributos
await expect(element).toHaveAttribute('href', '/link')
await expect(element).toHaveClass('ativo')

// Estado
await expect(element).toBeEnabled()
await expect(element).toBeDisabled()
await expect(element).toBeChecked()

// URL
await expect(page).toHaveURL(/\/pagina/)
await expect(page).toHaveTitle(/Título/)
```

### Esperas

```typescript
// ✅ Automáticas (preferir)
await expect(element).toBeVisible()
await element.click()

// ⚠️ Explícitas (quando necessário)
await page.waitForLoadState('networkidle')
await page.waitForSelector('.classe')

// ❌ Evitar
await page.waitForTimeout(1000)
```

## 🔍 Debug

### Console Logs

```typescript
test('debug', async ({ page }) => {
  // Ver erros do console
  page.on('console', msg => console.log(msg.text()));

  // Ver requests
  page.on('request', req => console.log(req.url()));

  // Screenshot
  await page.screenshot({ path: 'debug.png' });
});
```

### Pausar Execução

```typescript
// Pausar em um ponto específico
await page.pause();

// Modo debug
npx playwright test --debug
```

### Trace Viewer

```typescript
// Configurar no playwright.config.ts
use: {
  trace: 'on-first-retry',
}

// Visualizar
npx playwright show-trace trace.zip
```

## 🧩 Fixtures e Test Data

### Usar dados de teste

```typescript
import { testContacts, testUrls } from '../fixtures/test-data';

test('exemplo', async () => {
  await page.goto(testUrls.contact);
  await fillForm(testContacts.valid);
});
```

### Gerar dados dinâmicos

```typescript
import { generateRandomEmail } from '../fixtures/test-data';

test('exemplo', async () => {
  const email = generateRandomEmail();
  await page.fill('#email', email);
});
```

## 📊 Relatórios

### HTML Report

```bash
npm run test:report
```

### CI/CD

- Logs disponíveis em GitHub Actions
- Artifacts salvos por 7-30 dias
- Screenshots de falhas incluídos

## ⚡ Performance

### Otimizar Testes

```typescript
// ✅ Paralelizar testes independentes
test.describe.configure({ mode: 'parallel' });

// ✅ Reusar estado de autenticação
test.use({ storageState: 'auth.json' });

// ✅ Limitar workers em máquinas com pouca RAM
// playwright.config.ts → workers: 2
```

### Reduzir Tempo de Execução

- Use `page.goto()` apenas quando necessário
- Reutilize page objects
- Agrupe testes relacionados
- Execute apenas testes relevantes

## 🎨 Visual Testing

### Snapshot Testing

```typescript
test('visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## 🌐 Cross-Browser

Testes executam automaticamente em:
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

Para testar apenas um browser:
```bash
npm run test:e2e:chromium
```

## 📱 Mobile Testing

```typescript
test('mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // ou usar preset
  await page.emulate(devices['iPhone 13']);
});
```

## ♿ Acessibilidade

### Testes automáticos com axe

```typescript
import AxeBuilder from '@axe-core/playwright';

test('a11y', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## 🔐 Boas Práticas

### DO ✅

- Usar Page Object Model
- Testes independentes e isolados
- Nomes descritivos para testes
- Assertions específicas
- Cleanup após testes

### DON'T ❌

- Hardcode de dados sensíveis
- Testes dependentes de ordem
- Sleeps/timeouts fixos desnecessários
- Seletores frágeis (nth-child)
- Ignorar falhas intermitentes

## 📚 Recursos

- [Playwright Docs](https://playwright.dev)
- [Documentação Completa](../E2E_TESTING.md)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## 🆘 Troubleshooting

### Teste falhando?

1. Execute em modo debug: `npm run test:e2e:debug`
2. Verifique se dev server está rodando
3. Veja screenshots em `test-results/`
4. Consulte logs do CI

### Navegador não abre?

```bash
npm run test:install
```

### Timeout?

Aumente em `playwright.config.ts`:
```typescript
timeout: 60000,
```

---

**Dúvidas?** Consulte a [documentação completa](../E2E_TESTING.md)
