/**
 * Prisma Database Seed Script
 * Popula o banco de dados com dados iniciais para o CMS ASOF
 *
 * Execute com: npm run db:seed
 */

import { PrismaClient, UserRole, UserStatus, ContentStatus, PageType } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n')

  // ============================================================================
  // 1. USUÁRIOS
  // ============================================================================
  console.log('👤 Criando usuários...')

  // Usar senha da variável de ambiente ou gerar uma aleatória segura
  const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || randomBytes(16).toString('base64')
  const passwordHash = await bcrypt.hash(initialPassword, 12) // 12 salt rounds (mais seguro que 10)

  // Avisar se usando senha gerada aleatoriamente
  if (!process.env.INITIAL_ADMIN_PASSWORD) {
    console.warn('\n⚠️  ATENÇÃO: INITIAL_ADMIN_PASSWORD não configurada!')
    console.warn('📝  Senha gerada aleatoriamente para o super admin:')
    console.warn(`    Email: admin@asof.org.br`)
    console.warn(`    Senha: ${initialPassword}`)
    console.warn('🔒  ANOTE esta senha e altere após primeiro login!\n')
  } else {
    console.log('✅  Usando senha da variável de ambiente INITIAL_ADMIN_PASSWORD\n')
  }

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@asof.org.br' },
    update: {},
    create: {
      email: 'admin@asof.org.br',
      name: 'Administrador ASOF',
      password: passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      bio: 'Administrador principal do sistema CMS ASOF',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'editor@asof.org.br' },
    update: {},
    create: {
      email: 'editor@asof.org.br',
      name: 'Editor ASOF',
      password: passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      bio: 'Editor responsável pela gestão de conteúdo',
    },
  })

  const author = await prisma.user.upsert({
    where: { email: 'autor@asof.org.br' },
    update: {},
    create: {
      email: 'autor@asof.org.br',
      name: 'Autor ASOF',
      password: passwordHash,
      role: UserRole.AUTHOR,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      bio: 'Autor de artigos e notícias',
    },
  })

  console.log('✅ Usuários criados:', { superAdmin: superAdmin.email, admin: admin.email, author: author.email })

  // ============================================================================
  // 2. CATEGORIAS
  // ============================================================================
  console.log('\n📁 Criando categorias...')

  const categoryNoticias = await prisma.category.upsert({
    where: { slug: 'noticias' },
    update: {},
    create: {
      name: 'Notícias',
      slug: 'noticias',
      description: 'Notícias e atualizações sobre a ASOF e a carreira diplomática',
      color: '#2563eb',
      icon: 'newspaper',
      order: 1,
      isVisible: true,
      createdById: superAdmin.id,
    },
  })

  const categoryEventos = await prisma.category.upsert({
    where: { slug: 'eventos' },
    update: {},
    create: {
      name: 'Eventos',
      slug: 'eventos',
      description: 'Eventos, palestras e atividades da ASOF',
      color: '#7c3aed',
      icon: 'calendar',
      order: 2,
      isVisible: true,
      createdById: superAdmin.id,
    },
  })

  const categoryInstitucional = await prisma.category.upsert({
    where: { slug: 'institucional' },
    update: {},
    create: {
      name: 'Institucional',
      slug: 'institucional',
      description: 'Informações institucionais sobre a ASOF',
      color: '#059669',
      icon: 'building',
      order: 3,
      isVisible: true,
      createdById: superAdmin.id,
    },
  })

  const categoryTransparencia = await prisma.category.upsert({
    where: { slug: 'transparencia' },
    update: {},
    create: {
      name: 'Transparência',
      slug: 'transparencia',
      description: 'Documentos de transparência e prestação de contas',
      color: '#dc2626',
      icon: 'file-text',
      order: 4,
      isVisible: true,
      createdById: superAdmin.id,
    },
  })

  console.log('✅ Categorias criadas:', [
    categoryNoticias.name,
    categoryEventos.name,
    categoryInstitucional.name,
    categoryTransparencia.name,
  ])

  // ============================================================================
  // 3. TAGS
  // ============================================================================
  console.log('\n🏷️  Criando tags...')

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'diplomacia' },
      update: {},
      create: { name: 'Diplomacia', slug: 'diplomacia', color: '#3b82f6' },
    }),
    prisma.tag.upsert({
      where: { slug: 'carreira' },
      update: {},
      create: { name: 'Carreira', slug: 'carreira', color: '#8b5cf6' },
    }),
    prisma.tag.upsert({
      where: { slug: 'beneficios' },
      update: {},
      create: { name: 'Benefícios', slug: 'beneficios', color: '#10b981' },
    }),
    prisma.tag.upsert({
      where: { slug: 'associacao' },
      update: {},
      create: { name: 'Associação', slug: 'associacao', color: '#f59e0b' },
    }),
    prisma.tag.upsert({
      where: { slug: 'direitos' },
      update: {},
      create: { name: 'Direitos', slug: 'direitos', color: '#ef4444' },
    }),
  ])

  console.log('✅ Tags criadas:', tags.map(t => t.name))

  // ============================================================================
  // 4. POSTS DE EXEMPLO
  // ============================================================================
  console.log('\n📝 Criando posts de exemplo...')

  const post1 = await prisma.post.upsert({
    where: { slug: 'bem-vindo-ao-novo-site-asof' },
    update: {},
    create: {
      slug: 'bem-vindo-ao-novo-site-asof',
      title: 'Bem-vindo ao Novo Site da ASOF',
      excerpt: 'Estamos felizes em apresentar o novo portal institucional da Associação dos Oficiais de Chancelaria, com design moderno e recursos aprimorados.',
      content: `# Bem-vindo ao Novo Site da ASOF

Estamos muito felizes em apresentar o novo portal institucional da **Associação dos Oficiais de Chancelaria (ASOF)**.

## O que há de novo?

- **Design Moderno**: Interface limpa e responsiva, otimizada para todos os dispositivos
- **Navegação Intuitiva**: Encontre informações importantes de forma rápida e fácil
- **Sistema de Notícias**: Acompanhe as últimas novidades da associação
- **Transparência**: Acesso facilitado a documentos e prestações de contas
- **Performance**: Site rápido e otimizado para melhor experiência

## Tecnologia de Ponta

O novo site foi desenvolvido com as mais modernas tecnologias:

- Next.js 15 para máxima performance
- TypeScript para maior segurança no código
- Tailwind CSS para design responsivo
- Sistema de CMS integrado

## Próximos Passos

Continuaremos aprimorando o site com novos recursos e funcionalidades. Fique atento às atualizações!

**Equipe ASOF**`,
      status: ContentStatus.PUBLISHED,
      authorId: superAdmin.id,
      categoryId: categoryInstitucional.id,
      publishedAt: new Date(),
      isFeatured: true,
      readingTime: 2,
      metaTitle: 'Bem-vindo ao Novo Site da ASOF',
      metaDescription: 'Conheça o novo portal institucional da ASOF com design moderno e recursos aprimorados.',
    },
  })

  const post2 = await prisma.post.upsert({
    where: { slug: 'defesa-direitos-oficiais-chancelaria' },
    update: {},
    create: {
      slug: 'defesa-direitos-oficiais-chancelaria',
      title: 'ASOF na Defesa dos Direitos dos Oficiais de Chancelaria',
      excerpt: 'A ASOF atua constantemente na defesa dos direitos e interesses da categoria, promovendo melhorias nas condições de trabalho e valorização profissional.',
      content: `# ASOF na Defesa dos Direitos dos Oficiais de Chancelaria

A Associação dos Oficiais de Chancelaria (ASOF) tem como missão fundamental a defesa dos direitos e interesses de seus associados.

## Nossas Conquistas

Ao longo dos anos, conquistamos importantes avanços:

1. **Melhoria Salarial**: Negociação de reajustes justos
2. **Condições de Trabalho**: Melhorias nas instalações e equipamentos
3. **Capacitação**: Programas de formação continuada
4. **Assistência Jurídica**: Suporte legal aos associados

## Atuação Constante

Nossa equipe trabalha incansavelmente para:

- Representar a categoria junto aos órgãos competentes
- Negociar benefícios e melhorias
- Prestar assistência aos associados
- Promover integração e networking

## Junte-se a Nós

Seja um associado e fortaleça nossa luta coletiva pelos direitos da categoria.

**Juntos somos mais fortes!**`,
      status: ContentStatus.PUBLISHED,
      authorId: admin.id,
      categoryId: categoryNoticias.id,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      isFeatured: true,
      readingTime: 3,
      metaTitle: 'ASOF na Defesa dos Direitos dos Oficiais de Chancelaria',
      metaDescription: 'Conheça a atuação da ASOF na defesa dos direitos e valorização dos Oficiais de Chancelaria.',
    },
  })

  const post3 = await prisma.post.upsert({
    where: { slug: 'proximos-eventos-2024' },
    update: {},
    create: {
      slug: 'proximos-eventos-2024',
      title: 'Calendário de Eventos ASOF 2024',
      excerpt: 'Confira os principais eventos programados pela ASOF para este ano, incluindo palestras, workshops e encontros da categoria.',
      content: `# Calendário de Eventos ASOF 2024

Participe dos eventos organizados pela ASOF ao longo do ano!

## Eventos Programados

### Março
- **Workshop de Capacitação**: Novas tecnologias na diplomacia
- **Assembleia Geral Ordinária**: Prestação de contas e planejamento

### Junho
- **Encontro Nacional**: Networking e integração entre associados
- **Palestra**: Carreira diplomática no século XXI

### Setembro
- **Seminário de Direitos**: Atualizações jurídicas para a categoria
- **Confraternização**: Celebração do Dia do Diplomata

### Dezembro
- **Balanço Anual**: Retrospectiva das ações da ASOF
- **Confraternização de Fim de Ano**: Integração entre associados e familiares

## Inscrições

As inscrições para os eventos serão abertas com antecedência. Fique atento aos nossos canais de comunicação!

## Contato

Dúvidas? Entre em contato: eventos@asof.org.br`,
      status: ContentStatus.PUBLISHED,
      authorId: author.id,
      categoryId: categoryEventos.id,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
      isFeatured: false,
      readingTime: 2,
      metaTitle: 'Calendário de Eventos ASOF 2024',
      metaDescription: 'Confira os principais eventos da ASOF programados para 2024.',
    },
  })

  // Criar relacionamentos de tags
  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: tags[3].id }, // associacao
      { postId: post2.id, tagId: tags[0].id }, // diplomacia
      { postId: post2.id, tagId: tags[4].id }, // direitos
      { postId: post3.id, tagId: tags[3].id }, // associacao
      { postId: post3.id, tagId: tags[1].id }, // carreira
    ],
  })

  console.log('✅ Posts criados:', [post1.title, post2.title, post3.title])

  // ============================================================================
  // 5. PÁGINAS ESTÁTICAS
  // ============================================================================
  console.log('\n📄 Criando páginas estáticas...')

  const pageSobre = await prisma.page.upsert({
    where: { slug: 'sobre' },
    update: {},
    create: {
      slug: 'sobre',
      title: 'Sobre a ASOF',
      content: `# Quem Somos

A Associação dos Oficiais de Chancelaria (ASOF) é uma entidade representativa dos servidores do Ministério das Relações Exteriores.

## Nossa Missão

Defender os direitos e interesses dos Oficiais de Chancelaria, promovendo sua valorização profissional e melhoria das condições de trabalho.

## Nossa Visão

Ser referência na representação sindical e na defesa dos interesses da categoria diplomática.

## Nossos Valores

- Ética e transparência
- Compromisso com a categoria
- Excelência no atendimento
- Trabalho em equipe`,
      type: PageType.STATIC,
      status: ContentStatus.PUBLISHED,
      authorId: superAdmin.id,
      publishedAt: new Date(),
      showInNav: true,
      order: 1,
      metaTitle: 'Sobre a ASOF - Associação dos Oficiais de Chancelaria',
      metaDescription: 'Conheça a ASOF, sua missão, visão e valores.',
    },
  })

  const pageContato = await prisma.page.upsert({
    where: { slug: 'contato' },
    update: {},
    create: {
      slug: 'contato',
      title: 'Contato',
      content: `# Entre em Contato

Estamos à disposição para atender você!

## Endereço
Brasília - DF, Brasil

## Telefone
(61) 3322-0000

## E-mail
contato@asof.org.br

## Horário de Atendimento
Segunda a Sexta: 9h às 18h`,
      type: PageType.STATIC,
      status: ContentStatus.PUBLISHED,
      authorId: superAdmin.id,
      publishedAt: new Date(),
      showInNav: true,
      order: 2,
      metaTitle: 'Contato - ASOF',
      metaDescription: 'Entre em contato com a ASOF.',
    },
  })

  console.log('✅ Páginas criadas:', [pageSobre.title, pageContato.title])

  // ============================================================================
  // 6. CONFIGURAÇÕES DO SISTEMA
  // ============================================================================
  console.log('\n⚙️  Criando configurações do sistema...')

  const settings = await Promise.all([
    prisma.setting.upsert({
      where: { key: 'site_name' },
      update: {},
      create: {
        key: 'site_name',
        value: 'ASOF - Associação dos Oficiais de Chancelaria',
        type: 'string',
        category: 'general',
        description: 'Nome do site',
        isPublic: true,
      },
    }),
    prisma.setting.upsert({
      where: { key: 'site_description' },
      update: {},
      create: {
        key: 'site_description',
        value: 'Defendendo os direitos e interesses dos Oficiais de Chancelaria',
        type: 'string',
        category: 'general',
        description: 'Descrição do site',
        isPublic: true,
      },
    }),
    prisma.setting.upsert({
      where: { key: 'contact_email' },
      update: {},
      create: {
        key: 'contact_email',
        value: 'contato@asof.org.br',
        type: 'string',
        category: 'general',
        description: 'E-mail de contato',
        isPublic: true,
      },
    }),
    prisma.setting.upsert({
      where: { key: 'contact_phone' },
      update: {},
      create: {
        key: 'contact_phone',
        value: '(61) 3322-0000',
        type: 'string',
        category: 'general',
        description: 'Telefone de contato',
        isPublic: true,
      },
    }),
    prisma.setting.upsert({
      where: { key: 'posts_per_page' },
      update: {},
      create: {
        key: 'posts_per_page',
        value: '12',
        type: 'number',
        category: 'general',
        description: 'Número de posts por página',
        isPublic: true,
      },
    }),
  ])

  console.log('✅ Configurações criadas:', settings.map(s => s.key))

  // ============================================================================
  // 7. NAVEGAÇÃO
  // ============================================================================
  console.log('\n🧭 Criando itens de navegação...')

  const navItems = await Promise.all([
    prisma.navigation.upsert({
      where: { id: 'nav-home' },
      update: {},
      create: {
        id: 'nav-home',
        label: 'Início',
        url: '/',
        order: 1,
        location: 'header',
        isActive: true,
      },
    }),
    prisma.navigation.upsert({
      where: { id: 'nav-sobre' },
      update: {},
      create: {
        id: 'nav-sobre',
        label: 'Sobre',
        url: '/sobre',
        order: 2,
        location: 'header',
        isActive: true,
      },
    }),
    prisma.navigation.upsert({
      where: { id: 'nav-noticias' },
      update: {},
      create: {
        id: 'nav-noticias',
        label: 'Notícias',
        url: '/noticias',
        order: 3,
        location: 'header',
        isActive: true,
      },
    }),
    prisma.navigation.upsert({
      where: { id: 'nav-contato' },
      update: {},
      create: {
        id: 'nav-contato',
        label: 'Contato',
        url: '/contato',
        order: 4,
        location: 'header',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Navegação criada:', navItems.map(n => n.label))

  // ============================================================================
  console.log('\n✨ Seed concluído com sucesso!')
  console.log('\n📊 Resumo:')
  console.log('   - 3 usuários criados')
  console.log('   - 4 categorias criadas')
  console.log('   - 5 tags criadas')
  console.log('   - 3 posts criados')
  console.log('   - 2 páginas criadas')
  console.log('   - 5 configurações criadas')
  console.log('   - 4 itens de navegação criados')
  console.log('\n🔐 Credenciais de acesso:')
  console.log('   Super Admin: admin@asof.org.br')
  console.log('   Admin: editor@asof.org.br')
  console.log('   Autor: autor@asof.org.br')
  console.log(`   Senha: ${process.env.INITIAL_ADMIN_PASSWORD ? '[Configurada via INITIAL_ADMIN_PASSWORD]' : '[Gerada aleatoriamente - ver acima]'}`)
  console.log('\n⚠️  IMPORTANTE:')
  console.log('   1. Anote a senha gerada (se aplicável)')
  console.log('   2. Faça login e ALTERE a senha imediatamente')
  console.log('   3. Nunca use senhas fracas em produção')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro ao executar seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
