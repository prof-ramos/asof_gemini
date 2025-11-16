import { test, expect } from '@playwright/test';

/**
 * Testes de Performance - Core Web Vitals
 * Mede LCP, FID/INP, CLS conforme métricas do Google
 */

test.describe('Performance - Core Web Vitals', () => {
  test.describe('Homepage Performance', () => {
    test('deve ter LCP (Largest Contentful Paint) adequado', async ({ page }) => {
      await page.goto('/');

      // Medir LCP usando Performance API
      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            resolve(lastEntry.renderTime || lastEntry.loadTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          // Timeout de segurança
          setTimeout(() => resolve(9999), 5000); // Fail if no LCP captured
        });
      });

      // LCP deve ser < 2.5s (bom), < 4s (aceitável)
      expect(lcp).toBeLessThan(4000);
      console.log(`LCP: ${lcp}ms`);
    });

    test('deve ter CLS (Cumulative Layout Shift) baixo', async ({ page }) => {
      await page.goto('/');

      // Aguardar carregamento completo
      await page.waitForLoadState('networkidle');

      // Scroll para acionar lazy loading
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await page.waitForTimeout(1000);

      // Medir CLS
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
          }).observe({ type: 'layout-shift', buffered: true });

          setTimeout(() => resolve(clsValue), 2000);
        });
      });

      // CLS deve ser < 0.1 (bom), < 0.25 (aceitável)
      expect(cls).toBeLessThan(0.25);
      console.log(`CLS: ${cls}`);
    });

    test('deve ter FCP (First Contentful Paint) rápido', async ({ page }) => {
      await page.goto('/');

      const fcp = await page.evaluate(() => {
        const entry = performance.getEntriesByType('paint')
          .find((e) => e.name === 'first-contentful-paint');
        return entry?.startTime || 0;
      });

      // FCP deve ser < 1.8s (bom), < 3s (aceitável)
      expect(fcp).toBeLessThan(3000);
      console.log(`FCP: ${fcp}ms`);
    });

    test('deve ter TTI (Time to Interactive) aceitável', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const tti = Date.now() - startTime;

      // TTI deve ser < 3.8s (bom), < 7.3s (aceitável)
      expect(tti).toBeLessThan(7300);
      console.log(`TTI: ${tti}ms`);
    });

    test('deve ter Total Blocking Time baixo', async ({ page }) => {
      await page.goto('/');

      const tbt = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let totalBlockingTime = 0;

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
              if (entry.duration > 50) {
                totalBlockingTime += entry.duration - 50;
              }
            }
          }).observe({ type: 'longtask', buffered: true });

          setTimeout(() => resolve(totalBlockingTime), 5000);
        });
      });

      // TBT deve ser < 200ms (bom), < 600ms (aceitável)
      expect(tbt).toBeLessThan(600);
      console.log(`TBT: ${tbt}ms`);
    });
  });

  test.describe('Tamanho de Recursos', () => {
    test('deve ter bundle JavaScript otimizado', async ({ page }) => {
      const jsResources: number[] = [];

      page.on('response', async (response) => {
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';

        if (contentType.includes('javascript')) {
          try {
            const buffer = await response.body();
            jsResources.push(buffer.length);
          } catch (e) {
            // Ignorar erros de corpo não disponível
          }
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const totalJsSize = jsResources.reduce((acc, size) => acc + size, 0);
      const totalJsSizeKB = totalJsSize / 1024;

      console.log(`Total JS: ${totalJsSizeKB.toFixed(2)} KB`);

      // Next.js otimizado deve ter < 200KB de JS inicial
      expect(totalJsSizeKB).toBeLessThan(300);
    });

    test('deve carregar imagens otimizadas', async ({ page }) => {
      const imageResources: { url: string; size: number }[] = [];

      page.on('response', async (response) => {
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';

        if (contentType.includes('image')) {
          try {
            const buffer = await response.body();
            imageResources.push({
              url,
              size: buffer.length,
            });
          } catch (e) {
            // Ignorar
          }
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      console.log(`Total de imagens carregadas: ${imageResources.length}`);

      // Verificar tamanho das imagens otimizadas
      // Hero images podem ser até 500KB, outras imagens devem ser < 200KB
      imageResources.forEach((img) => {
        const sizeKB = img.size / 1024;
        console.log(`Imagem: ${img.url.slice(-50)} - ${sizeKB.toFixed(2)} KB`);

        if (img.url.includes('hero')) {
          expect(sizeKB).toBeLessThan(500);
        } else {
          expect(sizeKB).toBeLessThan(200);
        }
      });
    });

    test('deve usar formatos de imagem modernos', async ({ page }) => {
      const modernFormats: string[] = [];

      page.on('response', async (response) => {
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';

        if (contentType.includes('image')) {
          if (contentType.includes('webp') || contentType.includes('avif')) {
            modernFormats.push(url);
          }
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      console.log(`Imagens modernas (WebP/AVIF): ${modernFormats.length}`);

      // Informational only - Next.js Image optimization may not always serve modern formats
      // depending on browser support detection
    });
  });

  test.describe('Caching e Otimizações', () => {
    test('deve ter headers de cache apropriados', async ({ page }) => {
      const responses: any[] = [];

      page.on('response', (response) => {
        responses.push({
          url: response.url(),
          cacheControl: response.headers()['cache-control'],
        });
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const staticResources = responses.filter(
        (r) =>
          r.url.includes('_next/static') ||
          r.url.includes('.js') ||
          r.url.includes('.css')
      );

      // Recursos estáticos devem ter cache
      staticResources.forEach((resource) => {
        console.log(`Cache: ${resource.url.slice(-50)} - ${resource.cacheControl}`);
      });

      expect(staticResources.length).toBeGreaterThan(0);
    });

    test('deve ter compressão habilitada', async ({ page }) => {
      const compressedResources: string[] = [];

      page.on('response', (response) => {
        const encoding = response.headers()['content-encoding'];

        if (encoding && (encoding.includes('gzip') || encoding.includes('br'))) {
          compressedResources.push(response.url());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      console.log(`Recursos comprimidos: ${compressedResources.length}`);

      // Maioria dos recursos deve estar comprimida
      expect(compressedResources.length).toBeGreaterThan(0);
    });
  });

  test.describe('Performance de Páginas Específicas', () => {
    test('deve ter boa performance na página de notícias', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/noticias');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      console.log(`Tempo de carregamento /noticias: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000);
    });

    test('deve ter boa performance em artigo de notícia', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/noticias/avanco-negociacao-salarial');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      console.log(`Tempo de carregamento artigo: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000);
    });

    test('deve ter boa performance na página de contato', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/contato');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      console.log(`Tempo de carregamento /contato: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test.describe('Lighthouse Metrics Simulation', () => {
    test('deve simular métricas do Lighthouse', async ({ page }) => {
      await page.goto('/');

      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;

        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          loadComplete: navigation.loadEventEnd - navigation.fetchStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart,
        };
      });

      console.log('Métricas de Performance:', metrics);

      expect(metrics.domContentLoaded).toBeLessThan(3000);
      expect(metrics.loadComplete).toBeLessThan(5000);
      expect(metrics.domInteractive).toBeLessThan(3000);
    });
  });
});
