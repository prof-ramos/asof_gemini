# Setup do Painel Admin ASOF

Este documento descreve como configurar o painel administrativo com Vercel Blob e autenticação.

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (Prisma)
- Conta Vercel (para Blob e Edge Config)

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Database URLs
DATABASE_URL="sua-connection-string-postgres"
POSTGRES_URL="sua-connection-string-postgres"
PRISMA_DATABASE_URL="sua-prisma-accelerate-url"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="seu-token-vercel-blob"

# Edge Config (opcional, para produção)
EDGE_CONFIG="seu-edge-config-url"

# Auth Secret (gerar com: openssl rand -base64 32)
AUTH_SECRET="sua-chave-secreta-gerada"

# Environment
NODE_ENV="development"
```

### 2. Gerar Auth Secret

```bash
openssl rand -base64 32
```

Copie o resultado e cole em `AUTH_SECRET` no arquivo `.env`.

### 3. Configurar Banco de Dados

```bash
# Gerar Prisma Client
npm run db:generate

# Aplicar migrations
npm run db:migrate

# Popular com dados iniciais (criar usuário admin)
npm run db:seed
```

### 4. Criar Usuário Admin Inicial

Edite o arquivo `prisma/seed.ts` e adicione:

```typescript
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Criar usuário admin
  const passwordHash = await hash('admin123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@asof.org.br',
      name: 'Administrador',
      password: passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Usuário admin criado:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Depois execute:

```bash
npm run db:seed
```

### 5. Configurar Vercel Blob (Produção)

1. Acesse https://vercel.com/dashboard
2. Vá em seu projeto > Storage > Create Database > Blob
3. Copie o `BLOB_READ_WRITE_TOKEN`
4. Adicione ao arquivo `.env` e às variáveis de ambiente na Vercel

### 6. Configurar Edge Config (Opcional - Produção)

Para autenticação em produção com Edge Config:

1. Acesse https://vercel.com/dashboard
2. Vá em seu projeto > Storage > Edge Config
3. Crie um novo Edge Config
4. Adicione as seguintes chaves:

```json
{
  "admin_users": [
    {
      "email": "admin@asof.org.br",
      "passwordHash": "hash-sha256-da-senha",
      "name": "Administrador",
      "role": "ADMIN"
    }
  ],
  "admin_tokens": []
}
```

**Gerar password hash:**

```bash
echo -n "sua-senha" | shasum -a 256
```

5. Copie a URL do Edge Config e adicione à variável `EDGE_CONFIG`

## 🚀 Rodando o Projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse:
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin
- Login: http://localhost:3000/login

### Credenciais Padrão (Desenvolvimento)

```
Email: admin@asof.org.br
Senha: admin123
```

**⚠️ IMPORTANTE: Altere essas credenciais em produção!**

## 📁 Estrutura de Arquivos

```
app/
├── admin/
│   ├── layout.tsx          # Layout do admin
│   ├── page.tsx            # Dashboard
│   └── media/
│       └── page.tsx        # Gerenciamento de mídia
├── login/
│   └── page.tsx            # Página de login
└── api/
    ├── auth/
    │   ├── login/route.ts  # Login
    │   └── logout/route.ts # Logout
    └── media/
        ├── route.ts        # GET (listar)
        ├── upload/route.ts # POST (upload)
        └── [id]/route.ts   # GET, PATCH, DELETE

components/admin/
├── AdminHeader.tsx         # Header com logout
├── MediaUpload.tsx         # Upload de arquivos
├── MediaGrid.tsx           # Listagem em grid
├── MediaFilters.tsx        # Filtros e busca
└── MediaPreview.tsx        # Modal de preview/edição

middleware.ts               # Proteção de rotas
```

## 🔒 Segurança

### Autenticação

- Middleware protege todas as rotas `/admin/*`
- Cookies HttpOnly para tokens de autenticação
- Tokens validados via Edge Config em produção
- Sessões expiram após 7 dias

### Upload de Arquivos

- Tamanho máximo: 50MB
- Tipos permitidos:
  - Imagens: JPG, PNG, GIF, WebP, SVG
  - Vídeos: MP4, WebM, QuickTime
  - Documentos: PDF, DOC, DOCX
  - Áudio: MP3, WAV, OGG
- Geração automática de thumbnails para imagens

### Banco de Dados

- Soft delete (arquivos não são removidos imediatamente)
- Audit logs para todas as ações
- Relacionamento com usuários (quem fez upload)

## 📝 API Routes

### POST `/api/auth/login`

Login de usuário admin.

**Body:**
```json
{
  "email": "admin@asof.org.br",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "email": "admin@asof.org.br",
    "name": "Administrador",
    "role": "ADMIN"
  }
}
```

### POST `/api/auth/logout`

Logout (limpa cookie).

### POST `/api/media/upload`

Upload de arquivo para Vercel Blob.

**Body:** FormData com campo `file`

**Response:**
```json
{
  "success": true,
  "media": {
    "id": "...",
    "url": "https://...",
    "fileName": "...",
    "type": "IMAGE",
    "size": 12345
  }
}
```

### GET `/api/media`

Listar arquivos de mídia.

**Query params:**
- `type`: IMAGE | VIDEO | DOCUMENT | AUDIO | OTHER
- `search`: busca por nome
- `limit`: número de resultados (padrão: 50)
- `offset`: paginação
- `sort`: newest | oldest | name-asc | name-desc | size-asc | size-desc

**Response:**
```json
{
  "success": true,
  "items": [...],
  "total": 100,
  "stats": {
    "IMAGE": 50,
    "VIDEO": 20,
    "DOCUMENT": 30
  }
}
```

### GET `/api/media/[id]`

Buscar arquivo específico.

### PATCH `/api/media/[id]`

Atualizar metadados (alt, caption, title, description).

**Body:**
```json
{
  "alt": "Descrição da imagem",
  "title": "Título",
  "caption": "Legenda",
  "description": "Descrição completa"
}
```

### DELETE `/api/media/[id]`

Deletar arquivo (soft delete no banco + remoção do Vercel Blob).

## 🎨 Features Implementadas

- ✅ Autenticação com Edge Config
- ✅ Upload para Vercel Blob
- ✅ Geração automática de thumbnails
- ✅ Drag & drop para upload
- ✅ Filtros e busca
- ✅ Grid responsivo
- ✅ Modal de preview/edição
- ✅ Metadados (alt, title, caption, description)
- ✅ Soft delete
- ✅ Estatísticas por tipo
- ✅ Download de arquivos
- ✅ Copiar URL

## 🔜 Próximos Passos

- [ ] Sistema de pastas/categorias para mídia
- [ ] Edição de imagens (crop, resize)
- [ ] Múltiplos uploads simultâneos
- [ ] Progresso de upload em tempo real
- [ ] Gerenciamento de usuários
- [ ] Criação/edição de posts via admin
- [ ] Configurações do sistema

## 🐛 Troubleshooting

### Erro: "Não autorizado"

- Verifique se o cookie `admin-auth-token` está presente
- Faça login novamente em `/login`

### Erro ao fazer upload

- Verifique o token `BLOB_READ_WRITE_TOKEN`
- Verifique se o arquivo não excede 50MB
- Verifique se o tipo de arquivo é permitido

### Erro ao conectar ao banco

- Verifique a `DATABASE_URL`
- Execute `npm run db:generate`
- Execute `npm run db:migrate`

## 📞 Suporte

Em caso de problemas, entre em contato com a equipe de desenvolvimento.

---

**Última atualização**: 16 de Novembro, 2024
