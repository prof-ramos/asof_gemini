import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages';

test.describe('Homepage - Testes E2E', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('deve carregar a homepage com sucesso', async () => {
    await expect(homePage.page).toHaveTitle(/ASOF|Associação dos Oficiais/i);
    await expect(homePage.heroTitle).toBeVisible();
  });

  test('deve exibir header e footer corretamente', async () => {
    const headerVisible = await homePage.isHeaderVisible();
    const footerVisible = await homePage.isFooterVisible();

    expect(headerVisible).toBeTruthy();
    expect(footerVisible).toBeTruthy();

    await expect(homePage.logo).toBeVisible();
    await expect(homePage.footerCopyright).toBeVisible();
  });

  test('deve exibir todas as seções principais', async () => {
    const allSectionsVisible = await homePage.areAllSectionsVisible();
    expect(allSectionsVisible).toBeTruthy();

    await expect(homePage.heroSection).toBeVisible();
    await expect(homePage.aboutSection).toBeVisible();
    await expect(homePage.pillarsSection).toBeVisible();
    await expect(homePage.newsSection).toBeVisible();
    await expect(homePage.ctaSection).toBeVisible();
  });

  test('deve exibir hero section com título e CTA', async () => {
    await expect(homePage.heroTitle).toBeVisible();
    await expect(homePage.heroSubtitle).toBeVisible();
    await expect(homePage.heroCTA).toBeVisible();

    const titleText = await homePage.heroTitle.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText!.length).toBeGreaterThan(5);
  });

  test('deve exibir cards dos pilares da ASOF', async () => {
    const pillarCount = await homePage.getPillarCardsCount();
    expect(pillarCount).toBeGreaterThanOrEqual(3);

    await expect(homePage.pillarCards.first()).toBeVisible();
  });

  test('deve exibir seção de notícias com cards', async () => {
    await expect(homePage.newsSection).toBeVisible();
    await expect(homePage.newsTitle).toBeVisible();

    const newsCount = await homePage.getNewsCardsCount();
    expect(newsCount).toBeGreaterThan(0);
  });

  test('deve navegar para página de notícias ao clicar em "Ver Todas"', async ({ page }) => {
    // Verificar se botão existe
    if (await homePage.newsViewAllButton.isVisible()) {
      await homePage.clickViewAllNews();

      // Verificar navegação
      await expect(page).toHaveURL(/\/noticias/);
    }
  });

  test('deve navegar para página "Quem Somos" via menu', async ({ page }) => {
    await homePage.navigateToAbout();
    await expect(page).toHaveURL(/\/sobre/);
  });

  test('deve exibir CTA section no final da página', async () => {
    await homePage.scrollToElement(homePage.ctaSection);
    await expect(homePage.ctaSection).toBeVisible();
    await expect(homePage.ctaButton).toBeVisible();
  });

  test('deve fazer scroll por todas as seções suavemente', async () => {
    await homePage.scrollThroughAllSections();

    // Verificar que CTA está visível após scroll
    await expect(homePage.ctaSection).toBeInViewport();
  });

  test.describe('Menu de Navegação', () => {
    test('deve ter todos os links principais do menu', async () => {
      await expect(homePage.homeLink).toBeVisible();
      await expect(homePage.aboutLink).toBeVisible();
      await expect(homePage.servicesLink).toBeVisible();
      await expect(homePage.newsLink).toBeVisible();
      await expect(homePage.contactLink).toBeVisible();
    });

    test('deve navegar corretamente por todos os menus', async ({ page }) => {
      // Notícias
      await homePage.navigateToNews();
      await expect(page).toHaveURL(/\/noticias/);

      // Voltar para home
      await homePage.navigateToHome();
      await expect(page).toHaveURL(/^(?!.*\/noticias)/);

      // Contato
      await homePage.navigateToContact();
      await expect(page).toHaveURL(/\/contato/);
    });
  });

  test.describe('Responsividade Mobile', () => {
    test('deve exibir menu mobile em telas pequenas', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      const isMobile = await homePage.isMobile();
      expect(isMobile).toBeTruthy();

      await expect(homePage.mobileMenuButton).toBeVisible();
    });

    test('deve abrir menu mobile ao clicar no botão', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      if (await homePage.mobileMenuButton.isVisible()) {
        await homePage.openMobileMenu();

        // Aguardar animação
        await page.waitForLoadState('networkidle');
      }
    });
  });

  test.describe('SEO e Metadata', () => {
    test('deve ter título da página apropriado', async () => {
      const title = await homePage.getPageTitle();
      expect(title).toBeTruthy();
      expect(title).toContain('ASOF');
    });

    test('deve ter meta tags Open Graph', async ({ page }) => {
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');

      // Verificações explícitas de null
      expect(ogTitle).not.toBeNull();
      expect(ogTitle).toBeTruthy();

      expect(ogDescription).not.toBeNull();
      expect(ogDescription).toBeTruthy();
    });
  });
});
