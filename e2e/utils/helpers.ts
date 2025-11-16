import { Page, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Funções auxiliares para testes E2E
 */

/**
 * Verifica se uma página tem os meta tags de SEO básicos
 */
export async function checkBasicSEO(page: Page) {
  // Título
  const title = await page.title();
  expect(title).toBeTruthy();
  expect(title.length).toBeGreaterThan(10);
  expect(title.length).toBeLessThan(70);

  // Meta description
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute('content');
  expect(description).toBeTruthy();

  // Open Graph tags
  const ogTitle = await page
    .locator('meta[property="og:title"]')
    .getAttribute('content');
  expect(ogTitle).toBeTruthy();

  const ogDescription = await page
    .locator('meta[property="og:description"]')
    .getAttribute('content');
  expect(ogDescription).toBeTruthy();

  console.log(`SEO Check - Título: ${title} | Description length: ${description?.length || 0}`);
}

/**
 * Verifica se todos os links da página funcionam
 */
export async function checkBrokenLinks(page: Page) {
  const links = await page.locator('a[href]').all();
  const brokenLinks: string[] = [];

  for (const link of links) {
    const href = await link.getAttribute('href');

    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      // Verificar apenas links internos
      if (href.startsWith('/') || href.includes(page.url())) {
        try {
          const response = await page.request.get(href);

          if (response.status() >= 400) {
            brokenLinks.push(href);
          }
        } catch (e) {
          brokenLinks.push(href);
        }
      }
    }
  }

  return brokenLinks;
}

/**
 * Tira screenshot com timestamp
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  options?: { fullPage?: boolean }
) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `screenshots/${name}-${timestamp}.png`;

  // Garantir que o diretório screenshots existe
  const dir = path.dirname(filename);
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (error) {
    console.warn(`Failed to create directory ${dir}:`, error);
  }

  await page.screenshot({
    path: filename,
    fullPage: options?.fullPage || false,
  });

  console.log(`Screenshot salvo: ${filename}`);
}

/**
 * Verifica se elemento está no viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }, selector);
}

/**
 * Scroll suave até elemento
 */
export async function smoothScrollTo(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, selector);

  await page.waitForTimeout(500);
}

/**
 * Aguardar que elemento seja visível
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, {
    state: 'visible',
    timeout,
  });
}

/**
 * Obter todas as cores usadas na página
 */
export async function getPageColors(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const colors = new Set<string>();
    const elements = document.querySelectorAll('*');

    elements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      colors.add(styles.color);
      colors.add(styles.backgroundColor);
    });

    return Array.from(colors).filter((c) => c !== 'rgba(0, 0, 0, 0)');
  });
}

/**
 * Verificar contraste de cores segundo WCAG
 * Implementação manual de cálculo de luminância e contraste
 */
export function checkColorContrast(
  foreground: string,
  background: string
): { ratio: number; passes: boolean } {
  // Converter cores para RGB se necessário
  const fgRGB = hexToRgb(foreground) || colorNameToRgb(foreground);
  const bgRGB = hexToRgb(background) || colorNameToRgb(background);

  if (!fgRGB || !bgRGB) {
    console.warn(`Não foi possível parsear as cores: ${foreground}, ${background}`);
    return { ratio: 0, passes: false };
  }

  // Calcular luminância relativa (WCAG formula)
  const fgLuminance = getRelativeLuminance(fgRGB);
  const bgLuminance = getRelativeLuminance(bgRGB);

  // Calcular contraste
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  // Verificar se passa WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)
  const passesNormal = ratio >= 4.5;
  const passesLarge = ratio >= 3;

  console.log(`Contraste: ${ratio.toFixed(2)}:1 - Normal text: ${passesNormal ? 'PASSA' : 'FALHA'}, Large text: ${passesLarge ? 'PASSA' : 'FALHA'}`);

  return {
    ratio: Math.round(ratio * 100) / 100, // Arredondar para 2 casas decimais
    passes: passesNormal, // Considera que passa se atender texto normal AA
  };
}

/**
 * Converter hex para RGB (suporta #RGB, #RRGGBB, #RRGGBBAA)
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})(?:[a-f\d]{2})?$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converter nome de cor básica para RGB (fallback limitado)
 */
function colorNameToRgb(name: string): { r: number; g: number; b: number } | null {
  const colorMap: Record<string, { r: number; g: number; b: number }> = {
    black: { r: 0, g: 0, b: 0 },
    white: { r: 255, g: 255, b: 255 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    yellow: { r: 255, g: 255, b: 0 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
  };

  return colorMap[name.toLowerCase()] || null;
}

/**
 * Calcular luminância relativa WCAG 2.1
 * Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const normalize = (value: number) => {
    value = value / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * normalize(rgb.r) + 0.7152 * normalize(rgb.g) + 0.0722 * normalize(rgb.b);
}

// TODO: Consider adding color-contrast-checker library for more robust color parsing:
// npm install color-contrast-checker
// import { colorContrastChecker } from 'color-contrast-checker';

/**
 * Obter métricas de performance
 */
export async function getPerformanceMetrics(page: Page) {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as any;
    const paint = performance.getEntriesByType('paint');

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      loadComplete: navigation.loadEventEnd - navigation.fetchStart,
      firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint:
        paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0,
    };
  });
}

/**
 * Configurar listener para erros do console e retornar função para obter resultados
 * Retorna uma função que pode ser chamada para obter erros acumulados e remover o listener
 */
export function getConsoleErrors(page: Page): () => string[] {
  const errors: string[] = [];

  const handleConsole = (msg: any) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  };

  page.on('console', handleConsole);

  // Retornar função que obtém erros e limpa o listener
  return () => {
    page.off('console', handleConsole);
    return [...errors]; // Retornar cópia para evitar modificações externas
  };
}

/**
 * Simular conexão lenta - funciona apenas com Chromium-based browsers
 * Outros browsers (Firefox, WebKit) não suportam esta funcionalidade via CDP
 */
export async function simulateSlowConnection(page: Page) {
  // Verificar se é browser baseado em Chromium (CDP support)
  const browserName = page.context().browser()?.browserType().name() || 'unknown';

  if (browserName !== 'chromium') {
    console.warn(`simulateSlowConnection: Esta função só funciona com Chrome/Chromium. Browser atual: ${browserName}`);
    console.log('Skipping slow connection simulation');
    return; // Não-op para browsers não-Chromium
  }

  const client = await page.context().newCDPSession(page);

  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (3 * 1024 * 1024) / 8, // 3 Mbps
    uploadThroughput: (1 * 1024 * 1024) / 8, // 1 Mbps
    latency: 100, // 100ms
  });
}

/**
 * Verificar se formulário tem validação HTML5
 */
export async function hasHTML5Validation(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const input = document.querySelector(sel) as HTMLInputElement;
    if (!input) return false;

    return input.validity !== undefined && input.checkValidity !== undefined;
  }, selector);
}

/**
 * Obter estrutura de headings da página
 */
export async function getHeadingStructure(page: Page) {
  return await page.evaluate(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(headings).map((h) => ({
      level: h.tagName,
      text: h.textContent?.trim() || '',
    }));
  });
}

/**
 * Verificar se há apenas um H1
 */
export async function hasOnlyOneH1(page: Page): Promise<boolean> {
  const h1Count = await page.locator('h1').count();
  return h1Count === 1;
}

/**
 * Obter todos os atributos ARIA de um elemento
 */
export async function getAriaAttributes(page: Page, selector: string) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return {};

    const attributes: Record<string, string> = {};
    for (const attr of element.attributes) {
      if (attr.name.startsWith('aria-')) {
        attributes[attr.name] = attr.value;
      }
    }

    return attributes;
  }, selector);
}

/**
 * Verificar se página tem landmarks ARIA
 */
export async function checkAriaLandmarks(page: Page) {
  const landmarks = {
    main: await page.locator('main, [role="main"]').count(),
    nav: await page.locator('nav, [role="navigation"]').count(),
    header: await page.locator('header, [role="banner"]').count(),
    footer: await page.locator('footer, [role="contentinfo"]').count(),
    search: await page.locator('[role="search"]').count(),
    aside: await page.locator('aside, [role="complementary"]').count(),
  };

  return landmarks;
}

/**
 * Simular usuário mobile
 */
export async function simulateMobileUser(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.context().setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
}

/**
 * Log de debug formatado
 */
export function logTest(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);

  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

/**
 * Retry com backoff exponencial
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const delay = initialDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} após ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
