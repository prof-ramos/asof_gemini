# E2E Testing com Playwright - LLM Guide

## 🎯 IMMEDIATE CRITICAL RULES

### 1. SEMPRE use Page Objects
```typescript
// ✅ ALWAYS DO THIS - Page Object Pattern
export class HomePage extends BasePage {
  private readonly heroTitle = this.page.locator('h1')
  private readonly navLinks = this.page.locator('nav a')

  async getHeroTitle(): Promise<string> {
    return await this.heroTitle.textContent() ?? ''
  }

  async navigateToSection(section: string): Promise<void> {
    await this.navLinks.filter({ hasText: section }).click()
    await this.waitForPageLoad()
  }
}

// ❌ NEVER DO THIS - Direct locators in tests
test('homepage loads', async ({ page }) => {
  await page.goto('/')
  const title = await page.locator('h1').textContent() // Bad practice
})
```

### 2. ISOLAMENTO de testes (NUNCA dependências entre testes)
```typescript
// ✅ ALWAYS DO THIS - Independent tests
test.describe('HomePage', () => {
  test.beforeEach(async ({ page }) => {
    // FRESH page load for EACH test
    const homePage = new HomePage(page)
    await homePage.goto()
  })

  test('displays hero section', async ({ page }) => {
    const homePage = new HomePage(page)
    await expect(homePage.heroTitle).toBeVisible()
  })

  test('navigation works', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.navigateToSection('Sobre')
    await homePage.waitForPageLoad()
  })
})

// ❌ NEVER DO THIS - Dependent tests
let page: Page
let homePage: HomePage

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage() // Single shared page
})

test('homepage loads', async () => {
  homePage = new HomePage(page)
  await homePage.goto() // First test sets up state
})

test('navigation works', async () => {
  // ASSUME first test ran and page is loaded - FRAGILE
  await homePage.navigateToSection('Sobre')
})
```

## 📁 Estrutura de Testes OBRIGATÓRIA

```
e2e/
├── tests/
│   ├── static/           # Componentes estáticos
│   │   ├── home.spec.ts
│   │   └── contact.spec.ts
│   ├── news/            # Funcionalidades específicas
│   │   └── news.spec.ts
│   ├── accessibility/   # A11y compliance
│   │   └── a11y.spec.ts
│   ├── performance/     # Performance metrics
│   │   └── web-vitals.spec.ts
│   └── cross-browser/   # Compatibilidade browsers
│       └── cross-browser.spec.ts
├── pages/               # Page Objects
│   ├── base.page.ts     # Base class
│   ├── home.page.ts
│   ├── contact.page.ts
│   ├── news.page.ts
│   └── index.ts         # Page exports
├── utils/               # Test utilities
│   └── helpers.ts       # Custom assertions/helpers
├── fixtures/            # Test data
│   └── test-data.ts     # Mock data + utilities
├── __snapshots__/       # Visual regression snapshots
└── DATA_TESTIDS.md      # Test ID documentation
```

## 🏗️ Page Object Pattern

### Base Page Class
```typescript
// e2e/pages/base.page.ts
export abstract class BasePage {
  protected readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path)
    await this.waitForPageLoad()
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
    // Additional waiting for client-side hydration
    await this.page.waitForTimeout(100)
  }

  async waitForElement(selector: string, timeout = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout, state: 'visible' })
  }
}
```

### HomePage Implementation
```typescript
// e2e/pages/home.page.ts
import { expect } from '@playwright/test'
import { BasePage } from './base.page'

export class HomePage extends BasePage {
  // Private locators (encapsulated)
  private readonly heroTitle = this.page.getByRole('heading', { level: 1 })
  private readonly heroSubtitle = this.page.locator('h1 + p')
  private readonly ctaButton = this.page.getByRole('link', { name: /saiba mais/i })

  // Public methods (API for tests)
  async getHeroTitle(): Promise<string> {
    return await this.heroTitle.textContent() ?? ''
  }

  async getHeroSubtitle(): Promise<string> {
    return await this.heroSubtitle.textContent() ?? ''
  }

  async clickCTAButton(): Promise<void> {
    await this.ctaButton.click()
    await this.waitForPageLoad()
  }

  async expectHeroSectionVisible(): Promise<void> {
    await expect(this.heroTitle).toBeVisible()
    await expect(this.heroSubtitle).toBeVisible()
    await expect(this.ctaButton).toBeVisible()
  }
}
```

### HomePage Test
```typescript
// e2e/tests/static/home.spec.ts
import { test } from '@playwright/test'
import { HomePage } from '../../pages'

test.describe('Homepage', () => {
  test('displays hero section correctly', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    // Test page object API
    await expect(page).toHaveTitle(/ASOF/)
    await homePage.expectHeroSectionVisible()

    const title = await homePage.getHeroTitle()
    expect(title).toContain('ASOF')
  })

  test('CTA button navigates correctly', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()

    await homePage.clickCTAButton()
    await expect(page).toHaveURL(/\/sobre/)
  })
})
```

## 🎨 Accessibility Testing

### Mandatory A11y Tests
```typescript
// e2e/tests/accessibility/a11y.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Compliance', () => {
  test('homepage passes WCAG AA standards', async ({ page }) => {
    await page.goto('/')

    // Run axe-core accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    // Assertions for critical issues only (warnings allowed)
    expect(accessibilityScanResults.violations).toEqual(
      expect.arrayContaining([]) // No violations expected
    )
  })

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/')

    // Focus management
    await page.keyboard.press('Tab')
    await expect(page.locator('nav a').first()).toBeFocused()

    // Navigate through focusable elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // ARIA attributes present
    const buttons = page.locator('button, [role="button"]')
    for (const button of await buttons.all()) {
      const ariaLabel = await button.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
    }
  })

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/')

    // Check specific elements for contrast
    const headings = await page.getByRole('heading').all()
    for (const heading of headings) {
      const contrastRatio = await heading.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return getContrastRatio(style.color, style.backgroundColor) // Custom function
      })

      expect(contrastRatio).toBeGreaterThanOrEqual(4.5) // WCAG AA
    }
  })
})
```

## 🔍 Performance Testing

### Web Vitals Monitoring
```typescript
// e2e/tests/performance/web-vitals.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Core Web Vitals', () => {
  test('meets LCP threshold', async ({ page }) => {
    // Measure Largest Contentful Paint
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          resolve(entries[entries.length - 1]?.renderTime || 0)
        }).observe({ type: 'largest-contentful-paint', buffered: true })

        setTimeout(() => resolve(0), 5000) // Timeout fallback
      })
    })

    expect(lcp).toBeLessThan(2500) // Good: < 2.5s
    console.log(`LCP: ${lcp}ms`)
  })

  test('meets CLS threshold', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Trigger layout shifts by scrolling
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(1000)

    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
        }).observe({ type: 'layout-shift', buffered: true })

        setTimeout(() => resolve(clsValue), 2000)
      })
    })

    expect(cls).toBeLessThan(0.1) // Good: < 0.1
    console.log(`CLS: ${cls}`)
  })
})
```

## 🌐 Cross-Browser Testing

### Multi-browser Test Configuration
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  reporter: process.env.CI
    ? [['github'], ['html']]
    : [['html'], ['line']],
})
```

### Cross-browser Visual Regression
```typescript
// e2e/tests/cross-browser/visual-regression.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('homepage looks consistent across browsers', async ({ page, browserName }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Take screenshot per browser
    await expect(page).toHaveScreenshot(`${browserName}-homepage.png`, {
      fullPage: true,
      threshold: 0.2, // Allow 20% pixel difference tolerance
    })
  })

  test('fonts render correctly', async ({ page, browserName }) => {
    await page.goto('/')

    const h1Font = await page.locator('h1').evaluate((el) => {
      return window.getComputedStyle(el).fontFamily
    })

    // Normalize font string for cross-browser comparison
    const normalizedFont = h1Font.replace(/["']/g, '').toLowerCase()

    // Check for expected fonts (handle fallbacks)
    const hasExpectedFont = ['inter', 'playfair display'].some(font =>
      normalizedFont.includes(font)
    )

    expect(hasExpectedFont).toBeTruthy()
    console.log(`${browserName} - Font: ${h1Font}`)
  })
})
```

## 🛠️ Custom Test Utilities

### Extended Matchers
```typescript
// e2e/utils/helpers.ts
import { expect } from '@playwright/test'

expect.extend({
  async toHaveAccessibleName(locator, expectedName) {
    const name = await locator.getAttribute('aria-label') ||
                 await locator.getAttribute('aria-labelledby') ||
                 await locator.textContent()

    const pass = name?.includes(expectedName) ?? false

    return {
      message: () => `expected ${locator} to have accessible name "${expectedName}"`,
      pass,
    }
  },

  async toHaveGoodContrast(locator) {
    const contrastRatio = await locator.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return calculateContrastRatio(style.color, style.backgroundColor)
    })

    const pass = contrastRatio >= 4.5 // WCAG AA normal text

    return {
      message: () => `expected ${locator} to have contrast ratio >= 4.5, got ${contrastRatio}`,
      pass,
    }
  },
})
```

### Screenshot Helper with Directory Management
```typescript
// e2e/utils/helpers.ts
import * as path from 'path'
import * as fs from 'fs'

export async function takeScreenshot(
  page: Page,
  name: string,
  options?: { fullPage?: boolean }
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/:/g, '-')
  const filename = `screenshots/${name}-${timestamp}.png`

  // Ensure directory exists
  const dir = path.dirname(filename)
  try {
    fs.mkdirSync(dir, { recursive: true })
  } catch (error) {
    console.warn(`Failed to create directory ${dir}:`, error)
  }

  await page.screenshot({
    path: filename,
    fullPage: options?.fullPage || false,
  })

  console.log(`Screenshot saved: ${filename}`)
}
```

### Console Error Monitoring
```typescript
// e2e/utils/helpers.ts
export function getConsoleErrors(page: Page): () => string[] {
  const errors: string[] = []

  const handleConsole = (msg: any) => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  }

  page.on('console', handleConsole)

  // Return cleanup function that returns accumulated errors
  return () => {
    page.off('console', handleConsole)
    return [...errors]
  }
}
```

## 🔧 Test Organization Best Practices

### Test Isolation and Cleanup
```typescript
// Global test setup
import { test as baseTest } from '@playwright/test'
import { HomePage, NewsPage } from '../pages'

const test = baseTest.extend<{
  homePage: HomePage
  newsPage: NewsPage
}>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await use(homePage)
    // Cleanup will run after each test
  },

  newsPage: async ({ page }, use) => {
    const newsPage = new NewsPage(page)
    await use(newsPage)
  },
})

// Usage in tests
test.describe('User Journey', () => {
  test('complete homepage to news flow', async ({ homePage, newsPage }) => {
    await homePage.goto()
    await homePage.expectHeroSectionVisible()

    await homePage.clickNewsLink()
    await newsPage.waitForPageLoad()

    await newsPage.expectNewsGridVisible()
  })
})
```

### Test Data Management
```typescript
// e2e/fixtures/test-data.ts
export const testContacts = {
  valid: {
    name: 'João Silva',
    email: 'joao.silva@teste.com',
    phone: '(61) 99999-9999',
    subject: 'Informações sobre associação',
    message: 'Gostaria de receber mais informações...',
  },
  invalid: {
    name: '',
    email: 'invalid-email',
    message: '',
  },
}

export const generateRandomEmail = (): string => {
  const timestamp = Date.now()
  return `teste${timestamp}@exemplo.com`
}

export const generateRandomPhone = (): string => {
  const areaCode = Math.floor(Math.random() * 90) + 10
  const firstPart = Math.floor(Math.random() * 9000) + 90000
  const secondPart = Math.floor(Math.random() * 9000) + 1000
  return `(${areaCode}) ${firstPart}-${secondPart}`
}
```

## 🚨 ERROR PREVENTION RULES

### ❌ NEVER DO THESE:

1. **Sleep/delays instead of proper waiting**
```typescript
// ❌ WRONG
await page.waitForTimeout(3000) // Arbitrary delay - FRAGILE

// ✅ CORRECT
await page.waitForLoadState('networkidle') // Wait for actual condition
await page.waitForSelector('.content-loaded') // Wait for specific element
```

2. **Shared state between tests**
```typescript
// ❌ WRONG
let sharedPage: Page

test.beforeAll(async ({ browser }) => {
  sharedPage = await browser.newPage()
})

test('test 1', () => { /* uses sharedPage */ })
test('test 2', () => { /* depends on test 1 state */ })

// ✅ CORRECT
test('test 1', async ({ page }) => { /* fresh page */ })
test('test 2', async ({ page }) => { /* fresh page */ })
```

3. **Hard-coded timeouts**
```typescript
// ❌ WRONG
await page.click('button', { timeout: 10000 })

// ✅ CORRECT
await expect(page.locator('button')).toBeVisible({ timeout: 5000 })
await page.click('button') // Rely on default Playwright robotics
```

4. **No accessibility testing**
```typescript
// ❌ WRONG
test('form works', async ({ page }) => {
  await page.fill('input[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
})

// ✅ CORRECT
test('form works with accessibility', async ({ page }) => {
  const emailInput = page.getByLabel('Email') // Use semantic locators
  await emailInput.fill('test@example.com')

  const submitButton = page.getByRole('button', { name: 'Submit' })
  await expect(submitButton).toBeEnabled()
  await submitButton.click()
})
```

## 📊 Test Reporting and CI/CD

### GitHub Actions E2E Workflow
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

## 📚 Best Practices Summary

### 1. Page Objects Always
- Encapsulate DOM selectors
- Provide clean API for tests
- Enable refactoring without breaking tests

### 2. Isolation is Key
- Each test gets fresh state
- No dependencies between tests
- Parallel execution safe

### 3. Wait Intelligently
- Wait for elements, not arbitrary time
- Prefer Playwright auto-waiting
- Custom timeouts for specific cases only

### 4. Accessibility First
- ARIA labels and roles in all components
- Keyboard navigation verification
- Color contrast testing
- Screen reader compatibility

### 5. Visual Regression
- Screenshot comparison across browsers
- Approved baseline management
- Tolerance for minor differences

### 6. CI/CD Integration
- Fast feedback on PRs
- Full matrix testing on main
- Preserve test artifacts

Remember: E2E tests are expensive to maintain. Focus on critical user journeys, not edge cases. Use them to prevent regression, not to test every possible combination.
