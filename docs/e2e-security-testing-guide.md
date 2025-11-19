# Security Testing Implementation Guide

**Priority**: ⭐⭐⭐ High
**Estimated Time**: 3-4 hours
**Focus**: OWASP Top 10, Security Headers, Authentication

---

## Overview

This guide implements comprehensive security testing to protect against common vulnerabilities and ensure secure authentication flows.

---

## 1. Security Test Suite Structure

Create `e2e/tests/security/security.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Security Testing', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';

  test.describe('Security Headers', () => {
    test('should have X-Frame-Options header', async ({ page }) => {
      const response = await page.goto('/');

      const headers = response.headers();
      expect(headers['x-frame-options']).toBe('DENY');
    });

    test('should have X-Content-Type-Options header', async ({ page }) => {
      const response = await page.goto('/');

      const headers = response.headers();
      expect(headers['x-content-type-options']).toBe('nosniff');
    });

    test('should have Strict-Transport-Security header', async ({ page }) => {
      const response = await page.goto('/');

      const headers = response.headers();
      expect(headers['strict-transport-security']).toBeTruthy();
      expect(headers['strict-transport-security']).toContain('max-age');
    });

    test('should have Content-Security-Policy header', async ({ page }) => {
      const response = await page.goto('/');

      const headers = response.headers();
      expect(headers['content-security-policy']).toBeTruthy();
      expect(headers['content-security-policy']).toContain("default-src 'self'");
    });

    test('should have X-XSS-Protection header', async ({ page }) => {
      const response = await page.goto('/');

      const headers = response.headers();
      // Note: X-XSS-Protection is deprecated but still good to have
      // Modern browsers rely on CSP instead
      expect(
        headers['x-xss-protection'] === '1; mode=block' ||
        headers['content-security-policy']
      ).toBeTruthy();
    });

    test('should have Referrer-Policy header', async ({ page }) => {
      const response = await page.goto('/');

      const headers = response.headers();
      expect(headers['referrer-policy']).toBeTruthy();
      expect(headers['referrer-policy']).toMatch(
        /no-referrer|strict-origin-when-cross-origin|same-origin/
      );
    });

    test('should have Permissions-Policy header', async ({ page }) => {
      const response = await page.goto('/');

      const headers = response.headers();
      expect(
        headers['permissions-policy'] || headers['feature-policy']
      ).toBeTruthy();
    });

    test('should not expose server information', async ({ page }) => {
      const response = await page.goto('/');

      const headers = response.headers();
      expect(headers['server']).toBeUndefined();
      expect(headers['x-powered-by']).toBeUndefined();
    });
  });

  test.describe('XSS (Cross-Site Scripting) Protection', () => {
    test('should prevent XSS in contact form name field', async ({ page }) => {
      await page.goto('/contato');

      const xssPayload = '<script>alert("XSS")</script>';
      let alertFired = false;

      page.on('dialog', async (dialog) => {
        alertFired = true;
        await dialog.dismiss();
      });

      await page.fill('input[name="name"]', xssPayload);
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('textarea[name="message"]', 'Test message');

      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      expect(alertFired).toBe(false);

      // Verify the content is escaped in DOM
      const displayedName = await page.locator('input[name="name"]').inputValue();
      expect(displayedName).not.toContain('<script>');
    });

    test('should prevent XSS in contact form message field', async ({ page }) => {
      await page.goto('/contato');

      const xssPayloads = [
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        'javascript:alert(1)',
        '<iframe src="javascript:alert(1)">',
        '<body onload=alert(1)>',
      ];

      let alertFired = false;
      page.on('dialog', async (dialog) => {
        alertFired = true;
        await dialog.dismiss();
      });

      for (const payload of xssPayloads) {
        await page.fill('textarea[name="message"]', payload);
        await page.waitForTimeout(100);

        const messageValue = await page.locator('textarea[name="message"]').inputValue();
        // Content should be there but not execute
        expect(messageValue).toBe(payload);
      }

      expect(alertFired).toBe(false);
    });

    test('should sanitize HTML in rendered content', async ({ page }) => {
      // Test if news articles properly sanitize HTML
      await page.goto('/noticias');

      const dangerousTags = [
        '<script>',
        '<iframe>',
        'javascript:',
        'onerror=',
        'onload=',
      ];

      const pageContent = await page.content();

      for (const tag of dangerousTags) {
        expect(pageContent).not.toContain(tag);
      }
    });

    test('should prevent DOM-based XSS via URL parameters', async ({ page }) => {
      const xssPayload = encodeURIComponent('<script>alert("XSS")</script>');

      let alertFired = false;
      page.on('dialog', async (dialog) => {
        alertFired = true;
        await dialog.dismiss();
      });

      await page.goto(`/noticias?search=${xssPayload}`);
      await page.waitForLoadState('networkidle');

      expect(alertFired).toBe(false);
    });
  });

  test.describe('SQL Injection Protection', () => {
    test('should prevent SQL injection in search', async ({ page, request }) => {
      const sqlPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE users--",
        "1' UNION SELECT NULL--",
        "admin'--",
        "' OR 1=1--",
      ];

      for (const payload of sqlPayloads) {
        const response = await request.get(`${baseURL}/api/posts?search=${payload}`);

        // Should not cause server error (500)
        expect(response.status()).not.toBe(500);

        // Should return safe response
        expect(response.ok() || response.status() === 400).toBeTruthy();
      }
    });

    test('should handle malicious input in login', async ({ request }) => {
      const sqlPayloads = [
        { email: "admin'--", password: 'anything' },
        { email: "' OR '1'='1", password: "' OR '1'='1" },
        { email: "admin'; DROP TABLE users--", password: 'password' },
      ];

      for (const payload of sqlPayloads) {
        const response = await request.post(`${baseURL}/api/auth/login`, {
          data: payload,
        });

        // Should not succeed (not 200)
        expect(response.status()).not.toBe(200);

        // Should return proper error (401 or 400)
        expect([400, 401]).toContain(response.status());
      }
    });
  });

  test.describe('Authentication & Authorization', () => {
    test('should require authentication for admin pages', async ({ page }) => {
      const response = await page.goto('/admin');

      // Should redirect to login
      await page.waitForURL('**/login**');
      expect(page.url()).toContain('/login');
    });

    test('should not allow direct access to admin API without auth', async ({ request }) => {
      const protectedEndpoints = [
        '/api/posts',
        '/api/media',
        '/api/media/upload',
        '/api/users',
      ];

      for (const endpoint of protectedEndpoints) {
        const response = await request.post(`${baseURL}${endpoint}`);

        // Should return 401 Unauthorized
        expect(response.status()).toBe(401);
      }
    });

    test('should invalidate session on logout', async ({ page, request }) => {
      // Login
      await page.goto('/login');
      await page.fill('input[name="email"]', 'admin@asof.org.br');
      await page.fill('input[name="password"]', 'Admin123!@#');
      await page.click('button[type="submit"]');

      await page.waitForURL('**/admin**');

      // Get session cookie
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find((c) => c.name === 'admin-auth-token');

      expect(sessionCookie).toBeTruthy();

      // Logout
      await request.post(`${baseURL}/api/auth/logout`, {
        headers: {
          Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
        },
      });

      // Try to access admin with old cookie
      const response = await request.get(`${baseURL}/api/posts`, {
        headers: {
          Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
        },
      });

      expect(response.status()).toBe(401);
    });

    test('should implement session timeout', async ({ page }) => {
      // This test verifies that sessions expire
      // In production, sessions should expire after inactivity period

      await page.goto('/login');
      await page.fill('input[name="email"]', 'admin@asof.org.br');
      await page.fill('input[name="password"]', 'Admin123!@#');
      await page.click('button[type="submit"]');

      await page.waitForURL('**/admin**');

      // Get cookie and check expiry
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find((c) => c.name === 'admin-auth-token');

      expect(sessionCookie).toBeTruthy();
      expect(sessionCookie.expires).toBeGreaterThan(Date.now() / 1000);

      // Session should expire within 7 days (from schema)
      const maxAge = sessionCookie.expires - Date.now() / 1000;
      expect(maxAge).toBeLessThanOrEqual(7 * 24 * 60 * 60); // 7 days
    });

    test('should prevent brute force attacks with rate limiting', async ({ request }) => {
      const attempts = [];

      // Attempt 10 failed logins
      for (let i = 0; i < 10; i++) {
        attempts.push(
          request.post(`${baseURL}/api/auth/login`, {
            data: {
              email: 'test@example.com',
              password: `WrongPassword${i}`,
            },
          })
        );
      }

      const responses = await Promise.all(attempts);

      // Later attempts should be rate limited
      const rateLimited = responses.filter((r) => r.status() === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  test.describe('CSRF Protection', () => {
    test('should have CSRF protection on forms', async ({ page }) => {
      await page.goto('/contato');

      // Check for CSRF token in form
      const form = page.locator('form');
      const csrfToken = await form.locator('input[name="_csrf"]').count();

      // Either has CSRF token or uses SameSite cookies
      const cookies = await page.context().cookies();
      const hasSameSiteCookie = cookies.some(
        (c) => c.sameSite === 'strict' || c.sameSite === 'lax'
      );

      expect(csrfToken > 0 || hasSameSiteCookie).toBeTruthy();
    });

    test('should reject requests without CSRF token', async ({ request }) => {
      // Attempt to submit form without CSRF token
      const response = await request.post(`${baseURL}/api/contact`, {
        data: {
          name: 'Test',
          email: 'test@example.com',
          message: 'Test message',
          // Missing CSRF token
        },
      });

      // Should be rejected if CSRF protection is enabled
      expect([400, 403]).toContain(response.status());
    });
  });

  test.describe('File Upload Security', () => {
    test('should validate file types on upload', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', 'admin@asof.org.br');
      await page.fill('input[name="password"]', 'Admin123!@#');
      await page.click('button[type="submit"]');

      await page.waitForURL('**/admin**');
      await page.goto('/admin/media');

      // Attempt to upload executable file
      const executableFile = Buffer.from('MZ\x90\x00'); // PE header
      await page.setInputFiles('input[type="file"]', {
        name: 'malicious.exe',
        mimeType: 'application/x-msdownload',
        buffer: executableFile,
      });

      // Should show error or reject upload
      const errorMessage = page.locator('text=/não permitido|not allowed/i');
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('should enforce file size limits', async ({ request }) => {
      // Login first
      const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'Admin123!@#',
        },
      });

      const authCookie = loginResponse.headers()['set-cookie'];

      // Create large file (11MB)
      const largeFile = Buffer.alloc(11 * 1024 * 1024);

      const response = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: 'large-file.jpg',
            mimeType: 'image/jpeg',
            buffer: largeFile,
          },
        },
      });

      expect(response.status()).toBe(413); // Payload Too Large
    });

    test('should sanitize file names', async ({ request }) => {
      const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'Admin123!@#',
        },
      });

      const authCookie = loginResponse.headers()['set-cookie'];

      // Attempt path traversal in filename
      const maliciousNames = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        'test<script>alert(1)</script>.jpg',
        'test; rm -rf /.jpg',
      ];

      for (const name of maliciousNames) {
        const response = await request.post(`${baseURL}/api/media/upload`, {
          headers: { Cookie: authCookie },
          multipart: {
            file: {
              name,
              mimeType: 'image/jpeg',
              buffer: Buffer.from('fake-image-data'),
            },
          },
        });

        // Should either reject or sanitize
        if (response.ok()) {
          const body = await response.json();
          const savedName = body.media.fileName;

          // Should not contain path traversal
          expect(savedName).not.toContain('..');
          expect(savedName).not.toContain('/');
          expect(savedName).not.toContain('\\');
          expect(savedName).not.toContain('<script>');
        }
      }
    });
  });

  test.describe('Information Disclosure', () => {
    test('should not expose sensitive error details', async ({ page }) => {
      // Try to access non-existent page
      const response = await page.goto('/non-existent-page-12345');

      const content = await page.content();

      // Should not expose stack traces or internal paths
      expect(content).not.toContain('at Object.');
      expect(content).not.toContain('node_modules');
      expect(content).not.toContain('webpack');
      expect(content).not.toContain('Error:');
    });

    test('should not expose database connection strings', async ({ page }) => {
      await page.goto('/');

      const content = await page.content();

      expect(content).not.toContain('postgresql://');
      expect(content).not.toContain('mongodb://');
      expect(content).not.toContain('DATABASE_URL');
      expect(content).not.toContain('password');
    });

    test('should not expose API keys in source', async ({ page }) => {
      await page.goto('/');

      const scripts = await page.locator('script').allTextContents();
      const allScriptContent = scripts.join(' ');

      expect(allScriptContent).not.toContain('API_KEY');
      expect(allScriptContent).not.toContain('SECRET_KEY');
      expect(allScriptContent).not.toContain('NEXTAUTH_SECRET');
    });
  });

  test.describe('Secure Cookies', () => {
    test('should set Secure flag on cookies in production', async ({ page }) => {
      if (process.env.NODE_ENV === 'production') {
        await page.goto('/login');
        await page.fill('input[name="email"]', 'admin@asof.org.br');
        await page.fill('input[name="password"]', 'Admin123!@#');
        await page.click('button[type="submit"]');

        const cookies = await page.context().cookies();
        const authCookie = cookies.find((c) => c.name === 'admin-auth-token');

        expect(authCookie).toBeTruthy();
        expect(authCookie.secure).toBe(true);
      }
    });

    test('should set HttpOnly flag on session cookies', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', 'admin@asof.org.br');
      await page.fill('input[name="password"]', 'Admin123!@#');
      await page.click('button[type="submit"]');

      const cookies = await page.context().cookies();
      const authCookie = cookies.find((c) => c.name === 'admin-auth-token');

      expect(authCookie).toBeTruthy();
      expect(authCookie.httpOnly).toBe(true);
    });

    test('should set SameSite attribute on cookies', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', 'admin@asof.org.br');
      await page.fill('input[name="password"]', 'Admin123!@#');
      await page.click('button[type="submit"]');

      const cookies = await page.context().cookies();
      const authCookie = cookies.find((c) => c.name === 'admin-auth-token');

      expect(authCookie).toBeTruthy();
      expect(['Lax', 'Strict']).toContain(authCookie.sameSite);
    });
  });

  test.describe('Input Validation', () => {
    test('should validate email format', async ({ page }) => {
      await page.goto('/contato');

      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('textarea[name="message"]', 'Test message');

      await page.click('button[type="submit"]');

      const errorMessage = page.locator('text=/e-mail inválido|invalid email/i');
      await expect(errorMessage).toBeVisible();
    });

    test('should enforce maximum length limits', async ({ page }) => {
      await page.goto('/contato');

      // Very long input
      const longString = 'A'.repeat(10000);

      await page.fill('input[name="name"]', longString);
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('textarea[name="message"]', 'Test');

      await page.click('button[type="submit"]');

      // Should show validation error or truncate
      const errorMessage = page.locator('text=/muito longo|too long|máximo/i');
      const nameValue = await page.locator('input[name="name"]').inputValue();

      expect(errorMessage.isVisible() || nameValue.length < 10000).toBeTruthy();
    });
  });
});
```

---

## 2. npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test:security": "playwright test e2e/tests/security/",
    "test:security:headers": "playwright test e2e/tests/security/ -g 'Security Headers'",
    "test:security:xss": "playwright test e2e/tests/security/ -g 'XSS'",
    "test:security:auth": "playwright test e2e/tests/security/ -g 'Authentication'"
  }
}
```

---

## 3. CI/CD Integration

Add to `.github/workflows/e2e-tests.yml`:

```yaml
security-tests:
  name: Security Tests
  timeout-minutes: 15
  runs-on: ubuntu-latest

  steps:
    - name: Checkout código
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Instalar dependências
      run: npm ci

    - name: Instalar Playwright
      run: npx playwright install --with-deps chromium

    - name: Build do projeto
      run: npm run build

    - name: Executar testes de segurança
      run: npm run test:security
      env:
        CI: true

    - name: Upload de relatórios de segurança
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: security-test-report
        path: playwright-report/
        retention-days: 30
```

---

## 4. Best Practices

### Security Headers
- ✅ Always verify in production environment
- ✅ Test HTTPS enforcement
- ✅ Verify CSP is not too permissive

### XSS Prevention
- ✅ Test all user input fields
- ✅ Test URL parameters
- ✅ Verify content rendering

### SQL Injection
- ✅ Use parameterized queries (Prisma handles this)
- ✅ Test all search/filter endpoints
- ✅ Never trust user input

### Authentication
- ✅ Always require authentication for sensitive endpoints
- ✅ Implement rate limiting
- ✅ Use secure session management

---

## Conclusion

This security testing suite provides comprehensive coverage of OWASP Top 10 vulnerabilities and common security issues.

**Estimated Implementation Time**: 3-4 hours
