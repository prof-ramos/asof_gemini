import type { SiteConfig, NavItem } from '@/types';

export const SITE_CONFIG: SiteConfig = {
  name: 'ASOF',
  fullName: 'Associação Nacional dos Oficiais de Chancelaria',
  description: 'Representamos os Oficiais de Chancelaria, pilar fundamental da estrutura e funcionamento do Ministério das Relações Exteriores do Brasil.',
  url: 'https://asof.org.br',
  ogImage: '/og-image.jpg',
  links: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    linkedin: '#',
  },
  contact: {
    email: 'contato@asof.org.br',
    phone: '+55 (61) 3322-0000',
    address: 'Setor de Autarquias Sul, Quadra 5',
    city: 'Brasília - DF, Brasil',
  },
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Atuação', href: '/atuacao' },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Transparência', href: '/transparencia' },
  { label: 'Contato', href: '/contato' },
];

export const COLORS = {
  primary: '#040920',
  primaryDark: '#0D2A4A',
  accent: '#82b4d6',
  accentLight: '#a0c8e4',
  neutral: '#e7edf4',
};
