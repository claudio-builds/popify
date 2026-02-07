'use client'

import { useState, Suspense } from 'react'
import { Bell, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'free'

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, plan }
        }
      })

      if (signUpError) throw signUpError
      if (data.user) router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {plan !== 'free' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <p className="text-purple-700 font-medium">
            Plano selecionado: <span className="capitalize">{plan}</span>
          </p>
          <p className="text-purple-600 text-sm">
            Você pode começar grátis e fazer upgrade depois
          </p>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Seu nome"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Criar conta <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-purple-600 font-medium hover:underline">Entrar</Link>
      </p>
    </>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Popify</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar conta</h1>
          <p className="text-gray-600 mb-8">Comece a aumentar suas conversões hoje</p>

          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-pink-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h2 className="text-3xl font-bold mb-6">Junte-se a milhares de sites que aumentaram suas conversões</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><span className="text-2xl">📈</span></div>
              <div><p className="font-semibold">+15% conversão média</p><p className="text-purple-100 text-sm">Resultados comprovados</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><span className="text-2xl">⚡</span></div>
              <div><p className="font-semibold">Setup em 2 minutos</p><p className="text-purple-100 text-sm">Sem conhecimento técnico</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><span className="text-2xl">💳</span></div>
              <div><p className="font-semibold">Sem cartão necessário</p><p className="text-purple-100 text-sm">Comece grátis hoje</p></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
