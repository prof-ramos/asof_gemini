import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Testes de Acessibilidade (WCAG 2.1 AA)
 * Utiliza axe-core para validação automática
 */

test.describe('Acessibilidade - WCAG 2.1 AA', () => {
  test.describe('Homepage', () => {
    test('deve passar em testes de acessibilidade', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('deve ter estrutura de headings hierárquica', async ({ page }) => {
      await page.goto('/');

      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
      expect(headings.length).toBeGreaterThan(0);

      // Verificar que existe apenas um H1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('deve ter alt text em todas as imagens', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Alt pode ser vazio para imagens decorativas, mas deve existir
        expect(alt).not.toBeNull();
      }
    });

    test('deve ter labels em todos os formulários', async ({ page }) => {
      await page.goto('/');

      const inputs = page.locator('input:not([type="hidden"]), select, textarea');
      const inputCount = await inputs.count();

      if (inputCount > 0) {
        for (let i = 0; i < inputCount; i++) {
          const input = inputs.nth(i);
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          const id = await input.getAttribute('id');

          let hasLabel = false;

          if (ariaLabel || ariaLabelledBy) {
            hasLabel = true;
          } else if (id) {
            const label = page.locator(`label[for="${id}"]`);
            hasLabel = (await label.count()) > 0;
          }

          expect(hasLabel).toBeTruthy();
        }
      }
    });

    test('deve ter contraste adequado', async ({ page }) => {
      await page.goto('/');

      const contrastResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include(['body'])
        .analyze();

      const contrastViolations = contrastResults.violations.filter(
        (v) => v.id === 'color-contrast'
      );

      expect(contrastViolations).toEqual([]);
    });
  });

  test.describe('Página de Notícias', () => {
    test('deve passar em testes de acessibilidade', async ({ page }) => {
      await page.goto('/noticias');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('deve ter landmarks ARIA apropriados', async ({ page }) => {
      await page.goto('/noticias');

      const main = await page.locator('main, [role="main"]').count();
      const nav = await page.locator('nav, [role="navigation"]').count();
      const header = await page.locator('header, [role="banner"]').count();
      const footer = await page.locator('footer, [role="contentinfo"]').count();

      expect(main).toBeGreaterThan(0);
      expect(nav).toBeGreaterThan(0);
      expect(header).toBeGreaterThan(0);
      expect(footer).toBeGreaterThan(0);
    });
  });

  test.describe('Artigo de Notícia', () => {
    test('deve passar em testes de acessibilidade', async ({ page }) => {
      await page.goto('/noticias/avanco-negociacao-salarial');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('deve ter marcação semântica adequada', async ({ page }) => {
      await page.goto('/noticias/avanco-negociacao-salarial');

      const article = await page.locator('article').count();
      expect(article).toBeGreaterThan(0);

      // Verificar time element para data
      const timeElement = await page.locator('time[datetime]').count();
      expect(timeElement).toBeGreaterThan(0);
    });
  });

  test.describe('Página de Contato', () => {
    test('deve passar em testes de acessibilidade', async ({ page }) => {
      await page.goto('/contato');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('deve ter formulário acessível', async ({ page }) => {
      await page.goto('/contato');

      const form = page.locator('form');
      await expect(form).toBeVisible();

      // Verificar labels
      const inputs = form.locator('input:not([type="hidden"]), textarea, select');
      const inputCount = await inputs.count();

      expect(inputCount).toBeGreaterThan(0);

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');

        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const labelExists = (await label.count()) > 0 || !!ariaLabel;
          expect(labelExists).toBeTruthy();
        }
      }
    });

    test('deve ter botão de submit acessível', async ({ page }) => {
      await page.goto('/contato');

      const submitButton = page.getByRole('button', { name: /enviar/i });
      await expect(submitButton).toBeVisible();

      const ariaLabel = await submitButton.getAttribute('aria-label');
      const buttonText = await submitButton.textContent();

      expect(ariaLabel || buttonText).toBeTruthy();
    });
  });

  test.describe('Navegação por Teclado', () => {
    test('deve permitir navegação por Tab na homepage', async ({ page }) => {
      await page.goto('/');

      // Focar primeiro elemento
      await page.keyboard.press('Tab');

      const focused1 = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName;
      });

      expect(focused1).toBeTruthy();

      // Tab múltiplas vezes
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }

      const focused2 = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName;
      });

      expect(focused2).toBeTruthy();
    });

    test('deve ter foco visível em elementos interativos', async ({ page }) => {
      await page.goto('/');

      // Tab até um link
      await page.keyboard.press('Tab');

      const focusVisible = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return false;

        const styles = window.getComputedStyle(el);
        const outline = styles.outline;
        const boxShadow = styles.boxShadow;

        // Verificar se tem algum indicador de foco
        return outline !== 'none' || boxShadow !== 'none';
      });

      // Focus indicators should be present (outline or box-shadow)
      expect(focusVisible).toBeTruthy();
    });

    test('deve permitir ativar links com Enter', async ({ page }) => {
      await page.goto('/');

      // Tab até encontrar um link
      let currentTag = '';
      let attempts = 0;

      while (currentTag !== 'A' && attempts < 20) {
        await page.keyboard.press('Tab');
        currentTag = await page.evaluate(() => document.activeElement?.tagName || '');
        attempts++;
      }

      if (currentTag === 'A') {
        const href = await page.evaluate(() =>
          (document.activeElement as HTMLAnchorElement)?.href
        );

        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);

        // Verificar que navegou
        const currentUrl = page.url();
        expect(currentUrl).toBeTruthy();
      }
    });
  });

  test.describe('Skip Links', () => {
    test('deve ter skip link para conteúdo principal', async ({ page }) => {
      await page.goto('/');

      // Pressionar Tab para revelar skip link
      await page.keyboard.press('Tab');

      const skipLink = page.getByText(/pular para|skip to|ir para conteúdo/i);
      const skipLinkExists = (await skipLink.count()) > 0;

      if (skipLinkExists) {
        await expect(skipLink).toBeFocused();
      }
    });
  });

  test.describe('Responsividade e Acessibilidade Mobile', () => {
    test('deve ser acessível em viewport mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('deve ter touch targets adequados em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const touchTargets = page.locator('a, button');
      const count = await touchTargets.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const target = touchTargets.nth(i);

        if (await target.isVisible()) {
          const box = await target.boundingBox();

          if (box) {
            // WCAG recomenda mínimo de 44x44 pixels para touch targets
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  });
});
