'use client'

import { useState, useEffect } from 'react'
import { Zap, Bell, BarChart3, Code, Check, ArrowRight, Star, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const demoNotifications = [
  { name: 'Maria', location: 'São Paulo', action: 'acabou de comprar', item: 'Curso de Marketing', time: '2 min' },
  { name: 'João', location: 'Rio de Janeiro', action: 'se inscreveu no', item: 'Plano Pro', time: '5 min' },
  { name: 'Ana', location: 'Curitiba', action: 'deixou uma avaliação', item: '⭐⭐⭐⭐⭐', time: '8 min' },
  { name: 'Pedro', location: 'Belo Horizonte', action: 'começou o trial', item: 'gratuito', time: '12 min' },
]

export default function Home() {
  const [currentNotification, setCurrentNotification] = useState(0)
  const [showNotification, setShowNotification] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(false)
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % demoNotifications.length)
        setShowNotification(true)
      }, 500)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const notification = demoNotifications[currentNotification]

  return (
    <main className="min-h-screen">
      {/* Demo Notification */}
      <div 
        className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${
          showNotification ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="bg-white rounded-lg shadow-2xl p-4 max-w-sm border border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {notification.name[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">
              <span className="font-semibold">{notification.name}</span> de {notification.location}
            </p>
            <p className="text-sm text-gray-600">
              {notification.action} <span className="font-medium text-purple-600">{notification.item}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">há {notification.time}</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Popify</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Entrar
            </Link>
            <Link 
              href="/signup" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
            >
              Começar Grátis
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          Aumente suas conversões em até 15%
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
          Transforme visitantes em clientes com{' '}
          <span className="text-gradient">social proof</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Mostre notificações em tempo real de compras, inscrições e avaliações. 
          Prova social que converte — sem código, em 2 minutos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition shadow-lg shadow-purple-500/30"
          >
            Começar Grátis <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="#demo" 
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition border border-gray-200"
          >
            Ver Demo
          </Link>
        </div>

        {/* Social Proof Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600"><strong className="text-gray-900">2,500+</strong> sites usando</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-gray-600"><strong className="text-gray-900">+15%</strong> conversão média</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-600"><strong className="text-gray-900">4.9/5</strong> avaliação</span>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto px-4 py-20 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Veja como funciona
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          As notificações aparecem automaticamente no canto da tela. Olhe no canto inferior esquerdo! 👇
        </p>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 relative overflow-hidden min-h-[400px] border border-gray-200">
            {/* Fake browser header */}
            <div className="bg-white rounded-t-xl border border-gray-200 p-3 flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-1.5 text-sm text-gray-500 ml-4">
                sualoja.com.br
              </div>
            </div>
            
            {/* Fake website content */}
            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-32 bg-gray-100 rounded-lg"></div>
                <div className="h-32 bg-gray-100 rounded-lg"></div>
                <div className="h-32 bg-gray-100 rounded-lg"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            
            {/* Demo notification inside the fake browser */}
            <div 
              className={`absolute bottom-12 left-12 transition-all duration-500 ${
                showNotification ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              <div className="bg-white rounded-lg shadow-2xl p-4 max-w-xs border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {notification.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{notification.name}</span> de {notification.location}
                  </p>
                  <p className="text-xs text-gray-600">
                    {notification.action} <span className="font-medium text-purple-600">{notification.item}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">há {notification.time}</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-gray-500 mt-6 text-sm">
            ☝️ Essa é uma demonstração ao vivo. A notificação muda a cada 4 segundos.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Tudo que você precisa para converter mais
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
              <Bell className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Notificações em Tempo Real</h3>
            <p className="text-gray-600">
              Mostre compras, inscrições e avaliações conforme acontecem. Crie urgência e FOMO.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center mb-6">
              <Code className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instalação em 2 Minutos</h3>
            <p className="text-gray-600">
              Cole uma linha de código no seu site. Funciona com qualquer plataforma: WordPress, Shopify, Wix...
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Detalhado</h3>
            <p className="text-gray-600">
              Acompanhe impressões, cliques e conversões. Saiba exatamente o ROI do social proof.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20" id="pricing">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Planos simples e transparentes
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Comece grátis, pague quando crescer
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Grátis</h3>
            <p className="text-gray-600 mb-6">Para começar</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">R$0</span>
              <span className="text-gray-600">/mês</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 1.000 visualizações/mês
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> 1 site
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Notificações básicas
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Badge "Powered by Popify"
              </li>
            </ul>
            <Link 
              href="/signup" 
              className="block w-full text-center py-3 rounded-full border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Começar Grátis
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl text-white relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
              POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-purple-100 mb-6">Para negócios em crescimento</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">R$29</span>
              <span className="text-purple-100">/mês</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-yellow-300" /> 50.000 visualizações/mês
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-yellow-300" /> 3 sites
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-yellow-300" /> Personalização completa
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-yellow-300" /> Sem badge
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-yellow-300" /> Analytics avançado
              </li>
            </ul>
            <Link 
              href="/signup?plan=pro" 
              className="block w-full text-center py-3 rounded-full bg-white text-purple-600 font-semibold hover:bg-gray-100 transition"
            >
              Assinar Pro
            </Link>
          </div>

          {/* Business */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
            <p className="text-gray-600 mb-6">Para empresas</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">R$79</span>
              <span className="text-gray-600">/mês</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Visualizações ilimitadas
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Sites ilimitados
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Webhooks & API
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Integração Stripe
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Suporte prioritário
              </li>
            </ul>
            <Link 
              href="/signup?plan=business" 
              className="block w-full text-center py-3 rounded-full border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Falar com Vendas
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para aumentar suas conversões?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 2.500 sites que já usam Popify para converter mais visitantes em clientes.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
          >
            Começar Grátis Agora <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Popify</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2026 Popify. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}
