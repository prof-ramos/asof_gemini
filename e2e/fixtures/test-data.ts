/**
 * Test Data e Fixtures
 * Dados reutilizáveis para testes E2E
 */

export const testContacts = {
  valid: {
    name: 'João da Silva',
    email: 'joao.silva@exemplo.com.br',
    phone: '(61) 98765-4321',
    subject: 'Informações sobre associação',
    message: 'Gostaria de receber mais informações sobre como me associar à ASOF e conhecer os benefícios oferecidos.',
  },
  minimal: {
    name: 'Maria Santos',
    email: 'maria.santos@teste.com',
    message: 'Mensagem de teste com apenas campos obrigatórios.',
  },
  invalid: {
    name: 'Pedro',
    email: 'email-invalido',
    message: 'Teste',
  },
};

export const testNewsSlugs = [
  'avanco-negociacao-salarial',
  'encontro-saude-mental',
  'eleicoes-diretoria-2025',
];

export const testUrls = {
  home: '/',
  about: '/sobre',
  services: '/atuacao',
  news: '/noticias',
  transparency: '/transparencia',
  contact: '/contato',
};

export const viewports = {
  desktop: { width: 1920, height: 1080 },
  laptop: { width: 1366, height: 768 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  mobile: { width: 375, height: 667 }, // iPhone SE
  mobileSmall: { width: 320, height: 568 }, // iPhone 5
  mobileLarge: { width: 414, height: 896 }, // iPhone XR
};

export const seoExpectations = {
  minTitleLength: 10,
  maxTitleLength: 60,
  minDescriptionLength: 50,
  maxDescriptionLength: 160,
  requiredOgTags: ['og:title', 'og:description', 'og:type', 'og:url'],
  requiredTwitterTags: ['twitter:card', 'twitter:title'],
};

export const performanceThresholds = {
  lcp: {
    good: 2500,
    acceptable: 4000,
  },
  fid: {
    good: 100,
    acceptable: 300,
  },
  cls: {
    good: 0.1,
    acceptable: 0.25,
  },
  fcp: {
    good: 1800,
    acceptable: 3000,
  },
  tti: {
    good: 3800,
    acceptable: 7300,
  },
  tbt: {
    good: 200,
    acceptable: 600,
  },
};

export const accessibilityStandards = {
  wcagLevel: 'AA',
  wcagVersion: '2.1',
  minTouchTargetSize: 44, // pixels
  minContrastRatio: 4.5, // Para texto normal
  minContrastRatioLarge: 3, // Para texto grande (18pt+)
};

export const testUsers = {
  member: {
    name: 'Associado Teste',
    email: 'associado@teste.asof.org.br',
    membershipId: '12345',
  },
  admin: {
    name: 'Admin Teste',
    email: 'admin@teste.asof.org.br',
    role: 'administrator',
  },
};

export const mockNewsArticle = {
  title: 'Título de Teste para Artigo',
  date: '2024-11-15',
  category: 'Institucional',
  author: 'ASOF',
  excerpt: 'Este é um resumo de teste para um artigo de notícia.',
  content: `
# Título Principal

Este é o conteúdo de um artigo de teste.

## Subtítulo

Parágrafo com mais detalhes sobre o assunto.

- Item 1
- Item 2
- Item 3

**Texto em negrito** e *texto em itálico*.
  `,
  readingTime: '5 min',
};

export const formValidationMessages = {
  pt: {
    required: /obrigatório|required|preencha/i,
    invalidEmail: /e-mail inválido|invalid email/i,
    invalidPhone: /telefone inválido|invalid phone/i,
    minLength: /mínimo de caracteres|minimum length/i,
    maxLength: /máximo de caracteres|maximum length/i,
  },
};

export const browserConfigs = {
  chrome: {
    name: 'chromium',
    userAgent: /Chrome/,
  },
  firefox: {
    name: 'firefox',
    userAgent: /Firefox/,
  },
  safari: {
    name: 'webkit',
    userAgent: /Safari/,
  },
};

export const apiEndpoints = {
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  search: '/api/search',
};

// Helper functions para testes
export const generateRandomEmail = () => {
  const timestamp = Date.now();
  return `teste${timestamp}@exemplo.com.br`;
};

export const generateRandomPhone = () => {
  const areaCode = Math.floor(Math.random() * 90) + 10;
  const firstPart = Math.floor(Math.random() * 9000) + 90000; // 90000-98999 (9XXXX)
  const secondPart = Math.floor(Math.random() * 9000) + 1000;
  return `(${areaCode}) ${firstPart}-${secondPart}`;
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date input: ${date}`);
  }
  return d.toLocaleDateString('pt-BR');
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
};
