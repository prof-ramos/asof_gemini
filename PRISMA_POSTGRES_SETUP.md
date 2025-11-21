# 🚀 Prisma Postgres Setup (Vercel Marketplace)

## ✅ SOLUÇÃO IDEAL: Prisma Postgres

**Por que Prisma Postgres é perfeito para você:**
- ✅ Mesma empresa que fez o Prisma Accelerate (integração perfeita)
- ✅ Instant Serverless Postgres
- ✅ Já está no Marketplace do Vercel
- ✅ Funciona imediatamente com seu setup atual
- ✅ Gratuito para começar

---

## 📋 Setup Step-by-Step (5 minutos)

### 1. Acesse Vercel Marketplace

1. Vá para: https://vercel.com/gabriel-ramos-projects-c71569/asof-gemini
2. Clique em **"Storage"** tab
3. Role até **"Marketplace Database Providers"**
4. Clique em **"Prisma Postgres"**

### 2. Configure Prisma Postgres

1. Clique em **"Add Integration"** ou **"Connect"**
2. Selecione o projeto: **asof-gemini**
3. Região: **Washington, D.C. (iad1)** (mesma do seu app)
4. Nome do database: **asof-production**
5. Clique em **"Create"**

### 3. Copiar Connection Strings

Após criar, o Prisma Postgres fornecerá:

```bash
# Direct connection (para migrations)
DATABASE_URL="postgresql://..."

# Pooled connection (para runtime - opcional se já tem Accelerate)
DATABASE_URL_POOLED="postgresql://..."
```

**Importante:** Como você **já tem Prisma Accelerate**, você vai usar:
- `DATABASE_URL` do Prisma Postgres → para migrations
- `PRISMA_DATABASE_URL` (Accelerate) → para runtime queries

### 4. Atualizar .env.local

Abra `.env.local` e atualize:

```bash
# ============================================================================
# DATABASE CONFIGURATION (Prisma Postgres + Prisma Accelerate)
# ============================================================================

# Direct connection (Prisma Postgres - para migrations)
DATABASE_URL="<cole-aqui-o-DATABASE_URL-do-Prisma-Postgres>"

# Prisma Accelerate (runtime queries - mantém o que você já tem)
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza181ODYxWlBfSy03RkZCOVhjMWlzWGciLCJhcGlfa2V5IjoiMDFLQTVTQkU4RDdYUlBKWkgwVktURDhWUVgiLCJ0ZW5hbnRfaWQiOiI3NTYxZDk4MDUyZThmOWZmNWQxMDM5ODFhODcwMjkwYmYwMmE1NjYzYjZmMjE3MDJlMmRmMjQ3MTdjMzViZDllIiwiaW50ZXJuYWxfc2VjcmV0IjoiZjk2OTUxZDAtMjJkMC00MWZlLWFmNDItY2Q4NGI2Yjc4YjJiIn0.BXvEfu35EByUbw3IYOo4CVYwoce-hQArlIW-LcG5600"

# Alternative name (same as DATABASE_URL)
POSTGRES_URL="<mesmo-valor-do-DATABASE_URL>"
```

### 5. Executar Migrations

```bash
# Push schema para o banco
npx dotenv -e .env.local -- npx prisma db push

# Esperado:
# ✔ Database synchronized with Prisma schema
# ✔ Generated Prisma Client
```

### 6. Seed Database

```bash
npm run db:seed

# Cria:
# - Usuário admin: admin@asof.org.br
# - Senha: Admin123!@#
# - Role: SUPER_ADMIN
```

**⚠️ IMPORTANTE:** Altere a senha após primeiro login!

### 7. Testar Local

```bash
npm run dev
```

Acesse:
- **Login:** http://localhost:3000/login
  - Email: `admin@asof.org.br`
  - Senha: `Admin123!@#`

- **Admin Panel:** http://localhost:3000/admin
  - Dashboard, media library, posts

- **Homepage:** http://localhost:3000

---

## 🎯 Configuração em Produção (Vercel)

### Variáveis de Ambiente Automáticas

Quando você adiciona Prisma Postgres via Marketplace, o Vercel **automaticamente** adiciona as variáveis para todos os ambientes (Production, Preview, Development).

### Variáveis Adicionais Necessárias

Você ainda precisa adicionar manualmente:

1. Acesse: https://vercel.com/gabriel-ramos-projects-c71569/asof-gemini/settings/environment-variables

2. Adicione para **Production**:

```bash
# Prisma Accelerate (runtime)
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza181ODYxWlBfSy03RkZCOVhjMWlzWGciLCJhcGlfa2V5IjoiMDFLQTVTQkU4RDdYUlBKWkgwVktURDhWUVgiLCJ0ZW5hbnRfaWQiOiI3NTYxZDk4MDUyZThmOWZmNWQxMDM5ODFhODcwMjkwYmYwMmE1NjYzYjZmMjE3MDJlMmRmMjQ3MTdjMzViZDllIiwiaW50ZXJuYWxfc2VjcmV0IjoiZjk2OTUxZDAtMjJkMC00MWZlLWFmNDItY2Q4NGI2Yjc4YjJiIn0.BXvEfu35EByUbw3IYOo4CVYwoce-hQArlIW-LcG5600"

# Auth (gere novo secret!)
NEXTAUTH_SECRET="<execute: openssl rand -base64 32>"
NEXTAUTH_URL="https://asof.org.br"

# Email (configure SMTP real)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="contato@asof.org.br"

# Já configurados automaticamente:
# DATABASE_URL - Prisma Postgres (Vercel adiciona)
# BLOB_READ_WRITE_TOKEN - Já tem
# EDGE_CONFIG - Já tem
```

---

## 🆚 Prisma Postgres vs Outras Opções

| Aspecto | Prisma Postgres | Neon | Supabase |
|---------|----------------|------|----------|
| **Setup** | Marketplace Vercel | Manual integration | Manual integration |
| **Integração Prisma** | ⭐ Nativa (mesma empresa) | ✅ Boa | ✅ Boa |
| **Com Accelerate** | ⭐ Perfeito | ✅ Funciona | ✅ Funciona |
| **Free Tier** | ✅ Disponível | 512MB | 500MB |
| **Serverless** | ✅ Sim | ✅ Sim | ⚠️ Managed |
| **Auto-scaling** | ✅ Sim | ✅ Sim | ❌ Não |
| **Setup Time** | 5 min | 10 min | 10 min |

**Recomendação:** Use Prisma Postgres por ser da mesma empresa e integração perfeita.

---

## 🔧 Arquitetura Final

Com Prisma Postgres + Prisma Accelerate, você terá:

```
┌─────────────────────────────────────────────┐
│ Production Architecture                     │
├─────────────────────────────────────────────┤
│                                             │
│  Next.js App (Vercel)                       │
│    ↓                                        │
│  Prisma Client                              │
│    ├─ Queries → Prisma Accelerate           │
│    │            (edge caching + pooling)    │
│    │            ↓                            │
│    └─────────→ Prisma Postgres              │
│                (Serverless PostgreSQL)      │
│                                             │
│  Migrations (Local/CI)                      │
│    ↓ Direct connection                      │
│  Prisma Postgres                            │
│    (DATABASE_URL)                           │
└─────────────────────────────────────────────┘
```

**Vantagens:**
- ✅ **Queries rápidas:** Accelerate com edge caching
- ✅ **Connection pooling:** Accelerate gerencia
- ✅ **Migrations fáceis:** Prisma Postgres direto
- ✅ **Serverless:** Auto-scaling automático
- ✅ **Tudo integrado:** Mesma empresa, sem conflitos

---

## ✅ Checklist de Validação

Após setup, verifique:

- [ ] Migrations executadas: `npx prisma db push` ✅
- [ ] Seed executado: `npm run db:seed` ✅
- [ ] Login funciona: `http://localhost:3000/login` ✅
- [ ] Admin panel acessível: `http://localhost:3000/admin` ✅
- [ ] Media upload funciona ✅
- [ ] Build passa: `npm run build` ✅
- [ ] Tests passam: `npm run test:e2e` ✅

---

## 🚀 Deploy para Produção

```bash
# 1. Verificar que tudo funciona local
npm run dev

# 2. Build
npm run build

# 3. Tests
npm run test:e2e

# 4. Commit e push
git add .
git commit -m "feat: configure Prisma Postgres database"
git push origin main

# 5. Vercel faz deploy automático
# Monitore: https://vercel.com/gabriel-ramos-projects-c71569/asof-gemini
```

---

## 🆘 Troubleshooting

### "Prisma Postgres not found in Marketplace"

**Solução:** Use Neon como alternativa (também serverless Postgres):
1. Marketplace → Neon
2. Add integration
3. Copie DATABASE_URL
4. Continue com os mesmos passos

### "Migrations fail"

```bash
# Verificar env vars carregadas
npx dotenv -e .env.local -- printenv | grep DATABASE

# Force reset (⚠️ apaga dados!)
npx dotenv -e .env.local -- npx prisma db push --force-reset
npm run db:seed
```

### "Can't login to admin"

```bash
# Verificar se seed rodou
npx dotenv -e .env.local -- npx prisma studio
# Deve ver tabela User com admin@asof.org.br

# Re-seed se necessário
npm run db:seed
```

---

## 📊 Alternativas (se Prisma Postgres não disponível)

### Neon (Recomendado #2)

```bash
1. Marketplace → Neon
2. Add integration → asof-gemini
3. Create database
4. Copiar DATABASE_URL
5. Atualizar .env.local
```

### Supabase (Recomendado #3)

```bash
1. Marketplace → Supabase
2. Add integration → asof-gemini
3. Create project
4. Settings → Database → Connection string
5. Atualizar .env.local
```

Todos funcionam perfeitamente com Prisma Accelerate!

---

## 🎯 Próximos Passos

Após database configurado:

1. **Backend formulário de contato** (30 min)
   - Criar `/app/api/contact/route.ts`
   - Configurar SMTP
   - Ver `PRODUCTION_SETUP.md` seção 4

2. **Conteúdo real** (4-8h)
   - Imagens (hero, team, events)
   - 10+ artigos MDX
   - Textos institucionais

3. **Segurança** (15 min)
   - Gerar novo `NEXTAUTH_SECRET`
   - Alterar senha admin
   - Configurar variáveis produção

4. **Deploy final** (30 min)
   - Tests E2E
   - Build
   - Push to main
   - Monitorar deploy

---

**Tempo total estimado:** 5 minutos para database + 5-8h para conteúdo

**Próximo:** Configure Prisma Postgres no Marketplace e me passe o `DATABASE_URL` gerado!
