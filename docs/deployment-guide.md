# Guia de Deployment - ASOF Website

> **Guia completo para deploy do projeto ASOF na Vercel**
> **Última atualização**: 2025-01-16
> **Stack**: Next.js 15.1.8 + Prisma 6.19.0 + PostgreSQL

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Deploy na Vercel](#deploy-na-vercel)
5. [Migrations do Prisma](#migrations-do-prisma)
6. [Troubleshooting](#troubleshooting)
7. [Monitoramento e Performance](#monitoramento-e-performance)

---

## 🔧 Pré-requisitos

### Requisitos Mínimos

- **Node.js**: 20.x ou superior
- **npm**: 10.x ou superior
- **Conta Vercel**: [vercel.com/signup](https://vercel.com/signup)
- **Banco de Dados PostgreSQL**: Recomendado Vercel Postgres, Supabase ou Neon

### Checklist Antes do Deploy

- [ ] Código commitado e pusheado para repositório Git
- [ ] `npm run build` executado com sucesso localmente
- [ ] `npm run lint` sem erros
- [ ] Testes E2E passando (`npm run test:e2e`)
- [ ] Banco de dados PostgreSQL configurado
- [ ] Variáveis de ambiente preparadas

---

## 💾 Configuração do Banco de Dados

### Opção 1: Vercel Postgres (Recomendado)

**Vantagens**: Integração nativa, connection pooling, região otimizada

**Setup**:
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Vá em **Storage** → **Create Database** → **Postgres**
3. Selecione região **Washington, D.C., USA (iad1)** (mesma do projeto)
4. Copie a `DATABASE_URL` gerada

**Connection String Format**:
```
postgresql://user:pass@host-pooler.region.vercel-storage.com:5432/database?pgbouncer=true&connect_timeout=15
```

⚠️ **IMPORTANTE**: Use a URL com `-pooler` para connection pooling automático!

### Opção 2: Supabase

**Vantagens**: Tier gratuito generoso, interface amigável, backups automáticos

**Setup**:
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Copie **Connection Pooling** URL (não a Direct Connection)
4. Use porta **6543** (Supavisor pooler)

**Connection String Format**:
```
postgresql://postgres.projectref:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Opção 3: Neon

**Vantagens**: Serverless nativo, branching de banco de dados

**Setup**:
1. Acesse [neon.tech](https://neon.tech)
2. Crie novo projeto
3. Copie **Pooled connection** string

**Connection String Format**:
```
postgresql://user:pass@ep-name-region.neon.tech/dbname?sslmode=require
```

### Aplicar Migrations

Após configurar o banco de dados:

```bash
# 1. Configure DATABASE_URL no .env
echo "DATABASE_URL='sua-connection-string'" > .env

# 2. Execute migrations
npm run db:migrate:deploy

# 3. (Opcional) Popular com dados de seed
npm run db:seed
```

---

## 🔐 Variáveis de Ambiente

### Variáveis Obrigatórias

Configure no **Vercel Dashboard** → **Settings** → **Environment Variables**

#### Database
```bash
DATABASE_URL="postgresql://..." # Connection string com pooling
```

#### NextAuth (quando implementado)
```bash
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

#### Email (quando implementado)
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@asof.org.br"
```

### Variáveis Automáticas da Vercel

Estas são injetadas automaticamente pela Vercel:

```bash
VERCEL="1"
VERCEL_ENV="production" # ou "preview" ou "development"
VERCEL_URL="your-deployment.vercel.app"
VERCEL_REGION="iad1"
```

### Variáveis Opcionais

```bash
# Analytics (já habilitado por padrão)
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS="true"

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE="false"
NEXT_PUBLIC_ENABLE_PWA="false"

# Admin
ADMIN_EMAIL="admin@asof.org.br"
```

---

## 🚀 Deploy na Vercel

### Método 1: GitHub Integration (Recomendado)

**Vantagens**: Deploy automático, preview deployments, rollbacks fáceis

**Setup**:

1. **Conectar Repositório**
   ```
   1. Acesse vercel.com/new
   2. Selecione repositório: prof-ramos/asof_gemini
   3. Configure Import Project
   ```

2. **Configurar Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: prisma generate && npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Adicionar Variáveis de Ambiente**
   - Vá em **Environment Variables**
   - Adicione `DATABASE_URL` e outras variáveis
   - Selecione ambientes: **Production**, **Preview**, **Development**

4. **Configurar Região**
   - Vá em **Settings** → **General**
   - Function Region: **Washington, D.C., USA (iad1)**

5. **Deploy**
   - Clique em **Deploy**
   - Aguarde build (~2-3 minutos)

### Método 2: Vercel CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (primeira vez)
vercel

# 4. Deploy para produção
vercel --prod
```

### Deploy Automático

**Branches Configuradas**:
- **main**: Deploy de produção automático
- **develop**: Preview deployment automático
- **claude/\***: Preview deployment para PRs

**Processo**:
```
git push origin main
  ↓
GitHub Actions executa testes E2E
  ↓ (se passar)
Vercel faz deploy automático
  ↓
Deploy URL: https://asof-gemini.vercel.app
```

---

## 🗄️ Migrations do Prisma

### Desenvolvimento Local

```bash
# Criar nova migration
npm run db:migrate

# Reset completo do banco (⚠️ apaga dados)
npm run db:reset
```

### Produção (Vercel)

**CRÍTICO**: Migrations em produção devem ser aplicadas **antes** do deploy do código.

#### Opção 1: Via Vercel Build

Já configurado no `vercel.json`:
```json
{
  "buildCommand": "prisma generate && npm run build"
}
```

O `postinstall` script garante que o Prisma Client seja gerado:
```json
{
  "postinstall": "prisma generate || true"
}
```

#### Opção 2: Manual (para controle fino)

```bash
# 1. Aplicar migrations via CLI
npx prisma migrate deploy --preview-feature

# 2. Ou via Vercel CLI com env vars
vercel env pull .env.production
DATABASE_URL="..." npx prisma migrate deploy
```

#### Opção 3: CI/CD Pipeline (GitHub Actions)

Criar `.github/workflows/migrate.yml`:

```yaml
name: Database Migration

on:
  push:
    branches:
      - main
    paths:
      - 'prisma/schema.prisma'

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Rollback de Migration

```bash
# 1. Identifique a migration problemática
npx prisma migrate status

# 2. Reverta manualmente via SQL
psql $DATABASE_URL -f prisma/migrations/xxx/migration.sql

# 3. Marque migration como aplicada
npx prisma migrate resolve --applied "migration_name"
```

---

## 🐛 Troubleshooting

### Erro: "Prisma Client is not generated"

**Causa**: Build cache da Vercel desatualizado

**Solução**:
```bash
# 1. No Vercel Dashboard
Settings → General → Clear Build Cache

# 2. Redeploy
git commit --allow-empty -m "Clear Vercel cache"
git push
```

### Erro: "Can't reach database server"

**Causa**: Connection string incorreta ou firewall

**Solução**:
```bash
# 1. Teste localmente
psql $DATABASE_URL

# 2. Verifique se está usando pooling URL
# Correto: -pooler.region.vercel-storage.com
# Errado: .region.vercel-storage.com

# 3. Adicione ?connect_timeout=15 na URL
```

### Erro: "Too many connections"

**Causa**: Falta de connection pooling

**Solução**:
```typescript
// lib/prisma.ts - Já implementado
const prisma = globalThis.prismaGlobal ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})
```

**Ou use PgBouncer/Supavisor**:
```
DATABASE_URL="...?pgbouncer=true"
```

### Build Timeout

**Causa**: Dependências pesadas ou build lento

**Solução**:
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

### Preview Deployment com Schema Diferente

**Solução**: Use Neon Database Branching

```bash
# 1. Crie branch do banco
neon branches create --project-id xxx preview-branch

# 2. Configure no Vercel
Preview Environment Variable:
DATABASE_URL_PREVIEW="postgresql://...preview-branch..."
```

---

## 📊 Monitoramento e Performance

### Vercel Analytics

**Já configurado** via `@vercel/analytics`:

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Métricas disponíveis**:
- Page views
- Unique visitors
- Top pages
- Referrers
- Devices

### Speed Insights

**Já configurado** via `@vercel/speed-insights`:

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

<SpeedInsights />
```

**Core Web Vitals monitorados**:
- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **INP** (Interaction to Next Paint): < 100ms ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅

### Logs e Debugging

**Vercel Dashboard → Deployments → Logs**

```bash
# Filtrar logs de função específica
Function: app/api/posts/route

# Filtrar por erro
Level: Error

# Real-time logs via CLI
vercel logs asof-gemini --follow
```

### Alerts e Notifications

Configure em **Settings → Notifications**:

- ✅ Deployment Failed
- ✅ Build Errors
- ✅ Function Errors (> 10/min)
- ✅ Downtime (> 1min)

---

## 🔒 Segurança

### Headers de Segurança

**Já configurados** em `next.config.ts` e `vercel.json`:

```typescript
{
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

### Environment Variables

**NUNCA** commite:
- `.env`
- `.env.local`
- `.env.production`

**SEMPRE** use Vercel Dashboard para configurar variáveis sensíveis.

### Database Credentials

**Rotação recomendada**: A cada 90 dias

```bash
# 1. Gere nova password
# 2. Atualize DATABASE_URL na Vercel
# 3. Redeploy
# 4. Revogue senha antiga
```

---

## 📈 Otimizações Aplicadas

### Build Optimizations

- ✅ **Prisma generate** no postinstall
- ✅ **Tree-shaking** otimizado para lucide-react, clsx
- ✅ **Remove console.log** em produção
- ✅ **Compression** habilitada
- ✅ **Bundle analyzer** disponível (`npm run analyze`)

### Image Optimizations

- ✅ **Formatos modernos**: AVIF, WebP
- ✅ **Cache**: 1 ano para imagens otimizadas
- ✅ **Lazy loading** nativo
- ✅ **Responsive images** com srcset automático

### Caching Strategy

```typescript
// Headers já configurados
'/images/:path*': {
  'Cache-Control': 'public, max-age=31536000, immutable'
}

'/fonts/:path*': {
  'Cache-Control': 'public, max-age=31536000, immutable'
}
```

---

## 🔄 CI/CD Workflow

### Fluxo Atual

```mermaid
graph LR
    A[Push to main] --> B[GitHub Actions]
    B --> C{Tests Pass?}
    C -->|Yes| D[Vercel Deploy]
    C -->|No| E[Notify Developer]
    D --> F[Production Live]
```

### GitHub Actions

Configurado em `.github/workflows/`:

1. **Lint Check**: Roda em todos os PRs
2. **E2E Tests**: Roda antes de merge
3. **Type Check**: Verifica TypeScript strict

---

## 📝 Checklist de Deploy

### Antes do Deploy

- [ ] Código no repositório Git
- [ ] Build local bem-sucedido
- [ ] Testes E2E passando
- [ ] Lint sem erros
- [ ] Database migrations criadas
- [ ] Variáveis de ambiente documentadas

### Durante o Deploy

- [ ] Variáveis configuradas no Vercel Dashboard
- [ ] Região correta selecionada (iad1)
- [ ] Build command: `prisma generate && npm run build`
- [ ] Migrations aplicadas

### Após o Deploy

- [ ] Testar URL de produção
- [ ] Verificar Analytics funcionando
- [ ] Verificar Speed Insights
- [ ] Testar formulários e API routes
- [ ] Verificar logs de erro

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [Vercel Docs - Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Prisma Docs - Deploy to Vercel](https://www.prisma.io/docs/guides/deployment/serverless/deploy-to-vercel)
- [Next.js 15 Docs](https://nextjs.org/docs)

### Templates e Exemplos

- [Vercel Postgres + Prisma Starter](https://vercel.com/templates/next.js/postgres-prisma)
- [Next.js Auth Starter](https://vercel.com/templates/next.js/prisma-postgres)

### Suporte

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Prisma Discord**: [pris.ly/discord](https://pris.ly/discord)
- **GitHub Issues**: Reportar bugs no repositório

---

## 🎯 Status do Projeto

### ✅ Implementado

- [x] Next.js 15 com App Router
- [x] Prisma ORM configurado
- [x] Testes E2E com Playwright
- [x] Vercel Analytics & Speed Insights
- [x] Headers de segurança
- [x] Image optimization
- [x] MDX blog system
- [x] TypeScript strict mode

### 🚧 Em Desenvolvimento

- [ ] Sistema de autenticação (NextAuth)
- [ ] CMS admin panel
- [ ] Upload de mídia (Vercel Blob)
- [ ] Sistema de comentários
- [ ] Newsletter integration

### 📅 Roadmap

- [ ] PWA support
- [ ] Dark mode
- [ ] i18n (PT/EN)
- [ ] Search functionality
- [ ] RSS feed

---

**Última Revisão**: 2025-01-16
**Mantenedor**: Gabriel Ramos (dev@gabrielramos.dev)
**Versão do Documento**: 1.0.0

**Deploy com confiança! 🚀**
