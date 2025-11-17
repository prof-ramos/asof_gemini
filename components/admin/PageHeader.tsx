import Link from 'next/link'
import { Plus } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  buttonLabel?: string
  buttonHref?: string
}

export default function PageHeader({
  title,
  description,
  buttonLabel,
  buttonHref
}: PageHeaderProps) {
  return (
    <div className="px-6 py-8 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-lg text-gray-600">{description}</p>
          )}
        </div>
        {buttonLabel && buttonHref && (
          <Link
            href={buttonHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-base font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {buttonLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
