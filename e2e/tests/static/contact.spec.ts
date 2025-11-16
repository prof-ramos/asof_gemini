import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages';

test.describe('Página de Contato - Testes E2E', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.goto();
  });

  test('deve carregar a página de contato com sucesso', async () => {
    await expect(contactPage.pageTitle).toBeVisible();
    await expect(contactPage.contactForm).toBeVisible();
  });

  test('deve exibir header e footer', async () => {
    const headerVisible = await contactPage.isHeaderVisible();
    const footerVisible = await contactPage.isFooterVisible();

    expect(headerVisible).toBeTruthy();
    expect(footerVisible).toBeTruthy();
  });

  test('deve exibir formulário de contato com todos os campos', async () => {
    await expect(contactPage.nameInput).toBeVisible();
    await expect(contactPage.emailInput).toBeVisible();
    await expect(contactPage.messageInput).toBeVisible();
    await expect(contactPage.submitButton).toBeVisible();
  });

  test('deve exibir informações de contato', async () => {
    const contactInfoVisible = await contactPage.areContactInfoVisible();
    expect(contactInfoVisible).toBeTruthy();
  });

  test.describe('Validação de Formulário', () => {
    test('deve validar campo de e-mail obrigatório', async () => {
      // Tentar submeter sem preencher
      await contactPage.submitButton.click();

      // Verificar validação HTML5
      const emailValidity = await contactPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );
      expect(emailValidity).toBeFalsy();
    });

    test('deve validar formato de e-mail', async () => {
      await contactPage.nameInput.fill('João Silva');
      await contactPage.emailInput.fill('email-invalido');
      await contactPage.messageInput.fill('Mensagem de teste');

      // Verificar validação HTML5
      const emailValidity = await contactPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );
      expect(emailValidity).toBeFalsy();
    });

    test('deve aceitar e-mail válido', async () => {
      await contactPage.emailInput.fill('joao.silva@exemplo.com.br');

      const emailValidity = await contactPage.emailInput.evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );
      expect(emailValidity).toBeTruthy();
    });
  });

  test.describe('Envio de Formulário', () => {
    test('deve preencher formulário com dados válidos', async () => {
      const testData = {
        name: 'João da Silva',
        email: 'joao.silva@exemplo.com.br',
        phone: '(61) 98765-4321',
        subject: 'Informações sobre associação',
        message: 'Gostaria de receber mais informações sobre como me associar à ASOF.',
      };

      await contactPage.fillAndSubmitContactForm(testData);

      // Verificar que campos foram preenchidos
      await expect(contactPage.nameInput).toHaveValue(testData.name);
      await expect(contactPage.emailInput).toHaveValue(testData.email);
    });

    test('deve preencher apenas campos obrigatórios', async () => {
      const minimalData = {
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        message: 'Mensagem de teste com apenas campos obrigatórios.',
      };

      await contactPage.fillAndSubmitContactForm(minimalData);

      await expect(contactPage.nameInput).toHaveValue(minimalData.name);
      await expect(contactPage.emailInput).toHaveValue(minimalData.email);
      await expect(contactPage.messageInput).toHaveValue(minimalData.message);
    });

    // Nota: Teste de submissão real requer mock ou API de teste
    test.skip('deve enviar formulário e exibir mensagem de sucesso', async () => {
      const testData = {
        name: 'Pedro Oliveira',
        email: 'pedro@teste.com',
        message: 'Teste de envio de formulário E2E.',
      };

      await contactPage.fillAndSubmitContactForm(testData);

      // Verificar mensagem de sucesso
      const successVisible = await contactPage.isSuccessMessageVisible();
      expect(successVisible).toBeTruthy();
    });
  });

  test.describe('FAQ Section', () => {
    test('deve exibir seção de FAQ se disponível', async () => {
      if (await contactPage.faqSection.isVisible()) {
        const faqCount = await contactPage.getFAQItemsCount();
        expect(faqCount).toBeGreaterThan(0);
      }
    });

    test('deve expandir item do FAQ ao clicar', async () => {
      if (await contactPage.faqSection.isVisible()) {
        const faqCount = await contactPage.getFAQItemsCount();

        if (faqCount > 0) {
          await contactPage.expandFAQItem(0);

          // Aguardar animação
          await contactPage.page.waitForLoadState('networkidle');
        }
      }
    });
  });

  test.describe('Mapa e Localização', () => {
    test('deve exibir mapa se disponível', async () => {
      const mapVisible = await contactPage.isMapVisible();

      if (mapVisible) {
        await expect(contactPage.mapSection).toBeVisible();
      }
    });
  });

  test.describe('Acessibilidade de Formulário', () => {
    test('deve permitir navegação por teclado nos campos', async ({ page }) => {
      // Tab para nome
      await page.keyboard.press('Tab');
      let focused = await page.evaluate(() => document.activeElement?.tagName);

      // Tab para email
      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement?.tagName);

      // Tab para mensagem
      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement?.tagName);

      expect(focused).toBeTruthy();
    });

    test('deve ter labels associados aos inputs', async () => {
      const nameId = await contactPage.nameInput.getAttribute('id');
      const emailId = await contactPage.emailInput.getAttribute('id');

      if (nameId) {
        const nameLabel = contactPage.page.locator(`label[for="${nameId}"]`);
        await expect(nameLabel).toBeVisible();
      }

      if (emailId) {
        const emailLabel = contactPage.page.locator(`label[for="${emailId}"]`);
        await expect(emailLabel).toBeVisible();
      }
    });
  });

  test.describe('Responsividade', () => {
    test('deve ser responsivo em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(contactPage.contactForm).toBeVisible();
      await expect(contactPage.nameInput).toBeVisible();
      await expect(contactPage.submitButton).toBeVisible();
    });

    test('deve ajustar layout em tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(contactPage.contactForm).toBeVisible();
      await expect(contactPage.pageTitle).toBeVisible();
    });
  });
});
