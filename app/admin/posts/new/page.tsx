import AdminHeader from '@/components/admin/AdminHeader'
import PageHeader from '@/components/admin/PageHeader'

export default function NewPostPage() {
  return (
    <>
      <AdminHeader />
      <PageHeader
        title="Nova Notícia"
        description="Crie uma nova notícia para o site."
      />
      <div className="px-6 py-8">
        {/* PostForm will be added here */}
        <p>Carregando formulário...</p>
      </div>
    </>
  )
}
