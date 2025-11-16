# Prisma Database Setup

## 📋 Quick Start

### 1. Instalar Dependências

```bash
npm install
```

As dependências do Prisma serão instaladas automaticamente via `postinstall`.

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar .env.example para .env
cp .env.example .env

# Editar .env e configurar DATABASE_URL
nano .env
```

**Database URL Format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

### 3. Iniciar Banco de Dados (Docker - Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d

# Verificar se está rodando
docker-compose ps
```

### 4. Executar Migrations

```bash
# Criar e aplicar migrations
npm run db:migrate

# Ou apenas aplicar (produção)
npm run db:migrate:deploy
```

### 5. Popular com Dados Iniciais

```bash
npm run db:seed
```

### 6. Abrir Prisma Studio (GUI)

```bash
npm run db:studio
# Abre em http://localhost:5555
```

## 🛠️ Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run db:generate` | Gerar Prisma Client |
| `npm run db:migrate` | Criar e aplicar migration (dev) |
| `npm run db:migrate:deploy` | Aplicar migrations (prod) |
| `npm run db:seed` | Popular banco com dados iniciais |
| `npm run db:studio` | Abrir Prisma Studio (GUI) |
| `npm run db:reset` | Resetar banco (⚠️ apaga tudo!) |
| `npm run db:push` | Push schema sem migrations |
| `npm run db:pull` | Pull schema do banco (introspection) |

## 📊 Schema Overview

O schema inclui as seguintes entidades principais:

- **User**: Usuários e autenticação
- **Post**: Notícias e artigos
- **Page**: Páginas estáticas
- **Category**: Categorias hierárquicas
- **Tag**: Tags para classificação
- **Media**: Biblioteca de mídia
- **Comment**: Sistema de comentários
- **Document**: Documentos para transparência
- **Setting**: Configurações do sistema
- **AuditLog**: Log de auditoria
- **Navigation**: Menus de navegação

## 🔐 Credenciais Padrão (após seed)

**Admin:**
- Email: admin@asof.org.br
- Senha: senha123

**Editor:**
- Email: editor@asof.org.br
- Senha: senha123

⚠️ **IMPORTANTE**: Altere as senhas em produção!

## 📚 Documentação

- **Schema Completo**: `/docs/database-schema.md`
- **Performance**: `/docs/database-performance.md`
- **Implementação**: `/docs/database-implementation.md`

## 🐛 Troubleshooting

### Connection Error

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps

# Ver logs
docker-compose logs postgres

# Reiniciar
docker-compose restart postgres
```

### Migration Error

```bash
# Verificar status
npx prisma migrate status

# Resetar migrations (⚠️ apaga dados!)
npm run db:reset

# Recriar do zero
npx prisma migrate dev --name init
```

### Client Not Generated

```bash
# Gerar manualmente
npm run db:generate

# Limpar e reinstalar
rm -rf node_modules/.prisma
npm install
```

## 🚀 Produção

### Deploy Checklist

- [ ] Database provisionado (Vercel Postgres, Supabase, Neon, etc.)
- [ ] `DATABASE_URL` configurado nas env vars
- [ ] Migrations aplicadas com `db:migrate:deploy`
- [ ] Seed executado (se necessário)
- [ ] Connection pooling configurado
- [ ] Backups automáticos habilitados

### Providers Recomendados

- **Vercel Postgres**: Integração nativa com Vercel
- **Supabase**: PostgreSQL managed + Auth + Storage
- **Neon**: PostgreSQL serverless com branching
- **Railway**: PostgreSQL + Redis fácil

## 🔄 Workflow de Desenvolvimento

1. **Modificar Schema**: Editar `prisma/schema.prisma`
2. **Criar Migration**: `npm run db:migrate`
3. **Aplicar Migration**: Automático no passo 2
4. **Atualizar Seed** (se necessário): Editar `prisma/seed.ts`
5. **Testar**: `npm run db:studio`

## 📖 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js + Prisma Best Practices](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
