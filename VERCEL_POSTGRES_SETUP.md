# 🚨 Database Connection Issue - Solution with Vercel Postgres

## ⚠️ Problem Detected

**Error:** `Can't reach database server at db.prisma.io:5432`

The Prisma Data Platform database is **not accessible**. This is blocking deployment.

---

## ✅ SOLUTION: Use Vercel Postgres Instead

Vercel Postgres is **native, fast, and FREE** (up to 256MB). Perfect for this project.

### Step-by-Step Setup (5 minutes)

#### 1. Create Vercel Postgres Database

**Via Vercel Dashboard:**

1. Go to: https://vercel.com/gabriel-ramos-projects-c71569/asof-gemini
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Name: `asof-production`
6. Region: `Washington, D.C., USA (iad1)` (same as your app)
7. Click **"Create"**

**Via Vercel CLI (alternative):**

```bash
vercel env pull .env.local
```

This will automatically pull all environment variables including the new database.

#### 2. Copy Environment Variables

After creating the database, Vercel shows these variables:

```bash
POSTGRES_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NO_SSL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb?sslmode=disable"
POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
POSTGRES_USER="default"
POSTGRES_HOST="xxx.postgres.vercel-storage.com"
POSTGRES_PASSWORD="xxx"
POSTGRES_DATABASE="verceldb"
```

#### 3. Update .env.local

Replace the DATABASE_URL lines in `.env.local`:

```bash
# OLD (not working)
# DATABASE_URL="postgres://7561d98052e8f9ff5d103981a870290bf02a5663b6f21702e2df24717c35bd9e:sk_5861ZP_K-7FFB9Xc1isXg@db.prisma.io:5432/postgres?sslmode=require"
# POSTGRES_URL="postgres://7561d98052e8f9ff5d103981a870290bf02a5663b6f21702e2df24717c35bd9e:sk_5861ZP_K-7FFB9Xc1isXg@db.prisma.io:5432/postgres?sslmode=require"

# NEW (from Vercel Postgres)
DATABASE_URL="<POSTGRES_URL_NON_POOLING from Vercel>"
PRISMA_DATABASE_URL="<POSTGRES_PRISMA_URL from Vercel>"
POSTGRES_URL="<POSTGRES_URL from Vercel>"
```

**Important:** Use:
- `POSTGRES_PRISMA_URL` → for `PRISMA_DATABASE_URL` (runtime queries with pooling)
- `POSTGRES_URL_NON_POOLING` → for `DATABASE_URL` (migrations, direct connection)

#### 4. Run Migrations

```bash
npx dotenv -e .env.local -- npx prisma db push
```

Expected output:
```
✔ Database synchronized with Prisma schema
✔ Generated Prisma Client
```

#### 5. Seed Database

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@asof.org.br`
- Password: `Admin123!@#`
- Role: `SUPER_ADMIN`

**⚠️ CHANGE PASSWORD AFTER FIRST LOGIN!**

#### 6. Test Local Connection

```bash
npm run dev
```

Then visit:
- http://localhost:3000 - Homepage
- http://localhost:3000/login - Admin login
- http://localhost:3000/admin - Admin panel

Login with:
```
Email: admin@asof.org.br
Password: Admin123!@#
```

#### 7. Configure Vercel Environment Variables (Production)

Go to: https://vercel.com/gabriel-ramos-projects-c71569/asof-gemini/settings/environment-variables

Add these for **Production**:

```bash
DATABASE_URL="<POSTGRES_URL_NON_POOLING>"
PRISMA_DATABASE_URL="<POSTGRES_PRISMA_URL>"
POSTGRES_URL="<POSTGRES_URL>"

# Auth
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="https://asof.org.br"

# Email (configure real SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="contato@asof.org.br"

# Already configured
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_Txdg6ABJyRg8qkD4_0qsZkHIoIPHgKYMOKc7QeXQcY0tbYj"
EDGE_CONFIG="https://edge-config.vercel.com/ecfg_0xdpeutvkcnk7gsfy95yg4p8xcsd?token=..."
```

**Note:** Vercel automatically adds POSTGRES_* variables when you create the database. You just need to add the custom ones (NEXTAUTH_*, SMTP_*).

---

## 🎯 Why Vercel Postgres?

### Advantages:

✅ **Native Integration** - Automatically configured with your Vercel project
✅ **Connection Pooling** - Built-in PgBouncer for serverless
✅ **Free Tier** - 256MB database, 60 hours compute/month
✅ **Fast** - Same region as your app (iad1)
✅ **Reliable** - Enterprise-grade PostgreSQL
✅ **Easy Backups** - Point-in-time recovery
✅ **Dashboard** - SQL Editor, table browser, metrics

### vs Prisma Data Platform:

❌ Prisma Data Platform (`db.prisma.io`) - Not accessible
✅ Vercel Postgres - Works out of the box

### vs Supabase:

Both are good! Vercel Postgres is simpler for Vercel deployments.

---

## 📋 Next Steps After Database Setup

### 1. Test Everything Works

```bash
# 1. Push schema
npx dotenv -e .env.local -- npx prisma db push

# 2. Seed database
npm run db:seed

# 3. Start dev server
npm run dev

# 4. Test login
# Visit: http://localhost:3000/login
# Use: admin@asof.org.br / Admin123!@#

# 5. Test admin panel
# Visit: http://localhost:3000/admin
```

### 2. Implement Contact Form Backend

See `PRODUCTION_SETUP.md` section 4 for complete code.

**Quick version:**

Create `/app/api/contact/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  const { name, email, phone, subject, message } = await request.json()

  // Validate
  if (!name || !email || !message || !subject) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Send email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: 'contato@asof.org.br',
    subject: `[ASOF] ${subject} - ${name}`,
    html: `
      <h2>Nova mensagem do site</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${message}</p>
    `,
  })

  return NextResponse.json({ success: true })
}
```

Install nodemailer:
```bash
npm install nodemailer
npm install -D @types/node
```

Update `app/contato/ContactForm.tsx`:

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } else {
      setSubmitStatus('error')
    }
  } catch {
    setSubmitStatus('error')
  } finally {
    setIsSubmitting(false)
  }
}
```

### 3. Add Real Content

- **Images:** `/public/images/` needs hero images, team photos, event photos
- **Articles:** Add 3+ more MDX articles to `/content/noticias/`
- **Text:** Update placeholder text in pages (sobre, membros, etc.)

### 4. Security Checklist

```bash
# 1. Generate new secret
openssl rand -base64 32

# 2. Update .env.local
NEXTAUTH_SECRET="<new-value>"

# 3. Add to Vercel production
# Via dashboard or CLI:
vercel env add NEXTAUTH_SECRET production
```

### 5. Deploy

```bash
# 1. Test build
npm run build

# 2. Test E2E
npm run test:e2e

# 3. Commit changes
git add .
git commit -m "feat: configure Vercel Postgres database"
git push

# 4. Deploy (automatic on push to main)
# Or manual:
vercel --prod
```

---

## 🆘 Troubleshooting

### "prisma db push" fails

```bash
# Check environment variables are loaded
npx dotenv -e .env.local -- printenv | grep POSTGRES

# Should show your Vercel Postgres URLs
```

### Database shows empty in Vercel Dashboard

```bash
# Run migrations again
npx dotenv -e .env.local -- npx prisma db push --force-reset
npm run db:seed
```

### Can't login to admin panel

1. Check database has User table: `npx prisma studio`
2. Verify seed ran: Should see admin user
3. Check password hash is bcrypt
4. Try resetting:
   ```bash
   npm run db:reset
   npm run db:seed
   ```

### Build fails on Vercel

1. Check environment variables are set in Vercel dashboard
2. Verify `DATABASE_URL` and `PRISMA_DATABASE_URL` are present
3. Check build logs for specific error
4. Ensure `buildCommand` in vercel.json includes `prisma generate`

---

## 📊 Vercel Postgres Free Tier Limits

- **Database Size:** 256 MB
- **Compute:** 60 hours/month
- **Data Transfer:** 256 MB/month
- **Max Connections:** 60 (with pooling)

**For this project:** More than enough for initial launch. Upgrade to Pro ($20/month) for:
- 512 MB storage
- Unlimited compute
- Better support

---

## ✅ Summary

**Old setup (not working):**
```
Prisma Data Platform (db.prisma.io) → ❌ Not accessible
```

**New setup (recommended):**
```
Vercel Postgres → ✅ Native, fast, reliable
```

**Time to setup:** 5-10 minutes
**Cost:** Free (256MB tier)
**Benefits:** Native Vercel integration, automatic pooling, easy management

---

**Next:** Follow steps above to create Vercel Postgres database and update `.env.local`
