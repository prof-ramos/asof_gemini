# Site Oficial ASOF - Associação dos Oficiais de Chancelaria

Website institucional da ASOF desenvolvido com Next.js 15, React 19, TypeScript e Tailwind CSS, seguindo as melhores práticas da Vercel.

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Linguagem**: TypeScript (strict mode)
- **Estilização**: Tailwind CSS 3.4
- **Conteúdo**: MDX para blog
- **Ícones**: Lucide React
- **Fontes**: Next/Font (Playfair Display + Inter)

## 📁 Estrutura do Projeto

```
asof_gemini/
├── app/                          # App Router do Next.js
│   ├── layout.tsx               # Layout principal com metadata
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Estilos globais + Tailwind
│   ├── sobre/                   # Página "Quem Somos"
│   ├── atuacao/                 # Página "Áreas de Atuação"
│   ├── noticias/                # Listagem de notícias
│   │   └── [slug]/              # Página individual de notícia
│   ├── transparencia/           # Portal da Transparência
│   ├── contato/                 # Formulário de contato
│   ├── sitemap.ts               # Geração automática de sitemap
│   └── robots.ts                # Configuração robots.txt
│
├── components/
│   ├── ui/                      # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── NewsCard.tsx
│   │   ├── Badge.tsx
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   └── IconCard.tsx
│   ├── layout/                  # Componentes de layout
│   │   ├── Header.tsx           # Header com scroll detection
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   └── sections/                # Seções da homepage
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── PillarsSection.tsx
│       ├── NewsSection.tsx
│       └── CTASection.tsx
│
├── content/
│   └── noticias/                # Artigos em MDX
│       ├── avanco-negociacao-salarial.mdx
│       ├── encontro-saude-mental.mdx
│       └── eleicoes-diretoria-2025.mdx
│
├── lib/
│   ├── fonts.ts                 # Configuração de fontes otimizadas
│   ├── utils.ts                 # Funções utilitárias (cn, formatDate)
│   ├── constants.ts             # Constantes do site
│   └── mdx.ts                   # Utilidades para MDX
│
├── hooks/
│   └── useScrollPosition.ts     # Hook para scroll detection
│
├── types/
│   └── index.ts                 # Types TypeScript
│
└── public/
    ├── images/                  # Imagens otimizadas
    └── icons/                   # Ícones e favicon
```

## 🎨 Paleta de Cores

```css
--primary: #040920         /* Azul escuro */
--primary-dark: #0D2A4A    /* Azul médio */
--accent: #82b4d6          /* Azul claro */
--neutral: #e7edf4         /* Azul muito claro */
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Lint
npm run lint
```

## 📄 Páginas

### Páginas Estáticas

- **/** - Homepage com hero, sobre, pilares, notícias e CTA
- **/sobre** - História, missão, visão, valores, timeline, diretoria
- **/atuacao** - Áreas de atuação, benefícios, cases de sucesso
- **/transparencia** - Demonstrações financeiras, documentos, LAI
- **/contato** - Formulário de contato, informações, FAQ, mapa

### Páginas Dinâmicas

- **/noticias** - Listagem de todas as notícias
- **/noticias/[slug]** - Página individual de notícia (MDX)

## ✨ Funcionalidades

### Performance

- ✅ Server Components por padrão
- ✅ Fontes otimizadas com `next/font`
- ✅ Imagens otimizadas com `next/image`
- ✅ Lazy loading automático
- ✅ Bundle JS minimizado
- ✅ Static Generation onde possível

### SEO

- ✅ Metadata completa em todas as páginas
- ✅ Open Graph configurado
- ✅ Twitter Cards
- ✅ Sitemap.xml gerado automaticamente
- ✅ Robots.txt configurado
- ✅ Structured Data (JSON-LD) pronto para implementar

### Acessibilidade

- ✅ ARIA labels completos
- ✅ Navegação por teclado
- ✅ Alt text descritivos
- ✅ Semantic HTML
- ✅ Contraste adequado (WCAG 2.1 AA)

### Blog (MDX)

- ✅ Sistema completo de blog com MDX
- ✅ Frontmatter para metadata
- ✅ Reading time automático
- ✅ Categorias e filtros
- ✅ Notícias relacionadas
- ✅ Geração estática de páginas

## 🎯 Otimizações Implementadas

### Next.js

- App Router com Server Components
- Metadata API para SEO
- Compressão habilitada
- Headers de segurança configurados
- Image optimization com AVIF/WebP
- Font optimization com self-hosting

### TypeScript

- Strict mode ativado
- No unused locals
- No unused parameters
- Path aliases (@/*)

### Tailwind CSS

- Paleta de cores customizada
- Fontes customizadas
- Animações otimizadas
- PurgeCSS automático

## 📦 Dependências Principais

```json
{
  "next": "^15.1.8",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "@next/mdx": "^16.0.3",
  "@mdx-js/react": "^3.1.1",
  "gray-matter": "^4.0.3",
  "lucide-react": "^0.553.0",
  "next-mdx-remote": "^5.0.0"
}
```

## 🔧 Configurações

### next.config.ts

- Suporte a MDX
- Otimizações de imagem (AVIF, WebP)
- Headers de segurança
- Compressão habilitada
- Console.log removido em produção

### tailwind.config.ts

- Cores customizadas ASOF
- Fontes variáveis
- Animações customizadas
- Container padrão

## 📝 Como Adicionar Conteúdo

### Adicionar Nova Notícia

1. Criar arquivo `.mdx` em `content/noticias/`
2. Adicionar frontmatter:

```mdx
---
title: "Título da Notícia"
date: "2024-MM-DD"
category: "Categoria"
excerpt: "Resumo breve..."
author: "Autor"
image: "/images/noticia.jpg"
---

# Conteúdo em Markdown...
```

3. O arquivo será automaticamente incluído na listagem

### Editar Páginas Estáticas

- Editar arquivos em `app/[pagina]/page.tsx`
- Componentes reutilizáveis em `components/`

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Railway

## 📊 Performance Esperada

- **Lighthouse Score**: 95+
- **LCP**: < 2.0s
- **CLS**: < 0.05
- **INP**: < 100ms
- **Bundle JS**: ~60KB

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

© 2024 ASOF - Todos os direitos reservados.

## 📞 Suporte

- **Email**: contato@asof.org.br
- **Telefone**: +55 (61) 3322-0000
- **Site**: https://asof.org.br
