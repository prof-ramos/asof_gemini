# Vercel Documentation (Free Tier)

Biblioteca e plataforma Vercel para deploy, analytics e performance de aplicações Next.js.

## Uso Básico

### Deploy via CLI
```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy do projeto
vercel --prod
```

### Analytics (Gratuito)
```tsx
// Componente Analytics
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <h1>Minha App</h1>
      <Analytics />
    </div>
  );
}
```

### Speed Insights (Gratuito)
```tsx
// Componente Speed Insights
import { SpeedInsights } from '@vercel/speed-insights/next';

function App() {
  return (
    <div>
      <h1>Minha App</h1>
      <SpeedInsights />
    </div>
  );
}
```

## Configurações Importantes

### vercel.json (Free Tier Otimizado)
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

### ISR (Incremental Static Regeneration)
```tsx
// Página com ISR de 1 hora
export const revalidate = 3600;

export default function NewsPage() {
  return <div>Notícias com cache de 1 hora</div>;
}
```

### Middleware (Free Tier)
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}
```

## Limites do Free Tier

- ✅ 100 GB bandwidth/mês
- ✅ 100 GB Edge Functions/mês
- ✅ 1.000 builds/mês
- ✅ 100 GB build cache
- ✅ 1 domínio gratuito
- ✅ Certificado SSL gratuito automático
- ✅ Analytics e Speed Insights gratuitos

## Comparação com outros provedores

### Vercel Free Tier vs. Outros
| Serviço | Bandwidth | Builds/Mês | Preço Inicial |
|---------|-----------|------------|---------------|
| Vercel (Free) | 100 GB | 1.000 | R$ 0,00 |
| Netlify (Free) | 100 GB | 300 builds/mês | R$ 0,00 |
| Render (Free) | 750 horas/mês | 750 horas/mês | R$ 0,00 |
| Railway (Trial) | $5 credit | Trial-based | R$ 0,00 (trial) |

## Casos de Uso

### Deploy de Site Institucional
- Sites estáticos/Dinamicos
- Aplicações Next.js
- APIS serverless
- Headless CMS

### Performance e SEO
- ISR para conteúdo dinâmico
- Image optimization automático
- Caching inteligente
- CDN edge global

### Monitoramento
- Analytics em tempo real
- Core Web Vitals tracking
- Speed Insights automático
- Logs de deploy

## Otimizações Gratuitas

### Headers de Segurança
```typescript
// middleware.ts (já configura automaticamente)
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
```

### Optimização de Imagens
```typescript
// next.config.js (configurado automaticamente)
images: {
  domains: ["images.unsplash.com"],
  formats: ['image/webp', 'image/avif'],
}
```

### Compressão
- GZIP automático para all responses
- Brotli support
- No need for additional configuration

## CI/CD Gratuito

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Troubleshooting

### Problemas Comuns no Free Tier

1. **Bandwidth Exceeded**: Melhorar cache (ISR)
2. **Build Time**: Otimizar dependencies
3. **Cold Starts**: Usar menos Edge Functions
4. **Domain**: Primeiro domínio gratuito

## Vantagens do Free Tier

- ✅ Nunca expira
- ✅ Sem cartão de crédito necessário
- ✅ Adequado para sites institucionais
- ✅ Deploy infinito com limits adequados
- ✅ Excelente performance global
- ✅ HTTPS automático
- ✅ Analytics completo gratuito

## Quando Upgrade é Necessário

- Traffic muito alto (>100GB/mês)
- Builds frequentes (>1.000/mês)
- Edge Functions customizadas
- Team collaboration avançado
- Enterprise features (SSO, SLA, etc.)

---

## Próximos Passos

1. **Deploy Inicial**: `vercel` no terminal
2. **Configurar Domínio**: `vercel domains add [seu-domínio]`
3. **Monitoring**: Verificar Analytics no dashboard Vercel
4. **Performance**: Analisar Speed Insights

**Custo Total: R$ 0,00/mês** 🎉
