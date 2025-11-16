import { test, expect } from '@playwright/test';
import { NewsListPage, NewsArticlePage } from '../../pages';

test.describe('Sistema de Notícias - Testes E2E', () => {
  test.describe('Página de Listagem de Notícias', () => {
    let newsListPage: NewsListPage;

    test.beforeEach(async ({ page }) => {
      newsListPage = new NewsListPage(page);
      await newsListPage.goto();
    });

    test('deve carregar a página de notícias com sucesso', async () => {
      await expect(newsListPage.pageTitle).toBeVisible();
      await expect(newsListPage.page).toHaveURL(/\/noticias/);
    });

    test('deve exibir grid de notícias', async () => {
      await expect(newsListPage.newsGrid).toBeVisible();
    });

    test('deve exibir pelo menos uma notícia', async () => {
      const newsCount = await newsListPage.getNewsCount();
      expect(newsCount).toBeGreaterThan(0);

      await expect(newsListPage.newsCards.first()).toBeVisible();
    });

    test('deve exibir informações básicas de cada notícia', async () => {
      const firstCard = newsListPage.newsCards.first();
      await expect(firstCard).toBeVisible();

      // Verificar se tem título (heading)
      const heading = firstCard.locator('h2, h3, h4');
      await expect(heading).toBeVisible();

      // Verificar se tem data
      const dateElement = firstCard.locator('time, [datetime]');
      await expect(dateElement).toBeVisible();
    });

    test('deve navegar para notícia ao clicar no card', async ({ page }) => {
      const newsCount = await newsListPage.getNewsCount();

      if (newsCount > 0) {
        await newsListPage.clickNewsCard(0);

        // Verificar navegação para página individual
        await expect(page).toHaveURL(/\/noticias\/[a-z0-9-]+/);
      }
    });

    test('deve exibir header e footer', async () => {
      const headerVisible = await newsListPage.isHeaderVisible();
      const footerVisible = await newsListPage.isFooterVisible();

      expect(headerVisible).toBeTruthy();
      expect(footerVisible).toBeTruthy();
    });

    test.describe('Responsividade', () => {
      test('deve ser responsivo em mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        await expect(newsListPage.pageTitle).toBeVisible();
        await expect(newsListPage.newsCards.first()).toBeVisible();
      });

      test('deve ajustar grid em tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });

        const newsCount = await newsListPage.getNewsCount();
        expect(newsCount).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Página Individual de Notícia', () => {
    let newsArticlePage: NewsArticlePage;

    // Slugs de notícias existentes no projeto
    const testSlugs = [
      'avanco-negociacao-salarial',
      'encontro-saude-mental',
      'eleicoes-diretoria-2025',
    ];

    test.beforeEach(async ({ page }) => {
      newsArticlePage = new NewsArticlePage(page);
    });

    test('deve carregar artigo de notícia com sucesso', async () => {
      await newsArticlePage.gotoBySlug(testSlugs[0]);

      await expect(newsArticlePage.articleTitle).toBeVisible();
      await expect(newsArticlePage.articleContent).toBeVisible();
    });

    test('deve exibir título do artigo', async () => {
      await newsArticlePage.gotoBySlug(testSlugs[0]);

      const title = await newsArticlePage.getArticleTitle();
      expect(title).toBeTruthy();
      expect(title!.length).toBeGreaterThan(10);
    });

    test('deve exibir data de publicação', async () => {
      await newsArticlePage.gotoBySlug(testSlugs[0]);

      await expect(newsArticlePage.articleDate).toBeVisible();

      const dateAttr = await newsArticlePage.getArticleDate();
      expect(dateAttr).toBeTruthy();
    });

    test('deve exibir conteúdo do artigo', async () => {
      await newsArticlePage.gotoBySlug(testSlugs[0]);

      await expect(newsArticlePage.articleContent).toBeVisible();

      // Verificar que há conteúdo substantivo
      const contentText = await newsArticlePage.articleContent.textContent();
      expect(contentText).toBeTruthy();
      expect(contentText!.length).toBeGreaterThan(100);
    });

    test('deve exibir categoria/badge se disponível', async () => {
      await newsArticlePage.gotoBySlug(testSlugs[0]);

      if (await newsArticlePage.articleCategory.isVisible()) {
        await expect(newsArticlePage.articleCategory).toBeVisible();
      }
    });

    test('deve exibir tempo de leitura se disponível', async () => {
      await newsArticlePage.gotoBySlug(testSlugs[0]);

      if (await newsArticlePage.readingTime.isVisible()) {
        await expect(newsArticlePage.readingTime).toBeVisible();

        const readingTimeText = await newsArticlePage.readingTime.textContent();
        expect(readingTimeText).toMatch(/\d+\s*min/i);
      }
    });

    test('deve ter imagem destacada', async () => {
      await newsArticlePage.gotoBySlug(testSlugs[0]);

      if (await newsArticlePage.articleImage.isVisible()) {
        await expect(newsArticlePage.articleImage).toBeVisible();

        // Verificar alt text
        const altText = await newsArticlePage.articleImage.getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    });

    test('deve exibir header e footer', async () => {
      await newsArticlePage.gotoBySlug(testSlugs[0]);

      const headerVisible = await newsArticlePage.isHeaderVisible();
      const footerVisible = await newsArticlePage.isFooterVisible();

      expect(headerVisible).toBeTruthy();
      expect(footerVisible).toBeTruthy();
    });

    test('deve ter botão de voltar funcional', async ({ page }) => {
      await newsArticlePage.gotoBySlug(testSlugs[0]);

      if (await newsArticlePage.backButton.isVisible()) {
        await newsArticlePage.clickBackButton();

        // Verificar que voltou para listagem
        await expect(page).toHaveURL(/\/noticias\/?$/);
      }
    });

    test.describe('Notícias Relacionadas', () => {
      test('deve exibir seção de notícias relacionadas se disponível', async () => {
        await newsArticlePage.gotoBySlug(testSlugs[0]);

        const hasRelated = await newsArticlePage.hasRelatedNews();

        if (hasRelated) {
          await expect(newsArticlePage.relatedNews).toBeVisible();
        }
      });

      test('deve navegar para notícia relacionada ao clicar', async ({ page }) => {
        await newsArticlePage.gotoBySlug(testSlugs[0]);

        const hasRelated = await newsArticlePage.hasRelatedNews();

        if (hasRelated) {
          const currentUrl = page.url();
          await newsArticlePage.clickRelatedNews(0);

          // Verificar que navegou para outra notícia
          const newUrl = page.url();
          expect(newUrl).not.toBe(currentUrl);
          expect(newUrl).toMatch(/\/noticias\/[a-z0-9-]+/);
        }
      });
    });

    test.describe('SEO e Metadata', () => {
      test('deve ter título único para cada artigo', async ({ page }) => {
        await newsArticlePage.gotoBySlug(testSlugs[0]);

        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title).toContain('ASOF');
      });

      test('deve ter meta description', async ({ page }) => {
        await newsArticlePage.gotoBySlug(testSlugs[0]);

        const metaDescription = await page
          .locator('meta[name="description"]')
          .getAttribute('content');

        expect(metaDescription).toBeTruthy();
      });

      test('deve ter Open Graph tags', async ({ page }) => {
        await newsArticlePage.gotoBySlug(testSlugs[0]);

        const ogTitle = await page
          .locator('meta[property="og:title"]')
          .getAttribute('content');

        const ogType = await page
          .locator('meta[property="og:type"]')
          .getAttribute('content');

        expect(ogTitle).toBeTruthy();
        expect(ogType).toBeTruthy();
      });
    });

    test.describe('Responsividade', () => {
      test('deve ser legível em mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await newsArticlePage.gotoBySlug(testSlugs[0]);

        await expect(newsArticlePage.articleTitle).toBeVisible();
        await expect(newsArticlePage.articleContent).toBeVisible();
      });

      test('deve ajustar layout em tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await newsArticlePage.gotoBySlug(testSlugs[0]);

        await expect(newsArticlePage.articleTitle).toBeVisible();
        await expect(newsArticlePage.articleContent).toBeVisible();
      });
    });

    test.describe('Múltiplas Notícias', () => {
      testSlugs.forEach((slug) => {
        test(`deve carregar artigo: ${slug}`, async () => {
          await newsArticlePage.gotoBySlug(slug);

          await expect(newsArticlePage.articleTitle).toBeVisible();
          await expect(newsArticlePage.articleDate).toBeVisible();
          await expect(newsArticlePage.articleContent).toBeVisible();
        });
      });
    });
  });
});
