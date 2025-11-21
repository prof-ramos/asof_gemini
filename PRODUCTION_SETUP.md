# 🚀 ASOF - Guia de Configuração para Produção

**Status:** Em progresso - Database connection pendente
**Última atualização:** 19/11/2025

---

## ✅ O Que Já Foi Configurado

### 1. Variáveis de Ambiente
- ✅ Arquivo `.env.local` criado com todas as credenciais
- ✅ `.gitignore` protegendo arquivos sensíveis
- ✅ Variáveis configuradas:
  - `DATABASE_URL` - PostgreSQL via Prisma
  - `PRISMA_DATABASE_URL` - Prisma Accelerate
  - `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage
  - `EDGE_CONFIG` - Vercel Edge Config
  - `NEXTAUTH_SECRET` - Auth JWT signing
  - SMTP (pendente configuração real)

### 2. Schema do Banco de Dados
- ✅ `prisma/schema.prisma` atualizado para PostgreSQL
- ✅ Prisma Client gerado (v6.19.0)
- ✅ Schema completo com 20+ modelos:
  - User, Session, Media, Post, Category, Tag
  - AuditLog, Page, Comment, Document, Setting
  - E mais...

### 3. Dependências
- ✅ Todas as dependências instaladas (`npm install`)
- ✅ Prisma CLI funcionando
- ✅ Build scripts configurados

---

## 🚨 BLOQUEADOR: Conexão com Database

### Problema Atual

**Erro:** `Can't reach database server at db.prisma.io:5432`

O banco de dados PostgreSQL do Prisma Data Platform **não está acessível**. Isso é um bloqueador crítico.

### ✅ SOLUÇÃO: Prisma Postgres (RECOMENDADO) ⭐

**📄 Guia completo:** Ver `PRISMA_POSTGRES_SETUP.md` para instruções detalhadas passo a passo.

**Por que Prisma Postgres é ideal:**
- ⭐ Mesma empresa que faz Prisma Accelerate (integração perfeita)
- ✅ Instant Serverless Postgres
- ✅ Disponível no Vercel Marketplace
- ✅ Setup em 5 minutos

**Quick Start (5 minutos):**

1. **Acesse Vercel Marketplace:**
   - Vá para: https://vercel.com/gabriel-ramos-projects-c71569/asof-gemini
   - Storage → Marketplace Database Providers
   - Clique em **"Prisma Postgres"**

2. **Configure:**
   - Add Integration → Selecione projeto asof-gemini
   - Região: Washington, D.C. (iad1)
   - Nome: asof-production

3. **Copie DATABASE_URL gerado**

4. **Atualize .env.local:**
   ```bash
   DATABASE_URL="<Prisma Postgres DATABASE_URL>"
   PRISMA_DATABASE_URL="<mantém seu Accelerate URL>"
   ```

5. **Execute migrations:**
   ```bash
   npx dotenv -e .env.local -- npx prisma db push
   npm run db:seed
   ```

**Vantagens:**
- ⭐ Integração perfeita com Prisma Accelerate
- ✅ Serverless com auto-scaling
- ✅ Connection pooling automático
- ✅ Mesma região do app (iad1)
- ✅ Setup via Marketplace (simples)

**Alternativas:** Neon ou Supabase (também no Marketplace)

#### Opção 2: Supabase (Alternativa gratuita)

1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Em Settings → Database, copie a "Connection string"
4. Formato: `postgresql://postgres:password@db.project.supabase.co:5432/postgres`

#### Opção 3: Neon.tech (Serverless Postgres)

1. Acesse [neon.tech](https://neon.tech)
2. Crie novo projeto
3. Copie a connection string
4. Formato: `postgresql://user:pass@host.region.neon.tech/db`

---

## 📋 Próximos Passos (APÓS resolver database)

### 1. Executar Migrations

```bash
# Criar estrutura do banco
npx dotenv -e .env.local -- npx prisma db push

# OU criar migration formal
npx dotenv -e .env.local -- npx prisma migrate dev --name init
```

### 2. Popular Banco com Seed

```bash
# Criar usuário admin inicial
npm run db:seed

# Credenciais padrão:
# Email: admin@asof.org.br
# Senha: Admin123!@#
# Role: SUPER_ADMIN
```

**⚠️ IMPORTANTE:** Altere a senha do admin após primeiro login!

### 3. Configurar SMTP Real

Atualmente o formulário de contato apenas simula envio. Configure SMTP:

**Gmail (exemplo):**
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-app-password"  # NÃO use senha normal!
SMTP_FROM="contato@asof.org.br"
```

Para criar App Password no Gmail:
1. Ative 2FA na conta Google
2. Acesse: https://myaccount.google.com/apppasswords
3. Gere senha para "Mail"
4. Use essa senha no SMTP_PASS

**SendGrid (produção recomendado):**
```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.xxxxx"  # API Key do SendGrid
```

### 4. Implementar Backend do Formulário de Contato

Criar arquivo: `/app/api/contact/route.ts`

```typescript
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validação
    if (!name || !email || !message || !subject) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Configurar transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Enviar email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL || 'contato@asof.org.br',
      subject: `[ASOF Site] ${subject} - ${name}`,
      html: `
        <h2>Nova mensagem do site ASOF</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}
```

Depois atualizar `app/contato/ContactForm.tsx`:

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } else {
      setSubmitStatus('error')
    }
  } catch (error) {
    setSubmitStatus('error')
  } finally {
    setIsSubmitting(false)
  }
}
```

### 5. Adicionar Conteúdo Real

#### Imagens necessárias:
- `/public/images/hero-home.jpg` - Hero da homepage
- `/public/images/about-team.jpg` - Foto da equipe
- `/public/images/logo-asof.png` - Logo em alta resolução
- `/public/images/events/` - Fotos de eventos
- `/public/images/convenios/` - Logos de parceiros

#### Artigos MDX:
Criar arquivos em `/content/noticias/`:
- Mínimo 10 artigos para um blog convincente
- Fotos reais dos eventos
- Textos institucionais autênticos

#### Páginas estáticas:
Revisar textos placeholder em:
- `/app/sobre/page.tsx` - História e missão
- `/app/membros/page.tsx` - Diretoria atual
- `/app/convenios/page.tsx` - Parceiros reais
- `/app/transparencia/page.tsx` - Documentos reais

### 6. Implementar Rate Limiting

Proteger endpoints contra abuse:

```bash
# Instalar
npm install @upstash/ratelimit @upstash/redis
```

Criar `/lib/rate-limit.ts`:
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests por minuto
})
```

Aplicar em `/app/api/auth/login/route.ts` e `/app/api/contact/route.ts`.

### 7. Melhorar Middleware Performance

**Problema:** `middleware.ts` faz query ao Prisma em TODA requisição.

**Solução:** Implementar cache com Vercel KV:

```typescript
import { kv } from '@vercel/kv'

// Cache de sessões válidas por 5 minutos
const cached = await kv.get(`session:${authToken}`)
if (cached) return NextResponse.next()

// Se não cached, verificar no banco
const session = await prisma.session.findUnique(...)
if (session?.valid) {
  await kv.set(`session:${authToken}`, true, { ex: 300 })
}
```

### 8. Testes E2E Completos

Criar testes para páginas faltantes:

```bash
# Criar arquivos:
e2e/tests/static/sobre.spec.ts
e2e/tests/static/atuacao.spec.ts
e2e/tests/static/transparencia.spec.ts
e2e/tests/admin/posts.spec.ts
e2e/tests/admin/media.spec.ts

# Rodar todos os testes
npm run test:e2e

# Gerar relatório
npm run test:report
```

### 9. SEO Completo

- [ ] Structured Data (JSON-LD) para artigos
- [ ] Meta descriptions únicas (remover placeholders)
- [ ] Alt text descritivos em todas as imagens
- [ ] Sitemap.xml validado no Google Search Console
- [ ] robots.txt validado

### 10. Deploy Final

#### Pré-deploy checklist:

```bash
# 1. Build local
npm run build

# 2. Testes
npm run test:e2e

# 3. Lint
npm run lint

# 4. Verificar bundle size
npm run analyze
```

#### Configurar no Vercel:

1. **Environment Variables** (Production):
   - DATABASE_URL (do Vercel Postgres/Supabase)
   - NEXTAUTH_SECRET (novo, não use o de dev!)
   - NEXTAUTH_URL (https://asof.org.br)
   - SMTP_* (configurações reais)
   - BLOB_READ_WRITE_TOKEN (já configurado)

2. **Build Settings**:
   - Build Command: `prisma generate && npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Domains**:
   - Adicionar domínio customizado: `asof.org.br`
   - Configurar DNS (CNAME ou A record)

4. **Deploy**:
```bash
git add .
git commit -m "feat: production setup complete"
git push origin main
```

---

## 🔒 Segurança - CRÍTICO

### Antes do Launch:

1. **Alterar NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Use esse valor em produção!

2. **Alterar senha do admin:**
   - Login: admin@asof.org.br
   - Senha padrão: Admin123!@#
   - **MUDAR IMEDIATAMENTE** após primeiro acesso!

3. **Revisar permissões:**
   - Verificar roles de todos os usuários
   - Configurar auditoria de ações sensíveis

4. **Headers de segurança:**
   - ✅ Já configurados em `vercel.json`
   - Validar em: https://securityheaders.com

5. **HTTPS forçado:**
   - Vercel força automaticamente
   - Verificar HSTS headers

---

## 📊 Monitoramento Pós-Deploy

### Validar após deploy:

- [ ] Vercel Analytics capturando dados
- [ ] Speed Insights mostrando Web Vitals
- [ ] Error tracking funcionando
- [ ] Database queries otimizadas (< 100ms)
- [ ] Todos os forms funcionando (contato, login)
- [ ] Upload de mídia funcionando
- [ ] Blog carregando corretamente
- [ ] Testes E2E passando em CI/CD

### Ferramentas recomendadas:

- **Uptime Monitoring:** Better Uptime ou UptimeRobot
- **Error Tracking:** Sentry
- **Performance:** Vercel Analytics + Speed Insights (já configurado)
- **SEO:** Google Search Console

---

## 🆘 Troubleshooting

### Database não conecta

```bash
# Testar conexão
npx dotenv -e .env.local -- npx prisma db push

# Se falhar, verificar:
1. DATABASE_URL está correto?
2. Banco está rodando?
3. Credenciais válidas?
4. Firewall/VPN bloqueando?
```

### Build falha no Vercel

```bash
# Verificar localmente primeiro
npm run build

# Se passar local mas falhar no Vercel:
1. Verificar environment variables
2. Verificar se DATABASE_URL está setada
3. Verificar logs de build no Vercel dashboard
```

### Middleware muito lento

```bash
# Implementar cache com Vercel KV
# Ver seção "Melhorar Middleware Performance" acima
```

### Emails não enviam

```bash
# Testar SMTP manualmente
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: 'email', pass: 'password' }
});
transporter.sendMail({
  from: 'test@test.com',
  to: 'dest@test.com',
  subject: 'Test',
  text: 'Test'
}, console.log);
"
```

---

## 📞 Suporte

**Documentação completa:**
- `/CLAUDE.md` - Guia para desenvolvimento
- `/.claude/CLAUDE.md` - Guia detalhado (1000+ linhas)
- `/docs/` - Documentação técnica

**Contato:**
- Email: dev@gabrielramos.dev
- Projeto: ASOF - Associação dos Oficiais de Chancelaria

---

**Próximo passo:** Resolver conexão com database (ver seção "Soluções Possíveis" acima)
