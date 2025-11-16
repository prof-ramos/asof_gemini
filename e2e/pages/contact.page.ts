import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object para a página de Contato (/contato)
 */
export class ContactPage extends BasePage {
  readonly pageTitle: Locator;
  readonly contactForm: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  // Informações de contato
  readonly contactInfo: Locator;
  readonly addressText: Locator;
  readonly phoneText: Locator;
  readonly emailText: Locator;

  // FAQ
  readonly faqSection: Locator;
  readonly faqItems: Locator;

  // Mapa
  readonly mapSection: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole('heading', { name: /contato|fale conosco/i, level: 1 });
    this.contactForm = page.locator('form');

    // Campos do formulário
    this.nameInput = page.locator('input[name="name"], input[id="name"], input[placeholder*="nome"]');
    this.emailInput = page.locator('input[name="email"], input[id="email"], input[type="email"]');
    this.phoneInput = page.locator('input[name="phone"], input[id="phone"], input[type="tel"]');
    this.subjectInput = page.locator('input[name="subject"], select[name="subject"], input[placeholder*="assunto"]');
    this.messageInput = page.locator('textarea[name="message"], textarea[id="message"], textarea[placeholder*="mensagem"]');
    this.submitButton = page.getByRole('button', { name: /enviar/i });

    // Mensagens de feedback
    this.successMessage = page.getByText(/sucesso|enviado com sucesso|obrigado/i);
    this.errorMessage = page.getByText(/erro|falha|tente novamente/i);

    // Informações
    this.contactInfo = page.locator('[class*="contact-info"], aside').first();
    this.addressText = page.getByText(/endereço|brasília|df/i);
    this.phoneText = page.getByText(/\(\d{2}\)\s?\d{4,5}-?\d{4}/);
    this.emailText = page.getByText(/@asof/i);

    // FAQ
    this.faqSection = page.locator('section').filter({ hasText: /perguntas|faq/i });
    this.faqItems = page.locator('details, [class*="accordion"], [class*="faq-item"]');

    // Mapa
    this.mapSection = page.locator('iframe[src*="maps"], [class*="map"]');
  }

  async goto() {
    await super.goto('/contato');
    await this.waitForPageLoad();
  }

  /**
   * Preencher e enviar formulário de contato
   */
  async fillAndSubmitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);

    if (data.phone && await this.phoneInput.isVisible()) {
      await this.phoneInput.fill(data.phone);
    }

    if (data.subject && await this.subjectInput.isVisible()) {
      await this.subjectInput.fill(data.subject);
    }

    await this.messageInput.fill(data.message);
    await this.submitButton.click();

    // Aguardar mensagem de sucesso ou erro aparecer (determinístico)
    await Promise.race([
      this.successMessage.waitFor({ state: 'visible', timeout: 5000 }),
      this.errorMessage.waitFor({ state: 'visible', timeout: 5000 })
    ]).catch(() => {
      // Se nenhuma mensagem aparecer, continuar (form pode não ter feedback visual)
    });
  }

  /**
   * Verificar se formulário foi enviado com sucesso
   */
  async isSuccessMessageVisible() {
    return await this.successMessage.isVisible();
  }

  /**
   * Verificar se houve erro no envio
   */
  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Expandir item do FAQ
   */
  async expandFAQItem(index: number = 0) {
    const item = this.faqItems.nth(index);
    if (await item.isVisible()) {
      await item.click();

      // Aguardar expansão do FAQ - buscar conteúdo expandido visível
      // Se for <details>, aguardar atributo [open]; se for accordion, aguardar conteúdo visível
      await Promise.race([
        // Opção 1: Details element com atributo open
        item.locator('[open]').waitFor({ state: 'attached', timeout: 2000 }).catch(() => {}),
        // Opção 2: Conteúdo do accordion visível
        item.locator('[class*="content"], [class*="panel"]').waitFor({ state: 'visible', timeout: 2000 }).catch(() => {})
      ]);
    }
  }

  /**
   * Verificar se informações de contato estão visíveis
   */
  async areContactInfoVisible() {
    return (
      await this.addressText.isVisible() ||
      await this.phoneText.isVisible() ||
      await this.emailText.isVisible()
    );
  }

  /**
   * Verificar se mapa está presente
   */
  async isMapVisible() {
    return await this.mapSection.isVisible();
  }

  /**
   * Obter número de itens do FAQ
   */
  async getFAQItemsCount() {
    if (await this.faqSection.isVisible()) {
      return await this.faqItems.count();
    }
    return 0;
  }
}
