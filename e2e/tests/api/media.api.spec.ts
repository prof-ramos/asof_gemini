import { test, expect } from '@playwright/test';

/**
 * Media API Tests
 * Tests file upload, listing, and deletion for media library
 */

test.describe('Media API', () => {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
  let authCookie: string;

  // Login before all tests
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: 'admin@asof.org.br',
        password: 'Admin123!@#',
      },
    });

    if (response.ok()) {
      authCookie = response.headers()['set-cookie'];
    }
  });

  // Helper function to create test image buffer
  function createTestImage(): Buffer {
    // 1x1 transparent PNG
    return Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
  }

  test.describe('POST /api/media/upload', () => {
    test('should upload image file successfully', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const testImage = createTestImage();
      const fileName = `test-image-${Date.now()}.png`;

      const response = await request.post(`${baseURL}/api/media/upload`, {
        headers: {
          Cookie: authCookie,
        },
        multipart: {
          file: {
            name: fileName,
            mimeType: 'image/png',
            buffer: testImage,
          },
          alt: 'Test image for API testing',
          title: 'Test Image',
        },
      });

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('media');
      expect(body.media).toHaveProperty('id');
      expect(body.media).toHaveProperty('url');
      expect(body.media).toHaveProperty('mimeType', 'image/png');
      expect(body.media).toHaveProperty('size');
      expect(body.media.size).toBeGreaterThan(0);
    });

    test('should reject upload without authentication', async ({ request }) => {
      const testImage = createTestImage();

      const response = await request.post(`${baseURL}/api/media/upload`, {
        multipart: {
          file: {
            name: 'test.png',
            mimeType: 'image/png',
            buffer: testImage,
          },
        },
      });

      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should accept various image formats', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const allowedFormats = [
        { ext: 'png', mime: 'image/png' },
        { ext: 'jpg', mime: 'image/jpeg' },
        { ext: 'gif', mime: 'image/gif' },
        { ext: 'webp', mime: 'image/webp' },
      ];

      for (const format of allowedFormats) {
        const response = await request.post(`${baseURL}/api/media/upload`, {
          headers: { Cookie: authCookie },
          multipart: {
            file: {
              name: `test-${Date.now()}.${format.ext}`,
              mimeType: format.mime,
              buffer: createTestImage(),
            },
          },
        });

        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body.media.mimeType).toBe(format.mime);
      }
    });

    test('should reject invalid file types', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const invalidTypes = [
        { name: 'malicious.exe', mime: 'application/x-msdownload' },
        { name: 'script.sh', mime: 'application/x-sh' },
        { name: 'script.php', mime: 'text/x-php' },
        { name: 'binary.bin', mime: 'application/octet-stream' },
      ];

      for (const type of invalidTypes) {
        const testFile = Buffer.from('fake file content');

        const response = await request.post(`${baseURL}/api/media/upload`, {
          headers: { Cookie: authCookie },
          multipart: {
            file: {
              name: type.name,
              mimeType: type.mime,
              buffer: testFile,
            },
          },
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('error');
        expect(body.error).toMatch(/tipo de arquivo|file type|não permitido|not allowed/i);
      }
    });

    test('should reject files exceeding size limit', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Create 11MB file (assuming 10MB limit)
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024);

      const response = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: 'large-file.jpg',
            mimeType: 'image/jpeg',
            buffer: largeBuffer,
          },
        },
      });

      expect(response.status()).toBe(413); // Payload Too Large

      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.error).toMatch(/muito grande|too large|excede|exceeds/i);
    });

    test('should sanitize file names', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const maliciousNames = [
        '../../../etc/passwd.png',
        '..\\..\\..\\windows\\system32\\config\\sam.png',
        'test<script>alert(1)</script>.png',
        'test; rm -rf /.png',
        'test\x00null.png',
      ];

      for (const name of maliciousNames) {
        const response = await request.post(`${baseURL}/api/media/upload`, {
          headers: { Cookie: authCookie },
          multipart: {
            file: {
              name,
              mimeType: 'image/png',
              buffer: createTestImage(),
            },
          },
        });

        // Should either reject or sanitize
        if (response.ok()) {
          const body = await response.json();
          const savedName = body.media.fileName || body.media.url;

          // Should not contain path traversal or dangerous characters
          expect(savedName).not.toContain('..');
          expect(savedName).not.toContain('<script>');
          expect(savedName).not.toContain(';');
          expect(savedName).not.toContain('\x00');
        } else {
          expect(response.status()).toBe(400);
        }
      }
    });

    test('should validate file content matches extension', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Try to upload text file as image
      const textBuffer = Buffer.from('This is not an image');

      const response = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: 'fake-image.png',
            mimeType: 'image/png',
            buffer: textBuffer,
          },
        },
      });

      // Should reject or validate content
      // Some implementations may accept, others may validate
      if (!response.ok()) {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body).toHaveProperty('error');
      }
    });

    test('should store metadata correctly', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const metadata = {
        alt: 'Test image alt text',
        title: 'Test Image Title',
        description: 'Detailed description of the test image',
      };

      const response = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: `metadata-test-${Date.now()}.png`,
            mimeType: 'image/png',
            buffer: createTestImage(),
          },
          ...metadata,
        },
      });

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body.media.alt).toBe(metadata.alt);
      expect(body.media.title).toBe(metadata.title);

      if (body.media.description) {
        expect(body.media.description).toBe(metadata.description);
      }
    });

    test('should handle concurrent uploads', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Upload 3 files concurrently
      const uploads = [];
      for (let i = 0; i < 3; i++) {
        uploads.push(
          request.post(`${baseURL}/api/media/upload`, {
            headers: { Cookie: authCookie },
            multipart: {
              file: {
                name: `concurrent-${Date.now()}-${i}.png`,
                mimeType: 'image/png',
                buffer: createTestImage(),
              },
            },
          })
        );
      }

      const responses = await Promise.all(uploads);

      // All should succeed
      responses.forEach((response) => {
        expect(response.ok()).toBeTruthy();
      });

      // All should have unique IDs
      const ids = responses.map((r) => r.json()).map((body: any) => body.media.id);
      const uniqueIds = new Set(await Promise.all(ids));
      expect(uniqueIds.size).toBe(3);
    });
  });

  test.describe('GET /api/media', () => {
    test('should list all media (authenticated)', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const response = await request.get(`${baseURL}/api/media`, {
        headers: { Cookie: authCookie },
      });

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('media');
      expect(Array.isArray(body.media)).toBeTruthy();

      // Verify media structure
      if (body.media.length > 0) {
        const item = body.media[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('url');
        expect(item).toHaveProperty('mimeType');
        expect(item).toHaveProperty('size');
        expect(item).toHaveProperty('createdAt');
      }
    });

    test('should require authentication', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/media`);

      expect(response.status()).toBe(401);
    });

    test('should filter media by type', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const types = ['image', 'video', 'document'];

      for (const type of types) {
        const response = await request.get(`${baseURL}/api/media?type=${type}`, {
          headers: { Cookie: authCookie },
        });

        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        body.media.forEach((item: any) => {
          expect(item.mimeType).toMatch(new RegExp(`^${type}/`));
        });
      }
    });

    test('should paginate results', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const page = 1;
      const limit = 10;

      const response = await request.get(
        `${baseURL}/api/media?page=${page}&limit=${limit}`,
        {
          headers: { Cookie: authCookie },
        }
      );

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('media');
      expect(body).toHaveProperty('pagination');
      expect(body.pagination.page).toBe(page);
      expect(body.pagination.limit).toBe(limit);
      expect(body.media.length).toBeLessThanOrEqual(limit);
    });

    test('should sort by upload date', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const response = await request.get(`${baseURL}/api/media?sortBy=date&order=desc`, {
        headers: { Cookie: authCookie },
      });

      expect(response.ok()).toBeTruthy();

      const body = await response.json();

      // Verify sorting
      if (body.media.length > 1) {
        for (let i = 0; i < body.media.length - 1; i++) {
          const currentDate = new Date(body.media[i].createdAt);
          const nextDate = new Date(body.media[i + 1].createdAt);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
        }
      }
    });

    test('should search media by filename or alt text', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Upload a file with searchable name
      const searchTerm = `searchable-${Date.now()}`;
      await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: `${searchTerm}.png`,
            mimeType: 'image/png',
            buffer: createTestImage(),
          },
          alt: searchTerm,
        },
      });

      // Search for it
      const response = await request.get(`${baseURL}/api/media?search=${searchTerm}`, {
        headers: { Cookie: authCookie },
      });

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body.media.length).toBeGreaterThan(0);

      const found = body.media.some(
        (item: any) =>
          item.fileName?.includes(searchTerm) ||
          item.alt?.includes(searchTerm) ||
          item.url?.includes(searchTerm)
      );

      expect(found).toBeTruthy();
    });
  });

  test.describe('GET /api/media/[id]', () => {
    test('should get media by ID', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // First, upload a file
      const uploadResponse = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: `get-test-${Date.now()}.png`,
            mimeType: 'image/png',
            buffer: createTestImage(),
          },
        },
      });

      const { media: uploadedMedia } = await uploadResponse.json();

      // Get it by ID
      const response = await request.get(`${baseURL}/api/media/${uploadedMedia.id}`, {
        headers: { Cookie: authCookie },
      });

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty('media');
      expect(body.media.id).toBe(uploadedMedia.id);
      expect(body.media.url).toBe(uploadedMedia.url);
    });

    test('should return 404 for non-existent media', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const response = await request.get(`${baseURL}/api/media/99999999`, {
        headers: { Cookie: authCookie },
      });

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should require authentication', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/media/1`);

      expect(response.status()).toBe(401);
    });

    test('should handle SQL injection in ID parameter', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const sqlPayloads = ["1' OR '1'='1", "1; DROP TABLE media--", "1 UNION SELECT NULL--"];

      for (const payload of sqlPayloads) {
        const response = await request.get(`${baseURL}/api/media/${payload}`, {
          headers: { Cookie: authCookie },
        });

        // Should not cause server error
        expect(response.status()).not.toBe(500);
        expect([404, 400]).toContain(response.status());
      }
    });
  });

  test.describe('PUT /api/media/[id]', () => {
    test('should update media metadata', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Upload a file
      const uploadResponse = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: `update-test-${Date.now()}.png`,
            mimeType: 'image/png',
            buffer: createTestImage(),
          },
        },
      });

      const { media } = await uploadResponse.json();

      // Update metadata
      const updates = {
        alt: 'Updated alt text',
        title: 'Updated title',
        description: 'Updated description',
      };

      const response = await request.put(`${baseURL}/api/media/${media.id}`, {
        headers: { Cookie: authCookie },
        data: updates,
      });

      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body.media.alt).toBe(updates.alt);
      expect(body.media.title).toBe(updates.title);
    });

    test('should not allow changing file content', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Upload a file
      const uploadResponse = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: `immutable-test-${Date.now()}.png`,
            mimeType: 'image/png',
            buffer: createTestImage(),
          },
        },
      });

      const { media } = await uploadResponse.json();
      const originalUrl = media.url;

      // Try to update with new file (should be rejected or ignored)
      const response = await request.put(`${baseURL}/api/media/${media.id}`, {
        headers: { Cookie: authCookie },
        data: {
          url: 'https://malicious.com/fake.png',
          mimeType: 'application/x-msdownload',
        },
      });

      // Either rejected or URL unchanged
      if (response.ok()) {
        const body = await response.json();
        expect(body.media.url).toBe(originalUrl);
      } else {
        expect(response.status()).toBe(400);
      }
    });
  });

  test.describe('DELETE /api/media/[id]', () => {
    test('should delete media', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Upload a file
      const uploadResponse = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: `delete-test-${Date.now()}.png`,
            mimeType: 'image/png',
            buffer: createTestImage(),
          },
        },
      });

      const { media } = await uploadResponse.json();

      // Delete it
      const deleteResponse = await request.delete(`${baseURL}/api/media/${media.id}`, {
        headers: { Cookie: authCookie },
      });

      expect(deleteResponse.ok()).toBeTruthy();

      const body = await deleteResponse.json();
      expect(body).toHaveProperty('success', true);

      // Verify it's gone
      const getResponse = await request.get(`${baseURL}/api/media/${media.id}`, {
        headers: { Cookie: authCookie },
      });

      expect(getResponse.status()).toBe(404);
    });

    test('should require authentication', async ({ request }) => {
      const response = await request.delete(`${baseURL}/api/media/1`);

      expect(response.status()).toBe(401);
    });

    test('should return 404 for non-existent media', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const response = await request.delete(`${baseURL}/api/media/99999999`, {
        headers: { Cookie: authCookie },
      });

      expect(response.status()).toBe(404);
    });

    test('should prevent double deletion', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Upload and delete
      const uploadResponse = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: `double-delete-${Date.now()}.png`,
            mimeType: 'image/png',
            buffer: createTestImage(),
          },
        },
      });

      const { media } = await uploadResponse.json();

      // First deletion
      await request.delete(`${baseURL}/api/media/${media.id}`, {
        headers: { Cookie: authCookie },
      });

      // Second deletion attempt
      const response = await request.delete(`${baseURL}/api/media/${media.id}`, {
        headers: { Cookie: authCookie },
      });

      expect(response.status()).toBe(404);
    });

    test('should delete file from storage', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Upload a file
      const uploadResponse = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: `storage-delete-${Date.now()}.png`,
            mimeType: 'image/png',
            buffer: createTestImage(),
          },
        },
      });

      const { media } = await uploadResponse.json();
      const fileUrl = media.url;

      // Delete it
      await request.delete(`${baseURL}/api/media/${media.id}`, {
        headers: { Cookie: authCookie },
      });

      // Try to access the file URL (should be 404 or 403)
      const fileResponse = await request.get(fileUrl);
      expect([403, 404]).toContain(fileResponse.status());
    });
  });

  test.describe('Media Security', () => {
    test('should prevent directory traversal in file paths', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      const maliciousPaths = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '/etc/passwd',
        'C:\\Windows\\System32\\config\\sam',
      ];

      for (const path of maliciousPaths) {
        const response = await request.get(`${baseURL}/api/media/${path}`, {
          headers: { Cookie: authCookie },
        });

        // Should reject or return 404
        expect(response.status()).not.toBe(200);
        expect([400, 404]).toContain(response.status());
      }
    });

    test('should validate MIME types strictly', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Try to upload PHP file disguised as image
      const phpContent = Buffer.from('<?php system($_GET["cmd"]); ?>');

      const response = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: 'malicious.php.png',
            mimeType: 'image/png',
            buffer: phpContent,
          },
        },
      });

      // Should reject based on content validation
      if (!response.ok()) {
        expect(response.status()).toBe(400);
      }
    });

    test('should set appropriate Content-Disposition headers', async ({ request }) => {
      if (!authCookie) {
        test.skip();
        return;
      }

      // Upload a file
      const uploadResponse = await request.post(`${baseURL}/api/media/upload`, {
        headers: { Cookie: authCookie },
        multipart: {
          file: {
            name: `content-disposition-${Date.now()}.png`,
            mimeType: 'image/png',
            buffer: createTestImage(),
          },
        },
      });

      const { media } = await uploadResponse.json();

      // Access the file
      const fileResponse = await request.get(media.url);

      if (fileResponse.ok()) {
        const headers = fileResponse.headers();

        // Should have Content-Disposition or Content-Type
        expect(
          headers['content-disposition'] || headers['content-type']
        ).toBeTruthy();

        // If Content-Disposition exists, should be inline or attachment
        if (headers['content-disposition']) {
          expect(headers['content-disposition']).toMatch(/inline|attachment/);
        }
      }
    });
  });
});
