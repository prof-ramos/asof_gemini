## 🚀 Deploy na Vercel (Free Tier)

O projeto está **100% otimizado para Vercel Free Tier** com custo **R$ 0,00/mês**! 🎉

### Funcionalidades Gratulitas Ativadas

- ✅ **Analytics Completo**: `@vercel/analytics` - Monitoramento em tempo real
- ✅ **Speed Insights**: Core Web Vitals tracking gratuito
- ✅ **ISR (Incremental Static Regeneration)**: Cache inteligente de páginas de notícias
- ✅ **Headers de Segurança**: Middleware para proteção automática
- ✅ **CDN Edge Global**: Performance otimizada para Brasil
- ✅ **Certificado SSL**: HTTPS automático e grátis
- ✅ **1 Domínio Gratuito**: Primeiro domínio sem custos
- ✅ **GitHub Actions**: CI/CD automático (2.000 minutos/mês FREE)

### Limites do Free Tier (Mais que suficiente para site institucional)

- **100 GB** bandwidth/mês
- **1.000 builds**/mês
- **100 GB** Edge Functions/mês
- **1 domínio** gratuito
- **Analytics e Speed Insights** completos

### Como Fazer Deploy

#### 1. Preparar Conta Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Link do projeto (dentro da pasta do projeto)
vercel link
```

#### 2. Configurar Secrets no GitHub (para CI/CD automático)

No seu repositório GitHub, vá para **Settings > Secrets and variables > Actions** e adicione:

```
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=your_project_id_here
```

#### 3. Primeiro Deploy

```bash
# Deploy inicial (será criado preview domain *.vercel.app)
vercel

# Ou diretamente para produção
vercel --prod
```

#### 4. Configurar Domínio Customizado (Gratuito)

```bash
# Adicionar domínio (primeiro é gratuito)
vercel domains add asof.org.br

# SSL será automático e gratuito
```

### Monitoramento e Analytics

Após o deploy, no dashboard Vercel você terá acesso a:

- **Real-time Analytics**: Visitors únicos, pageviews, bounce rate
- **Speed Insights**: LCP, CLS, FID - Core Web Vitals
- **Performance Monitoring**: Function duration, errors
- **Traffic Analytics**: Geographic distribution, device types

### Otimizações Implementadas

#### Middleware para Segurança (middleware.ts)
```typescript
// Headers automáticos em todas as rotas
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
```

#### ISR para Notícias (app/noticias/page.tsx)
```typescript
// Cache de 1 hora para páginas de notícias
export const revalidate = 3600;
```

#### Configuração Otimizada (vercel.json)
```json
{
  "regions": ["gru1"],
  "functions": {},
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Como Manter o Free Tier

O projeto está otimizado para não exceder os limites:

- **Cache Estrategico**: ISR em notícias reduz computations
- **Zero Edge Functions**: Somente renderização estática/SSR
- **Imagens Otimizadas**: Automatic Next.js image optimization
- **Bundle Pequeno**: ~60KB final após compressão

### Troubleshooting

#### Problema: Build Falhando
```bash
# Verificar logs locais
npm run build

# Build limpo
rm -rf .next && rm -rf node_modules && npm install && npm run build
```

#### Problema: Bandwidth Atingindo Limite
Aumentar cache ISR: `export const revalidate = 7200` (2 horas)

#### Problema: Domínio Não Funcionando
```bash
vercel domains ls
vercel domains add your-domain.com
```

### Quando Fazer Upgrade

- Traffic muito alto (>100GB/mês)
- Builds muito frequentes (>1.000/mês)
- Edge Functions customizadas necessárias
- Team features avançados (SSO, etc.)

- ✅ Navegação por teclado
- ✅ Alt text descritivos
- ✅ Semantic HTML
- ✅ Contraste adequado (WCAG 2.1 AA)

### Blog (MDX)

- ✅ Sistema completo de blog com MDX
- ✅ Frontmatter para metadata
- ✅ Reading time automático
- ✅ Categorias e filtros
- ✅ Notícias relacionadas
- ✅ Geração estática de páginas

## 🎯 Otimizações Implementadas

### Next.js

- App Router com Server Components
- Metadata API para SEO
- Compressão habilitada
- Headers de segurança configurados
- Image optimization com AVIF/WebP
- Font optimization com self-hosting

### TypeScript

- Strict mode ativado
- No unused locals
- No unused parameters
- Path aliases (@/*)

### Tailwind CSS

- Paleta de cores customizada
- Fontes customizadas
- Animações otimizadas
- PurgeCSS automático

## 📦 Dependências Principais

```json
{
  "next": "^15.1.8",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "@next/mdx": "^16.0.3",
  "@mdx-js/react": "^3.1.1",
  "gray-matter": "^4.0.3",
  "lucide-react": "^0.553.0",
  "next-mdx-remote": "^5.0.0"
}
```

## 🔧 Configurações

### next.config.ts

- Suporte a MDX
- Otimizações de imagem (AVIF, WebP)
- Headers de segurança
- Compressão habilitada
- Console.log removido em produção

### tailwind.config.ts

- Cores customizadas ASOF
- Fontes variáveis
- Animações customizadas
- Container padrão

## 📝 Como Adicionar Conteúdo

### Adicionar Nova Notícia

1. Criar arquivo `.mdx` em `content/noticias/`
2. Adicionar frontmatter:

```mdx
---
title: "Título da Notícia"
date: "2024-MM-DD"
category: "Categoria"
excerpt: "Resumo breve..."
author: "Autor"
image: "/images/noticia.jpg"
---

# Conteúdo em Markdown...
```

3. O arquivo será automaticamente incluído na listagem

### Editar Páginas Estáticas

- Editar arquivos em `app/[pagina]/page.tsx`
- Componentes reutilizáveis em `components/`

## 🚀 Deploy na Vercel (Free Tier)

O projeto está **100% otimizado para Vercel Free Tier** com custo **R$ 0,00/mês**! 🎉

### Funcionalidades Gratulitas Ativadas

- ✅ **Analytics Completo**: `@vercel/analytics` - Monitoramento em tempo real
- ✅ **Speed Insights**: Core Web Vitals tracking gratuito
- ✅ **ISR (Incremental Static Regeneration)**: Cache inteligente de páginas de notícias
- ✅ **Headers de Segurança**: Middleware para proteção automática
- ✅ **CDN Edge Global**: Performance otimizada para Brasil
- ✅ **Certificado SSL**: HTTPS automático e grátis
- ✅ **1 Domínio Gratuito**: Primeiro domínio sem custos
- ✅ **GitHub Actions**: CI/CD automático (2.000 minutos/mês FREE)

### Limites do Free Tier (Mais que suficiente para site institucional)

- **100 GB** bandwidth/mês
- **1.000 builds**/mês
- **100 GB** Edge Functions/mês
- **1 domínio** gratuito
- **Analytics e Speed Insights** completos

### Como Fazer Deploy

#### 1. Preparar Conta Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Link do projeto (dentro da pasta do projeto)
vercel link
```

#### 2. Configurar Secrets no GitHub (para CI/CD automático)

No seu repositório GitHub, vá para **Settings > Secrets and variables > Actions** e adicione:

```
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=your_project_id_here
```

#### 3. Primeiro Deploy

```bash
# Deploy inicial (será criado preview domain *.vercel.app)
vercel

# Ou diretamente para produção
vercel --prod
```

#### 4. Configurar Domínio Customizado (Gratuito)

```bash
# Adicionar domínio (primeiro é gratuito)
vercel domains add asof.org.br

# SSL será automático e gratuito
```

### Monitoramento e Analytics

Após o deploy, no dashboard Vercel você terá acesso a:

- **Real-time Analytics**: Visitors únicos, pageviews, bounce rate
- **Speed Insights**: LCP, CLS, FID - Core Web Vitals
- **Performance Monitoring**: Function duration, errors
- **Traffic Analytics**: Geographic distribution, device types

### Otimizações Implementadas

#### Middleware para Segurança (middleware.ts)
```typescript
// Headers automáticos em todas as rotas
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
```

#### ISR para Notícias (app/noticias/page.tsx)
```typescript
// Cache de 1 hora para páginas de notícias
export const revalidate = 3600;
```

#### Configuração Otimizada (vercel.json)
```json
{
  "regions": ["gru1"],
  "functions": {},
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Como Manter o Free Tier

O projeto está otimizado para não exceder os limites:

- **Cache Estrategico**: ISR em notícias reduz computations
- **Zero Edge Functions**: Somente renderização estática/SSR
- **Imagens Otimizadas**: Automatic Next.js image optimization
- **Bundle Pequeno**: ~60KB final após compressão

### Troubleshooting

#### Problema: Build Falhando
```bash
# Verificar logs locais
npm run build

# Build limpo
rm -rf .next && rm -rf node_modules && npm install && npm run build
```

#### Problema: Bandwidth Atingindo Limite
Aumentar cache ISR: `export const revalidate = 7200` (2 horas)

#### Problema: Domínio Não Funcionando
```bash
vercel domains ls
vercel domains add your-domain.com
```

### Quando Fazer Upgrade

- Traffic muito alto (>100GB/mês)
- Builds muito frequentes (>1.000/mês)
- Edge Functions customizadas necessárias
- Team features avançados (SSO, etc.)

**Com o Free Tier, o site da ASoF pode receber milhares de visitantes por mês sem nenhum custo!** 🚀

## 📊 Performance Esperada

- **Lighthouse Score**: 95+
- **LCP**: < 2.0s
- **CLS**: < 0.05
- **INP**: < 100ms
- **Bundle JS**: ~60KB

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

© 2024 ASOF - Todos os direitos reservados.

## 📞 Suporte

- **Email**: contato@asof.org.br
- **Telefone**: +55 (61) 3322-0000
- **Site**: https://asof.org.br
