'use client'

import { useState, useEffect } from 'react'
import { Bell, Plus, Settings, BarChart3, Code, Copy, Check, LogOut, Eye, MousePointer, Globe, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Site = {
  id: string
  name: string
  domain: string
  api_key: string
  created_at: string
}

type Notification = {
  id: string
  type: string
  name: string
  location: string
  action: string
  item: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [showNewSite, setShowNewSite] = useState(false)
  const [showNewNotification, setShowNewNotification] = useState(false)
  const [copied, setCopied] = useState(false)
  const [newSiteName, setNewSiteName] = useState('')
  const [newSiteDomain, setNewSiteDomain] = useState('')
  const [newNotification, setNewNotification] = useState({
    type: 'purchase',
    name: '',
    location: '',
    action: 'comprou',
    item: ''
  })
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    loadSites(user.id)
  }

  const loadSites = async (userId: string) => {
    const { data } = await supabase
      .from('sites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (data && data.length > 0) {
      setSites(data)
      setSelectedSite(data[0])
      loadNotifications(data[0].id)
    }
  }

  const loadNotifications = async (siteId: string) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (data) {
      setNotifications(data)
    }
  }

  const createSite = async () => {
    if (!newSiteName || !newSiteDomain || !user) return

    const apiKey = 'pop_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    const { data, error } = await supabase
      .from('sites')
      .insert({
        user_id: user.id,
        name: newSiteName,
        domain: newSiteDomain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        api_key: apiKey,
        settings: {
          position: 'bottom-left',
          theme: 'light',
          showAvatar: true,
          duration: 5000,
          delay: 3000
        }
      })
      .select()
      .single()

    if (data) {
      setSites([data, ...sites])
      setSelectedSite(data)
      setShowNewSite(false)
      setNewSiteName('')
      setNewSiteDomain('')
    }
  }

  const createNotification = async () => {
    if (!selectedSite || !newNotification.name || !newNotification.item) return

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        site_id: selectedSite.id,
        ...newNotification
      })
      .select()
      .single()

    if (data) {
      setNotifications([data, ...notifications])
      setShowNewNotification(false)
      setNewNotification({
        type: 'purchase',
        name: '',
        location: '',
        action: 'comprou',
        item: ''
      })
    }
  }

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id)
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const copyCode = () => {
    if (!selectedSite) return
    const code = `<script src="https://popify.vercel.app/widget.js" data-key="${selectedSite.api_key}"></script>`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Popify</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.email}</span>
            <button onClick={logout} className="text-gray-500 hover:text-gray-700">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Sites */}
          <div className="lg:w-64 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Seus Sites</h2>
              <button 
                onClick={() => setShowNewSite(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-2">
              {sites.map(site => (
                <button
                  key={site.id}
                  onClick={() => {
                    setSelectedSite(site)
                    loadNotifications(site.id)
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
                    selectedSite?.id === site.id 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{site.name}</p>
                    <p className="text-xs opacity-70 truncate">{site.domain}</p>
                  </div>
                </button>
              ))}
              
              {sites.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  Nenhum site ainda
                </p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {selectedSite ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Eye className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-gray-600">Impressões</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-500">Este mês</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <MousePointer className="w-5 h-5 text-pink-600" />
                      </div>
                      <span className="text-gray-600">Cliques</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-500">Este mês</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-600">Taxa de Clique</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">0%</p>
                    <p className="text-sm text-gray-500">CTR</p>
                  </div>
                </div>

                {/* Install Code */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Código de Instalação</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Cole este código antes do &lt;/body&gt; do seu site:
                  </p>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      {`<script src="https://popify.vercel.app/widget.js" data-key="${selectedSite.api_key}"></script>`}
                    </code>
                    <button 
                      onClick={copyCode}
                      className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Notificações</h3>
                    </div>
                    <button 
                      onClick={() => setShowNewNotification(true)}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                    >
                      <Plus className="w-4 h-4" /> Adicionar
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    Adicione notificações manualmente ou conecte via webhook/API.
                  </p>

                  <div className="space-y-3">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {notification.name[0]}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800">
                              <span className="font-medium">{notification.name}</span>
                              {notification.location && ` de ${notification.location}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {notification.action} <span className="font-medium text-purple-600">{notification.item}</span>
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}

                    {notifications.length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        Nenhuma notificação ainda. Adicione sua primeira!
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Adicione seu primeiro site</h3>
                <p className="text-gray-600 mb-6">
                  Comece adicionando o site onde você quer exibir as notificações
                </p>
                <button 
                  onClick={() => setShowNewSite(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
                >
                  <Plus className="w-5 h-5" /> Adicionar Site
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal - New Site */}
      {showNewSite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Adicionar Site</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Site</label>
                <input
                  type="text"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Minha Loja"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domínio</label>
                <input
                  type="text"
                  value={newSiteDomain}
                  onChange={(e) => setNewSiteDomain(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="minhaloja.com.br"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowNewSite(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={createSite}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal - New Notification */}
      {showNewNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nova Notificação</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="purchase">Compra</option>
                  <option value="signup">Inscrição</option>
                  <option value="review">Avaliação</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={newNotification.name}
                  onChange={(e) => setNewNotification({ ...newNotification, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Maria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização (opcional)</label>
                <input
                  type="text"
                  value={newNotification.location}
                  onChange={(e) => setNewNotification({ ...newNotification, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ação</label>
                <input
                  type="text"
                  value={newNotification.action}
                  onChange={(e) => setNewNotification({ ...newNotification, action: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="comprou"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item/Produto</label>
                <input
                  type="text"
                  value={newNotification.item}
                  onChange={(e) => setNewNotification({ ...newNotification, item: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Curso de Marketing"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowNewNotification(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={createNotification}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
