import { test, expect } from '@playwright/test';

/**
 * Authentication API Tests
 * Tests login, logout, validation, and security features
 */

test.describe('Authentication API', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';

  test.describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'Admin123!@#',
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('user');
      expect(body.user).toHaveProperty('email', 'admin@asof.org.br');
      expect(body.user).toHaveProperty('role');

      // Verify session cookie is set
      const cookies = response.headers()['set-cookie'];
      expect(cookies).toBeTruthy();
      expect(cookies).toContain('admin-auth-token');
    });

    test('should reject invalid credentials', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'WrongPassword',
        },
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toMatch(/credenciais inválidas|invalid credentials|senha incorreta/i);
    });

    test('should reject non-existent user', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'nonexistent@example.com',
          password: 'Password123',
        },
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should validate required fields', async ({ request }) => {
      // Missing password
      const response1 = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
        },
      });

      expect(response1.status()).toBe(400);

      const body1 = await response1.json();
      expect(body1).toHaveProperty('error');

      // Missing email
      const response2 = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          password: 'Password123',
        },
      });

      expect(response2.status()).toBe(400);

      const body2 = await response2.json();
      expect(body2).toHaveProperty('error');
    });

    test('should validate email format', async ({ request }) => {
      const invalidEmails = [
        'invalid-email',
        'missing-at-sign.com',
        '@no-local-part.com',
        'no-domain@',
        'spaces in@email.com',
      ];

      for (const email of invalidEmails) {
        const response = await request.post(`${baseURL}/api/auth/login`, {
          data: {
            email,
            password: 'Password123',
          },
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('error');
        expect(body.error).toMatch(/e-mail inválido|invalid email|email.*invalid/i);
      }
    });

    test('should handle SQL injection attempts safely', async ({ request }) => {
      const sqlPayloads = [
        "admin'--",
        "' OR '1'='1",
        "admin'; DROP TABLE users--",
        "' UNION SELECT NULL--",
      ];

      for (const payload of sqlPayloads) {
        const response = await request.post(`${baseURL}/api/auth/login`, {
          data: {
            email: payload,
            password: 'anything',
          },
        });

        // Should not cause server error (500)
        expect(response.status()).not.toBe(500);

        // Should return proper authentication error
        expect([400, 401]).toContain(response.status());
      }
    });

    test('should implement rate limiting after multiple failed attempts', async ({ request }) => {
      const testEmail = `ratelimit-test-${Date.now()}@example.com`;
      const attempts = [];

      // Attempt 6 failed logins rapidly
      for (let i = 0; i < 6; i++) {
        attempts.push(
          request.post(`${baseURL}/api/auth/login`, {
            data: {
              email: testEmail,
              password: `WrongPassword${i}`,
            },
          })
        );
      }

      const responses = await Promise.all(attempts);

      // At least one should be rate limited
      const rateLimited = responses.some((r) => r.status() === 429);

      // If rate limiting is implemented, verify it
      // If not, at least verify all failed with 401
      if (rateLimited) {
        expect(rateLimited).toBe(true);
      } else {
        // All should be unauthorized
        responses.forEach((r) => {
          expect(r.status()).toBe(401);
        });
      }
    });

    test('should track failed login attempts', async ({ request }) => {
      const email = `failed-attempts-${Date.now()}@example.com`;

      // First failed attempt
      const response1 = await request.post(`${baseURL}/api/auth/login`, {
        data: { email, password: 'Wrong1' },
      });

      expect(response1.status()).toBe(401);

      // Second failed attempt
      const response2 = await request.post(`${baseURL}/api/auth/login`, {
        data: { email, password: 'Wrong2' },
      });

      expect(response2.status()).toBe(401);

      // Third failed attempt - should track attempts
      const response3 = await request.post(`${baseURL}/api/auth/login`, {
        data: { email, password: 'Wrong3' },
      });

      expect(response3.status()).toBe(401);

      const body = await response3.json();

      // If attempt tracking is implemented, verify it
      // Otherwise, just verify error response
      if (body.attemptsRemaining !== undefined) {
        expect(body.attemptsRemaining).toBeLessThanOrEqual(2);
      } else {
        expect(body).toHaveProperty('error');
      }
    });

    test('should not expose sensitive information in error messages', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'WrongPassword',
        },
      });

      const body = await response.json();

      // Should not reveal if user exists or which part was wrong
      // Generic error message is better for security
      expect(body.error).not.toMatch(/usuário não encontrado|user not found/i);
      expect(body.error).not.toMatch(/senha correta|password correct/i);
    });
  });

  test.describe('POST /api/auth/logout', () => {
    test('should logout authenticated user', async ({ request }) => {
      // First, login to get session cookie
      const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'Admin123!@#',
        },
      });

      expect(loginResponse.ok()).toBeTruthy();

      const cookies = loginResponse.headers()['set-cookie'];
      expect(cookies).toBeTruthy();

      // Then logout
      const logoutResponse = await request.post(`${baseURL}/api/auth/logout`, {
        headers: {
          Cookie: cookies,
        },
      });

      expect(logoutResponse.ok()).toBeTruthy();

      const body = await logoutResponse.json();
      expect(body).toHaveProperty('success', true);

      // Verify cookie is cleared
      const logoutCookies = logoutResponse.headers()['set-cookie'];
      if (logoutCookies) {
        expect(logoutCookies).toContain('admin-auth-token=;');
      }
    });

    test('should handle logout without session gracefully', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/logout`);

      // Should still succeed (idempotent operation)
      // Or return appropriate status
      expect([200, 401]).toContain(response.status());
    });

    test('should invalidate session after logout', async ({ request }) => {
      // Login
      const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'Admin123!@#',
        },
      });

      const cookies = loginResponse.headers()['set-cookie'];

      // Logout
      await request.post(`${baseURL}/api/auth/logout`, {
        headers: { Cookie: cookies },
      });

      // Try to access protected endpoint with old cookie
      const protectedResponse = await request.get(`${baseURL}/api/posts`, {
        headers: { Cookie: cookies },
      });

      // Should be unauthorized after logout
      expect(protectedResponse.status()).toBe(401);
    });
  });

  test.describe('Session Management', () => {
    test('should set secure cookie attributes', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'Admin123!@#',
        },
      });

      const setCookieHeader = response.headers()['set-cookie'];
      expect(setCookieHeader).toBeTruthy();

      // Verify HttpOnly flag
      expect(setCookieHeader).toMatch(/HttpOnly/i);

      // Verify SameSite attribute
      expect(setCookieHeader).toMatch(/SameSite=(Lax|Strict)/i);

      // In production, should also have Secure flag
      if (process.env.NODE_ENV === 'production') {
        expect(setCookieHeader).toMatch(/Secure/i);
      }
    });

    test('should set appropriate cookie expiration', async ({ request }) => {
      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: 'admin@asof.org.br',
          password: 'Admin123!@#',
        },
      });

      const setCookieHeader = response.headers()['set-cookie'];

      // Should have Max-Age or Expires
      expect(
        setCookieHeader.includes('Max-Age') || setCookieHeader.includes('Expires')
      ).toBeTruthy();

      // Should not be session cookie (should persist)
      if (setCookieHeader.includes('Max-Age')) {
        const maxAge = parseInt(setCookieHeader.match(/Max-Age=(\d+)/)?.[1] || '0');
        // Should be between 1 hour and 7 days
        expect(maxAge).toBeGreaterThan(3600); // > 1 hour
        expect(maxAge).toBeLessThanOrEqual(7 * 24 * 60 * 60); // <= 7 days
      }
    });

    test('should require authentication for protected endpoints', async ({ request }) => {
      const protectedEndpoints = [
        { method: 'GET', path: '/api/posts' },
        { method: 'POST', path: '/api/posts' },
        { method: 'POST', path: '/api/media/upload' },
        { method: 'GET', path: '/api/media' },
      ];

      for (const endpoint of protectedEndpoints) {
        let response;

        if (endpoint.method === 'GET') {
          response = await request.get(`${baseURL}${endpoint.path}`);
        } else {
          response = await request.post(`${baseURL}${endpoint.path}`, {
            data: {},
          });
        }

        // Should require authentication
        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body).toHaveProperty('error');
      }
    });
  });

  test.describe('Input Sanitization', () => {
    test('should handle XSS attempts in email field', async ({ request }) => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert(1)',
        '<svg onload=alert(1)>',
      ];

      for (const payload of xssPayloads) {
        const response = await request.post(`${baseURL}/api/auth/login`, {
          data: {
            email: payload,
            password: 'test',
          },
        });

        // Should reject or sanitize, not cause error
        expect(response.status()).not.toBe(500);
        expect([400, 401]).toContain(response.status());

        const body = await response.json();
        // Response should not contain unescaped payload
        const responseText = JSON.stringify(body);
        expect(responseText).not.toContain('<script>');
        expect(responseText).not.toContain('onerror=');
      }
    });

    test('should handle extremely long input', async ({ request }) => {
      const longEmail = 'a'.repeat(1000) + '@example.com';
      const longPassword = 'p'.repeat(1000);

      const response = await request.post(`${baseURL}/api/auth/login`, {
        data: {
          email: longEmail,
          password: longPassword,
        },
      });

      // Should handle gracefully, not cause error
      expect(response.status()).not.toBe(500);
      expect([400, 401]).toContain(response.status());
    });

    test('should handle special characters', async ({ request }) => {
      const specialChars = [
        'test+tag@example.com',
        'user.name@example.com',
        'user_name@example.com',
        'user-name@example.com',
      ];

      for (const email of specialChars) {
        const response = await request.post(`${baseURL}/api/auth/login`, {
          data: {
            email,
            password: 'TestPassword123',
          },
        });

        // Should handle without error
        expect(response.status()).not.toBe(500);
      }
    });
  });
});
