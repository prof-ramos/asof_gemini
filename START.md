# 🚀 Como Iniciar o Projeto ASOF

## Início Rápido (2 passos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor
```bash
npm run dev
```

**Aguarde a mensagem**:
```
✓ Ready in X seconds
- Local:   http://localhost:3000
```

## URLs Importantes

| URL | Descrição |
|-----|-----------|
| `http://localhost:3000` | Homepage |
| `http://localhost:3000/login` | Login Admin |
| `http://localhost:3000/admin` | Dashboard Admin |

## Credenciais de Desenvolvimento

```
📧 Email: admin@asof.org.br
🔑 Senha: admin123
```

## Problemas Comuns

### "Porta 3000 em uso"
```bash
pkill -f next
npm run dev
```

### "Página não encontrada (404)"
```bash
rm -rf .next
npm run dev
```

### Cache do navegador
```
Ctrl + Shift + Delete → Clear Cache
```

## Comandos Úteis

```bash
# Build de produção
npm run build

# Testes E2E
npm run test:e2e

# Lint
npm run lint

# Prisma Studio
npm run db:studio
```

## Precisa de Ajuda?

- **Login 404**: Veja `LOGIN-TROUBLESHOOTING.md`
- **Deploy**: Veja `DEPLOY.md`
- **Documentação**: Veja `/docs/`
