/**
 * API Test Data and Fixtures
 * Centralized test data for API testing
 */

export const validPost = {
  title: 'Test Post Title',
  content: '# Test Content\n\nThis is a test post for API testing with markdown formatting.',
  excerpt: 'Test excerpt for API testing',
  status: 'DRAFT' as const,
  categoryId: 1,
};

export const invalidPost = {
  title: '', // Empty title (invalid)
  content: '', // Empty content (invalid)
};

export const adminCredentials = {
  valid: {
    email: 'admin@asof.org.br',
    password: 'Admin123!@#',
  },
  invalid: {
    email: 'admin@asof.org.br',
    password: 'WrongPassword',
  },
  nonExistent: {
    email: 'nonexistent@example.com',
    password: 'Password123',
  },
};

export const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPass123!',
  role: 'EDITOR',
};

export const mediaTypes = {
  allowed: [
    { ext: 'jpg', mime: 'image/jpeg' },
    { ext: 'jpeg', mime: 'image/jpeg' },
    { ext: 'png', mime: 'image/png' },
    { ext: 'gif', mime: 'image/gif' },
    { ext: 'webp', mime: 'image/webp' },
    { ext: 'pdf', mime: 'application/pdf' },
  ],
  disallowed: [
    { ext: 'exe', mime: 'application/x-msdownload' },
    { ext: 'sh', mime: 'application/x-sh' },
    { ext: 'php', mime: 'text/x-php' },
    { ext: 'bat', mime: 'application/x-bat' },
    { ext: 'cmd', mime: 'application/x-cmd' },
  ],
};

export const apiHeaders = {
  json: {
    'Content-Type': 'application/json',
  },
  multipart: {
    'Content-Type': 'multipart/form-data',
  },
};

export const httpStatus = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

export const postStatuses = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
  SCHEDULED: 'SCHEDULED',
} as const;

export const userRoles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  AUTHOR: 'AUTHOR',
  VIEWER: 'VIEWER',
} as const;

export const mediaCategories = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  AUDIO: 'audio',
} as const;

export const sqlInjectionPayloads = [
  "' OR '1'='1",
  "'; DROP TABLE users--",
  "1' UNION SELECT NULL--",
  "admin'--",
  "' OR 1=1--",
  "1; DELETE FROM posts WHERE '1'='1",
];

export const xssPayloads = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  'javascript:alert(1)',
  '<iframe src="javascript:alert(1)">',
  '<body onload=alert(1)>',
  '<input onfocus=alert(1) autofocus>',
];

export const pathTraversalPayloads = [
  '../../../etc/passwd',
  '..\\..\\..\\windows\\system32\\config\\sam',
  '/etc/passwd',
  'C:\\Windows\\System32\\config\\sam',
  '....//....//....//etc/passwd',
];

export const invalidEmailFormats = [
  'invalid-email',
  'missing-at-sign.com',
  '@no-local-part.com',
  'no-domain@',
  'spaces in@email.com',
  'double@@example.com',
  'trailing-dot@example.com.',
  'multiple..dots@example.com',
];

export const validEmailFormats = [
  'test@example.com',
  'user+tag@example.com',
  'user.name@example.com',
  'user_name@example.com',
  'user-name@example.com',
  'test.email+filter@subdomain.example.com',
];

export const paginationDefaults = {
  page: 1,
  limit: 20,
  maxLimit: 100,
};

export const fileSizeLimits = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  document: 5 * 1024 * 1024, // 5MB
  general: 10 * 1024 * 1024, // 10MB
};

export const sessionConfig = {
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  maxFailedAttempts: 5,
  lockoutDuration: 30 * 60, // 30 minutes in seconds
};

export const validationRules = {
  post: {
    titleMinLength: 3,
    titleMaxLength: 200,
    contentMinLength: 10,
    contentMaxLength: 50000,
    excerptMaxLength: 500,
  },
  user: {
    passwordMinLength: 8,
    passwordMaxLength: 128,
    nameMinLength: 2,
    nameMaxLength: 100,
  },
  media: {
    altTextMaxLength: 255,
    titleMaxLength: 200,
    descriptionMaxLength: 1000,
  },
};

// Helper function to generate random test data
export const generateTestData = {
  email: () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,

  password: () => `TestPass${Math.random().toString(36).substr(2, 9)}!`,

  postTitle: () => `Test Post ${Date.now()} - ${Math.random().toString(36).substr(2, 9)}`,

  postContent: () => `# Test Content\n\nGenerated at ${new Date().toISOString()}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.`,

  fileName: (ext: string = 'png') => `test-file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`,

  slug: (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '');
  },
};

// Test image buffers
export const testImages = {
  // 1x1 transparent PNG (smallest valid PNG)
  transparentPNG: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  ),

  // 1x1 red PNG
  redPNG: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
    'base64'
  ),

  // 1x1 GIF
  simpleGIF: Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  ),

  // Fake/invalid image
  fakeImage: Buffer.from('This is not a real image file'),

  // Large buffer (for testing size limits)
  createLargeBuffer: (sizeInMB: number) => Buffer.alloc(sizeInMB * 1024 * 1024),
};

// API endpoint constants
export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
  },
  posts: {
    list: '/api/posts',
    create: '/api/posts',
    get: (slug: string) => `/api/posts/${slug}`,
    update: (slug: string) => `/api/posts/${slug}`,
    delete: (slug: string) => `/api/posts/${slug}`,
  },
  media: {
    list: '/api/media',
    upload: '/api/media/upload',
    get: (id: string | number) => `/api/media/${id}`,
    update: (id: string | number) => `/api/media/${id}`,
    delete: (id: string | number) => `/api/media/${id}`,
  },
  categories: {
    list: '/api/categories',
    create: '/api/categories',
    get: (id: string | number) => `/api/categories/${id}`,
    update: (id: string | number) => `/api/categories/${id}`,
    delete: (id: string | number) => `/api/categories/${id}`,
  },
};

// Expected response structures
export const responseStructures = {
  success: {
    success: true,
    data: expect.any(Object),
  },
  error: {
    error: expect.any(String),
  },
  pagination: {
    page: expect.any(Number),
    limit: expect.any(Number),
    total: expect.any(Number),
    totalPages: expect.any(Number),
  },
  post: {
    id: expect.any(Number),
    title: expect.any(String),
    slug: expect.any(String),
    content: expect.any(String),
    status: expect.stringMatching(/DRAFT|PUBLISHED|ARCHIVED|SCHEDULED/),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },
  media: {
    id: expect.any(Number),
    url: expect.any(String),
    mimeType: expect.any(String),
    size: expect.any(Number),
    createdAt: expect.any(String),
  },
  user: {
    id: expect.any(Number),
    email: expect.any(String),
    role: expect.stringMatching(/SUPER_ADMIN|ADMIN|EDITOR|AUTHOR|VIEWER/),
  },
};

// Rate limiting configuration
export const rateLimits = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  upload: {
    maxFiles: 10,
    windowMs: 60 * 1000, // 1 minute
  },
};

// Cookie attributes to check
export const cookieAttributes = {
  sessionCookie: 'admin-auth-token',
  requiredFlags: ['HttpOnly', 'SameSite'],
  productionFlags: ['HttpOnly', 'SameSite', 'Secure'],
};
