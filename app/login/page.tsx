'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogIn, AlertCircle } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      // Redirecionar após login bem-sucedido
      // Usar window.location para garantir reload completo e aplicação do cookie
      console.log('✅ Login bem-sucedido, redirecionando para:', redirect)
      window.location.href = redirect
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            ASOF Admin
          </h1>
          <p className="text-accent-light">
            Acesse o painel administrativo
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Esqueceu sua senha?{' '}
              <a
                href="mailto:admin@asof.org.br"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Entre em contato
              </a>
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-white hover:text-accent-light transition-colors"
          >
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
              <LogIn className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              ASOF Admin
            </h1>
            <p className="text-accent-light">
              Carregando...
            </p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
