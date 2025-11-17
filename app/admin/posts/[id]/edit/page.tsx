import AdminHeader from '@/components/admin/AdminHeader'
import PageHeader from '@/components/admin/PageHeader'

interface EditPostPageProps {
  params: { id: string }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <>
      <AdminHeader />
      <PageHeader
        title="Editar Notícia"
        description="Edite os detalhes da notícia selecionada."
      />
      <div className="px-6 py-8">
        {/* PostForm will be added here with pre-filled data */}
        <p>Carregando dados do post {params.id}...</p>
      </div>
    </>
  )
}
