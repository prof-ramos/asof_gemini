# 🚀 Deploy Rápido - ASOF Website

> **Guia rápido para deploy na Vercel em 5 minutos**

---

## ⚡ Quick Start

### 1. Pré-requisitos (2 min)

```bash
# Clone e instale dependências
git clone https://github.com/prof-ramos/asof_gemini
cd asof_gemini
npm install

# Teste build local
npm run build
```

### 2. Configure Database (2 min)

**Opção A: Vercel Postgres** (Recomendado)
1. Acesse [vercel.com/storage](https://vercel.com/storage)
2. Create Database → Postgres
3. Região: **Washington, D.C. (iad1)**
4. Copie a **Pooled Connection URL**

**Opção B: Supabase** (Tier gratuito)
1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. New Project
3. Copie **Connection Pooling** URL (porta 6543)

### 3. Deploy na Vercel (1 min)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Import Git Repository: `prof-ramos/asof_gemini`
3. Configure Environment Variables:
   ```
   DATABASE_URL = postgresql://...pooler...:5432/...?pgbouncer=true
   ```
4. Click **Deploy**

✅ **Pronto!** Seu site estará no ar em ~2-3 minutos.

---

## 🔐 Variáveis de Ambiente Obrigatórias

Configure no **Vercel Dashboard** → **Settings** → **Environment Variables**:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `DATABASE_URL` | `postgresql://...` | Production, Preview |

**⚠️ IMPORTANTE**: Use URL com `-pooler` para evitar "too many connections"!

### Variáveis Opcionais (para implementação futura)

```bash
# NextAuth (quando implementar autenticação)
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Email (quando implementar notificações)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

---

## 📋 Checklist Pós-Deploy

- [ ] **Teste o site**: Abra a URL de produção
- [ ] **Verifique Analytics**: Dashboard → Analytics
- [ ] **Teste API routes**: `/api/posts`, `/api/categories`
- [ ] **Verifique logs**: Deployments → Functions Logs
- [ ] **Configure domínio customizado** (opcional): Settings → Domains

---

## 🐛 Problemas Comuns

### "Prisma Client is not generated"

**Solução**: Clear build cache e redeploy
```bash
# Vercel Dashboard
Settings → General → Clear Build Cache

# Force redeploy
git commit --allow-empty -m "Rebuild"
git push
```

### "Can't reach database server"

**Solução**: Verifique connection string
```bash
# ✅ Correto (com pooling)
postgresql://user:pass@db-pooler.region.vercel-storage.com:5432/db?pgbouncer=true

# ❌ Errado (direto, sem pooling)
postgresql://user:pass@db.region.vercel-storage.com:5432/db
```

### "Too many connections"

**Solução**: Use pooled connection URL
- Vercel Postgres: Use URL com `-pooler`
- Supabase: Use porta `6543` (Supavisor)
- Neon: Use "Pooled connection" string

---

## 🎯 URLs Importantes

- **Documentação Completa**: `/docs/deployment-guide.md`
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Prisma Docs**: [prisma.io/docs/guides/deployment](https://www.prisma.io/docs/guides/deployment/serverless/deploy-to-vercel)
- **Next.js Docs**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

## 🚀 Deploy Automático

Configurado para:
- **main branch** → Deploy de produção automático
- **Pull Requests** → Preview deployments automáticos
- **GitHub Actions** → Testes E2E antes do deploy

```
git push origin main
  ↓
Testes E2E executam
  ↓ (se passar)
Deploy automático
  ↓
Live em: https://asof-gemini.vercel.app
```

---

## 📊 Monitoramento

**Já configurado automaticamente**:
- ✅ Vercel Analytics (page views, visitors)
- ✅ Speed Insights (Core Web Vitals)
- ✅ Function logs (erros de API)
- ✅ Build logs (erros de build)

Acesse via **Vercel Dashboard** → **Analytics** / **Speed Insights**

---

## 📞 Precisa de Ajuda?

1. **Documentação completa**: `/docs/deployment-guide.md`
2. **Troubleshooting**: Seção completa no guia
3. **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

**Status**: ✅ Pronto para deploy
**Stack**: Next.js 15 + Prisma + PostgreSQL
**Última atualização**: 2025-01-16
