import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object para a página de Notícias (/noticias)
 */
export class NewsListPage extends BasePage {
  readonly pageTitle: Locator;
  readonly newsGrid: Locator;
  readonly newsCards: Locator;
  readonly categoryFilter: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole('heading', { name: /notícias/i, level: 1 });
    this.newsGrid = page.locator('[class*="grid"], [class*="news"]');
    this.newsCards = page.locator('article, [class*="card"]').filter({
      has: page.locator('time, [datetime]')
    });
    this.categoryFilter = page.locator('select, [role="combobox"]').filter({ hasText: /categoria/i });
    this.searchInput = page.locator('input[type="search"], input[placeholder*="buscar"]');
  }

  async goto() {
    await super.goto('/noticias');
    await this.waitForPageLoad();
  }

  async getNewsCount() {
    return await this.newsCards.count();
  }

  async clickNewsCard(index: number = 0) {
    await this.newsCards.nth(index).click();
    await this.waitForPageLoad();
  }

  async filterByCategory(category: string) {
    if (await this.categoryFilter.isVisible()) {
      // ARIA combobox: click to open, then select option by text
      await this.categoryFilter.click();
      await this.page.getByRole('option', { name: category }).click();
      await this.waitForPageLoad();
    }
  }

  async searchNews(query: string) {
    if (await this.searchInput.isVisible()) {
      await this.searchInput.fill(query);
      await this.page.keyboard.press('Enter');
      await this.waitForPageLoad();
    }
  }
}

/**
 * Page Object para página individual de Notícia (/noticias/[slug])
 */
export class NewsArticlePage extends BasePage {
  readonly articleTitle: Locator;
  readonly articleDate: Locator;
  readonly articleAuthor: Locator;
  readonly articleCategory: Locator;
  readonly articleContent: Locator;
  readonly articleImage: Locator;
  readonly readingTime: Locator;
  readonly shareButtons: Locator;
  readonly relatedNews: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.articleTitle = page.locator('article h1, h1');
    this.articleDate = page.locator('time, [datetime]').first();
    this.articleAuthor = page.getByText(/por |autor:/i);
    this.articleCategory = page.locator('[class*="category"], [class*="badge"]').first();
    this.articleContent = page.locator('article, [class*="content"], [class*="prose"]');
    this.articleImage = page.locator('article img, img[alt]').first();
    this.readingTime = page.getByText(/min de leitura|minutos/i);
    this.shareButtons = page.locator('[class*="share"], button').filter({ hasText: /compartilhar/i });
    this.relatedNews = page.locator('aside, [class*="related"]').filter({ hasText: /relacionad/i });
    this.backButton = page.getByRole('link', { name: /voltar|← /i });
  }

  async gotoBySlug(slug: string) {
    await super.goto(`/noticias/${slug}`);
    await this.waitForPageLoad();
  }

  async getArticleTitle() {
    return await this.articleTitle.textContent();
  }

  async getArticleDate() {
    return await this.articleDate.getAttribute('datetime');
  }

  async hasRelatedNews() {
    return await this.relatedNews.isVisible();
  }

  async clickRelatedNews(index: number = 0) {
    const relatedCards = this.relatedNews.locator('article, a[href*="/noticias"]');
    await relatedCards.nth(index).click();
    await this.waitForPageLoad();
  }

  async clickBackButton() {
    await this.backButton.click();
    await this.waitForPageLoad();
  }

  async shareArticle() {
    if (await this.shareButtons.isVisible()) {
      await this.shareButtons.first().click();
    }
  }
}
