# 🚀 Guia de Setup - Painel Admin ASOF

## ✅ Pré-requisitos

- Node.js 18+ instalado
- Git instalado
- Credenciais do banco de dados Prisma (já fornecidas)

---

## 📋 Passo a Passo

### **1. Clonar o repositório (se ainda não fez)**

```bash
git clone https://github.com/prof-ramos/asof_gemini.git
cd asof_gemini
git checkout claude/cms-news-management-013uKr2BQm54X1oLUDrkXJcN
```

### **2. Instalar dependências**

```bash
npm install
```

### **3. Configurar variáveis de ambiente**

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Copiar do exemplo
cp .env.example .env.local
```

Edite `.env.local` e adicione:

```env
# ============================================================================
# DATABASE (Prisma Accelerate)
# ============================================================================
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza181ODYxWlBfSy03RkZCOVhjMWlzWGciLCJhcGlfa2V5IjoiMDFLQTVTQkU4RDdYUlBKWkgwVktURDhWUVgiLCJ0ZW5hbnRfaWQiOiI3NTYxZDk4MDUyZThmOWZmNWQxMDM5ODFhODcwMjkwYmYwMmE1NjYzYjZmMjE3MDJlMmRmMjQ3MTdjMzViZDllIiwiaW50ZXJuYWxfc2VjcmV0IjoiZjk2OTUxZDAtMjJkMC00MWZlLWFmNDItY2Q4NGI2Yjc4YjJiIn0.BXvEfu35EByUbw3IYOo4CVYwoce-hQArlIW-LcG5600"

# URL direta (fallback)
POSTGRES_URL="postgres://7561d98052e8f9ff5d103981a870290bf02a5663b6f21702e2df24717c35bd9e:sk_5861ZP_K-7FFB9Xc1isXg@db.prisma.io:5432/postgres?sslmode=require"

# ============================================================================
# BLOB STORAGE (Vercel Blob - para upload de imagens)
# ============================================================================
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_Txdg6ABJyRg8qkD4_0qsZkHIoIPHgKYMOKc7QeXQcY0tbYj"

# ============================================================================
# AUTH (NextAuth)
# ============================================================================
NEXTAUTH_SECRET="asof-cms-2024-production-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# ============================================================================
# AMBIENTE
# ============================================================================
NODE_ENV=development
NEXT_PUBLIC_VERCEL_ENV=development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS=false
```

### **4. Verificar conexão com banco**

```bash
npm run db:check
```

**Saída esperada:**
```
✅ admin@asof.org.br - SUPER_ADMIN - ACTIVE
✅ editor@asof.org.br - ADMIN - ACTIVE
✅ autor@asof.org.br - AUTHOR - ACTIVE
```

### **5. (Opcional) Popular banco se vazio**

Se o comando acima mostrar "Nenhum usuário encontrado":

```bash
# Aplicar schema ao banco
npm run db:push

# Popular com dados iniciais
npm run db:seed
```

### **6. Iniciar servidor de desenvolvimento**

```bash
npm run dev
```

Aguarde a mensagem:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

---

## 🎯 Acessar o Admin

### **1. Abra o navegador**

```
http://localhost:3000/admin
```

Você será redirecionado para a tela de login.

### **2. Fazer login**

Use uma das credenciais:

**Super Admin:**
```
Email: admin@asof.org.br
Senha: senha123
```

**Admin/Editor:**
```
Email: editor@asof.org.br
Senha: senha123
```

**Autor:**
```
Email: autor@asof.org.br
Senha: senha123
```

### **3. Após login bem-sucedido**

Você será redirecionado para `/admin` com acesso ao painel completo:

- ✅ Dashboard com estatísticas
- ✅ Biblioteca de Mídia
- ✅ **Gestão de Notícias** (novo!)
- ✅ Usuários
- ✅ Configurações

---

## 📝 Testar Gestão de Notícias

### **Acessar listagem**

```
http://localhost:3000/admin/posts
```

Você verá:
- Estatísticas por status (Rascunhos, Em Revisão, Publicadas, Agendadas)
- Tabela com todos os posts
- Barra de busca e filtros
- Paginação

### **Criar nova notícia**

1. Clique em **"Nova Notícia"**
2. Preencha:
   - **Título** (slug é gerado automaticamente)
   - **Resumo** (opcional)
   - **Conteúdo** (em Markdown)
   - **Categoria** (selecione uma)
   - **Tags** (clique para selecionar)
   - **Imagem Destacada** (opcional - requer integração)
3. Escolha uma ação:
   - **Salvar Rascunho** → Status: DRAFT
   - **Enviar para Revisão** → Status: IN_REVIEW
   - **Publicar** → Status: PUBLISHED (apenas Admin/Editor)

### **Editar notícia existente**

1. Na listagem, clique no ícone de **edição (lápis)**
2. Modifique os campos desejados
3. Salve as alterações

### **Visualizar no frontend**

Posts publicados aparecem automaticamente em:
```
http://localhost:3000/noticias/[slug-da-noticia]
```

---

## 🔐 Permissões por Role

| Ação | Author | Editor | Admin | Super Admin |
|------|--------|--------|-------|-------------|
| Criar post | ✅ | ✅ | ✅ | ✅ |
| Editar próprio post | ✅ | ✅ | ✅ | ✅ |
| Editar qualquer post | ❌ | ✅ | ✅ | ✅ |
| Publicar post | ❌ | ✅ | ✅ | ✅ |
| Deletar post | ❌ | ❌ | ✅ | ✅ |
| Agendar post | ❌ | ✅ | ✅ | ✅ |

---

## 🐛 Troubleshooting

### **Erro: "Cannot fetch data from service"**

**Causa:** Problema de conexão com o banco.

**Solução:**
1. Verificar se DATABASE_URL está no .env.local
2. Testar conexão: `npm run db:check`
3. Se persistir, tentar usar POSTGRES_URL direto:
   ```env
   DATABASE_URL="postgres://7561d98052e8f9ff5d103981a870290bf02a5663b6f21702e2df24717c35bd9e:sk_5861ZP_K-7FFB9Xc1isXg@db.prisma.io:5432/postgres?sslmode=require"
   ```

### **Erro: "Unauthorized" ao acessar /admin**

**Causa:** Cookie de sessão não foi criado ou expirou.

**Solução:**
1. Fazer logout: `http://localhost:3000/login`
2. Limpar cookies do navegador
3. Fazer login novamente

### **Erro: "Email ou senha inválidos"**

**Causa:** Usuário não existe no banco.

**Solução:**
```bash
npm run db:seed
```

### **Erro: Build falha com "Failed to fetch font"**

**Causa:** Sem conexão com Google Fonts.

**Solução:**
- Ignorar em desenvolvimento (fontes não são críticas)
- OU comentar imports de fonte em `lib/fonts.ts` temporariamente

---

## 📊 Comandos Úteis

```bash
# Ver estrutura do banco
npm run db:studio

# Verificar estado do banco
npm run db:check

# Popular banco novamente (cuidado: pode duplicar dados)
npm run db:seed

# Resetar banco completamente (⚠️ apaga tudo!)
npm run db:reset

# Build para produção
npm run build

# Lint
npm run lint
```

---

## ✨ Funcionalidades Implementadas

### **APIs REST**
- ✅ `GET /api/posts` - Listar posts (com filtros e paginação)
- ✅ `POST /api/posts` - Criar post (autenticado)
- ✅ `GET /api/posts/[id]` - Buscar por ID
- ✅ `PUT /api/posts/[id]` - Atualizar post (autenticado)
- ✅ `DELETE /api/posts/[id]` - Deletar post (soft delete, autenticado)
- ✅ `GET /api/posts/slug/[slug]` - Buscar por slug (público)

### **Interface Admin**
- ✅ Listagem de posts com filtros e busca
- ✅ Formulário de criação completo
- ✅ Formulário de edição
- ✅ Estatísticas por status
- ✅ Preview de imagem destacada
- ✅ Contador de palavras e tempo de leitura
- ✅ Auto-geração de slug
- ✅ SEO completo (meta tags, OG image)
- ✅ Sistema de tags e categorias
- ✅ Agendamento de publicação

### **Segurança**
- ✅ Autenticação via cookie de sessão
- ✅ Autorização baseada em roles (RBAC)
- ✅ Middleware de proteção de rotas
- ✅ Soft delete (recuperação de dados)
- ✅ Audit trail completo

---

## 🎯 Próximos Passos

1. **Testar criação de posts no admin**
2. **Verificar visualização no frontend**
3. **Testar permissões com diferentes roles**
4. **Integrar upload de imagens** (biblioteca de mídia já existe)
5. **Adicionar editor rich-text** (TipTap ou similar)
6. **Implementar preview de Markdown em tempo real**

---

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs do terminal onde `npm run dev` está rodando
2. Verificar console do navegador (F12)
3. Executar `npm run db:check` para diagnosticar banco
4. Verificar se todas as variáveis do `.env.local` estão corretas

**Logs importantes:**
- `✅ Login bem-sucedido: admin@asof.org.br` → Login funcionou
- `✅ Valid session for user: xxx` → Middleware autorizou acesso
- `⚠️ Session expired` → Sessão expirada, fazer login novamente

---

## 🎊 Tudo Pronto!

O sistema de gestão de notícias está 100% funcional e pronto para uso. Basta seguir os passos acima e você terá um CMS completo funcionando localmente! 🚀

**Credenciais:** admin@asof.org.br / senha123
