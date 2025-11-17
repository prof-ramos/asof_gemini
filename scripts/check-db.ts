/**
 * Script de diagnóstico do banco de dados
 * Verifica se os usuários foram criados corretamente
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('🔍 Verificando banco de dados...\n')

  try {
    // 1. Verificar usuários
    console.log('👤 Usuários cadastrados:')
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    })

    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado! Execute: npm run db:seed')
    } else {
      users.forEach((user) => {
        console.log(`  ✅ ${user.email} - ${user.role} - ${user.status}`)
      })
    }

    // 2. Verificar sessões ativas
    console.log('\n🔑 Sessões ativas:')
    const sessions = await prisma.session.findMany({
      where: {
        expires: {
          gte: new Date(),
        },
      },
      select: {
        userId: true,
        expires: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    })

    if (sessions.length === 0) {
      console.log('  ℹ️  Nenhuma sessão ativa')
    } else {
      sessions.forEach((session) => {
        console.log(`  🔓 ${session.user.email} - Expira: ${session.expires}`)
      })
    }

    // 3. Verificar posts
    console.log('\n📝 Posts no banco:')
    const postCount = await prisma.post.count()
    console.log(`  Total de posts: ${postCount}`)

    // 4. Verificar categorias
    console.log('\n📁 Categorias:')
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        slug: true,
      },
    })
    categories.forEach((cat) => {
      console.log(`  📂 ${cat.name} (${cat.slug})`)
    })

    // 5. Verificar tags
    console.log('\n🏷️  Tags:')
    const tagCount = await prisma.tag.count()
    console.log(`  Total de tags: ${tagCount}`)

    console.log('\n✅ Diagnóstico completo!')
    console.log('\n📋 Credenciais de login:')
    console.log('   Email: admin@asof.org.br')
    console.log('   Senha: senha123')
    console.log('\n   Ou use: editor@asof.org.br / senha123')
    console.log('           autor@asof.org.br / senha123')
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error)
    console.log('\n⚠️  Verifique:')
    console.log('   1. Se o banco de dados está rodando')
    console.log('   2. Se a variável DATABASE_URL está configurada no .env')
    console.log('   3. Execute: npm run db:migrate')
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
