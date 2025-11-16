import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração Playwright para testes E2E do site ASOF
 * Otimizado para Apple Silicon (M3) com 8GB RAM
 */
export default defineConfig({
  // Diretório dos testes E2E
  testDir: './e2e',

  // Timeout global por teste (30 segundos)
  timeout: 30 * 1000,

  // Timeout para expects (5 segundos)
  expect: {
    timeout: 5000,
  },

  // Configuração de execução
  fullyParallel: true, // Testes paralelos para melhor performance
  forbidOnly: !!process.env.CI, // Não permitir .only() no CI
  retries: process.env.CI ? 2 : 0, // 2 tentativas no CI, 0 local
  workers: process.env.CI ? 2 : 3, // Otimizado para 8GB RAM

  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'], // Output no terminal
  ],

  // Configuração global para todos os testes
  use: {
    // URL base do app
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001',

    // Coletar trace apenas em falhas para economizar recursos
    trace: 'on-first-retry',

    // Screenshots apenas em falhas
    screenshot: 'only-on-failure',

    // Video apenas em falhas (economiza espaço)
    video: 'retain-on-failure',

    // Navegação
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,

    // Locale pt-BR
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },

  // Configuração de projetos (browsers)
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Testes mobile
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },

    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
    },

    // Testes de acessibilidade (apenas Chromium com Axe)
    {
      name: 'accessibility',
      testMatch: /.*\.a11y\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  // Servidor de desenvolvimento
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  // Diretórios de output
  outputDir: 'test-results/',

  // Configurações de snapshot
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
});
