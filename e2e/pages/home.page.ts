import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object para a Homepage (/)
 */
export class HomePage extends BasePage {
  // Hero Section
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroCTA: Locator;

  // About Section
  readonly aboutSection: Locator;
  readonly aboutTitle: Locator;
  readonly aboutButton: Locator;

  // Pillars Section
  readonly pillarsSection: Locator;
  readonly pillarCards: Locator;

  // News Section
  readonly newsSection: Locator;
  readonly newsTitle: Locator;
  readonly newsCards: Locator;
  readonly newsViewAllButton: Locator;

  // CTA Section
  readonly ctaSection: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page) {
    super(page);

    // Hero - Usar data-testid quando disponível, fallback para seletor semântico
    this.heroSection = page.getByTestId('hero-section').or(page.locator('section').first());
    this.heroTitle = page.locator('h1').first();
    this.heroSubtitle = page.locator('p.text-xl, p.text-lg').first();
    this.heroCTA = page.getByRole('link', { name: /conheça|saiba mais/i }).first();

    // About
    this.aboutSection = page.getByTestId('about-section').or(page.locator('section').filter({ hasText: /quem somos|sobre/i }));
    this.aboutTitle = page.getByRole('heading', { name: /quem somos|sobre/i });
    this.aboutButton = page.getByRole('link', { name: /saiba mais sobre/i });

    // Pillars
    this.pillarsSection = page.getByTestId('pillars-section').or(page.locator('section').filter({ hasText: /pilares|atuação/i }));
    this.pillarCards = page.getByTestId('pillar-card').or(page.locator('[class*="card"]').filter({ hasText: /defesa|representação|bem-estar/i }));

    // News
    this.newsSection = page.getByTestId('news-section').or(page.locator('section').filter({ hasText: /notícias/i }));
    this.newsTitle = page.getByRole('heading', { name: /notícias|últimas notícias/i });
    this.newsCards = page.getByTestId('news-card').or(page.locator('article, [class*="news"], [class*="card"]').filter({
      has: page.locator('time, [datetime]')
    }));
    this.newsViewAllButton = page.getByRole('link', { name: /ver todas|todas as notícias/i });

    // CTA
    this.ctaSection = page.getByTestId('cta-section').or(page.locator('section').filter({ hasText: /contato|fale conosco/i }));
    this.ctaButton = page.getByRole('link', { name: /entre em contato|fale conosco/i });
  }

  /**
   * Navegar para a homepage
   */
  async goto() {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Verificar se todas as seções principais estão visíveis
   */
  async areAllSectionsVisible() {
    return (
      await this.heroSection.isVisible() &&
      await this.aboutSection.isVisible() &&
      await this.pillarsSection.isVisible() &&
      await this.newsSection.isVisible() &&
      await this.ctaSection.isVisible()
    );
  }

  /**
   * Obter número de cards de pilares
   */
  async getPillarCardsCount() {
    return await this.pillarCards.count();
  }

  /**
   * Obter número de cards de notícias
   */
  async getNewsCardsCount() {
    return await this.newsCards.count();
  }

  /**
   * Clicar no botão "Saiba Mais" da seção About
   */
  async clickAboutButton() {
    await this.aboutButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Clicar em uma notícia específica (por índice)
   */
  async clickNewsCard(index: number = 0) {
    await this.newsCards.nth(index).click();
    await this.waitForPageLoad();
  }

  /**
   * Clicar em "Ver Todas as Notícias"
   */
  async clickViewAllNews() {
    await this.newsViewAllButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Clicar no CTA final
   */
  async clickCTA() {
    await this.ctaButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Fazer scroll suave por todas as seções
   */
  async scrollThroughAllSections() {
    await this.scrollToElement(this.aboutSection);
    await this.aboutSection.waitFor({ state: 'visible', timeout: 3000 });

    await this.scrollToElement(this.pillarsSection);
    await this.pillarsSection.waitFor({ state: 'visible', timeout: 3000 });

    await this.scrollToElement(this.newsSection);
    await this.newsSection.waitFor({ state: 'visible', timeout: 3000 });

    await this.scrollToElement(this.ctaSection);
    await this.ctaSection.waitFor({ state: 'visible', timeout: 3000 });
  }
}
