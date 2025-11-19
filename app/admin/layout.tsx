import { Metadata } from 'next'
import Link from 'next/link'
import { Home, Image as ImageIcon, FileText, Users, Settings } from 'lucide-react'
import { Toaster } from 'sonner'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata: Metadata = {
  title: 'Admin - ASOF',
  description: 'Painel de administração ASOF',
  robots: 'noindex, nofollow',
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/media"
                  className="flex items-center gap-3 px-4 py-3 text-primary bg-accent/20 rounded-lg font-medium"
                >
                  <ImageIcon className="w-5 h-5" aria-label="Ícone de mídia" />
                  Mídia
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/posts"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Notícias
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5" />
                  Usuários
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Configurações
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors expand={false} duration={4000} />
    </div>
  )
}
