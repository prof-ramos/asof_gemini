import { Page, Locator } from '@playwright/test';

/**
 * Classe base para todos os Page Objects
 * Contém métodos comuns e elementos compartilhados (Header/Footer)
 */
export class BasePage {
  readonly page: Page;

  // Header elements
  readonly header: Locator;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly aboutLink: Locator;
  readonly servicesLink: Locator;
  readonly newsLink: Locator;
  readonly transparencyLink: Locator;
  readonly contactLink: Locator;
  readonly mobileMenuButton: Locator;

  // Footer elements
  readonly footer: Locator;
  readonly footerCopyright: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.header = page.locator('header');
    this.logo = page.getByRole('link', { name: /asof/i });
    this.homeLink = page.getByRole('link', { name: /início|home/i });
    this.aboutLink = page.getByRole('link', { name: /quem somos|sobre/i });
    this.servicesLink = page.getByRole('link', { name: /atuação|áreas de atuação/i });
    this.newsLink = page.getByRole('link', { name: /notícias/i });
    this.transparencyLink = page.getByRole('link', { name: /transparência/i });
    this.contactLink = page.getByRole('link', { name: /contato/i });
    this.mobileMenuButton = page.getByRole('button', { name: /menu/i });

    // Footer
    this.footer = page.locator('footer');
    this.footerCopyright = page.getByText(/© \d{4} ASOF/i);
  }

  /**
   * Navegar para uma URL
   */
  async goto(path: string = '') {
    await this.page.goto(path);
  }

  /**
   * Aguardar carregamento completo da página
   * Usa verificações determinísticas ao invés de networkidle
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');

    // Verificar que elementos críticos da página estão visíveis
    await this.header.waitFor({ state: 'visible', timeout: 5000 });
    await this.footer.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Verificar se o header está visível
   */
  async isHeaderVisible() {
    return await this.header.isVisible();
  }

  /**
   * Verificar se o footer está visível
   */
  async isFooterVisible() {
    return await this.footer.isVisible();
  }

  /**
   * Navegar via menu principal
   */
  async navigateToHome() {
    await this.homeLink.click();
    await this.waitForPageLoad();
  }

  async navigateToAbout() {
    await this.aboutLink.click();
    await this.waitForPageLoad();
  }

  async navigateToServices() {
    await this.servicesLink.click();
    await this.waitForPageLoad();
  }

  async navigateToNews() {
    await this.newsLink.click();
    await this.waitForPageLoad();
  }

  async navigateToTransparency() {
    await this.transparencyLink.click();
    await this.waitForPageLoad();
  }

  async navigateToContact() {
    await this.contactLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Abrir menu mobile
   */
  async openMobileMenu() {
    if (await this.mobileMenuButton.isVisible()) {
      await this.mobileMenuButton.click();
    }
  }

  /**
   * Verificar se a página está em mobile
   */
  async isMobile() {
    return await this.mobileMenuButton.isVisible();
  }

  /**
   * Fazer scroll até um elemento
   */
  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Obter título da página
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Verificar se URL contém texto
   */
  async urlContains(text: string) {
    return this.page.url().includes(text);
  }
}
