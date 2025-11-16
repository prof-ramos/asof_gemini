import { Metadata } from 'next'
import Link from 'next/link'
import { Image, FileText, Users, Settings, TrendingUp, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard - Admin ASOF',
  description: 'Painel administrativo ASOF',
  robots: 'noindex, nofollow',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao painel administrativo da ASOF
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Visitas</p>
              <p className="text-3xl font-bold text-gray-900">12,345</p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +12% este mês
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Notícias Publicadas</p>
              <p className="text-3xl font-bold text-gray-900">45</p>
              <p className="text-sm text-gray-500 mt-1">8 rascunhos</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Arquivos de Mídia</p>
              <p className="text-3xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-500 mt-1">2.4 GB usado</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Usuários Ativos</p>
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-500 mt-1">4 administradores</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/media"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Biblioteca de Mídia</h3>
                <p className="text-sm text-gray-600">Gerenciar arquivos</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/posts"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notícias</h3>
                <p className="text-sm text-gray-600">Criar e editar</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Usuários</h3>
                <p className="text-sm text-gray-600">Gerenciar equipe</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Configurações</h3>
                <p className="text-sm text-gray-600">Ajustes do sistema</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Atividades Recentes
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Admin</span> publicou uma nova notícia
                  <span className="font-medium"> "ASOF celebra 50 anos"</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
              </div>
            </div>
          </div>

          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded">
                <Image className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Editor</span> fez upload de 5 imagens
                </p>
                <p className="text-xs text-gray-500 mt-1">Há 5 horas</p>
              </div>
            </div>
          </div>

          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Admin</span> adicionou novo usuário
                  <span className="font-medium"> João Silva</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Ontem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
