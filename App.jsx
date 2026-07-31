import React, { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  Edit3,
  LayoutDashboard,
  LogOut,
  Menu,
  MoonStar,
  Package,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShoppingCart,
  SunMedium,
  Trash2,
  Users
} from 'lucide-react'
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const LS_KEY = 'new4-pages-state-v2'

const money = (v) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
}).format(v || 0)

const seed = {
  session: null,
  products: [
    { id: 'P1', title: 'Starter Account', category: 'Game', price: 490000, stock: 12, active: true, description: 'Tài khoản khởi đầu phù hợp người mới.' },
    { id: 'P2', title: 'Pro Account', category: 'Game', price: 1290000, stock: 6, active: true, description: 'Tài khoản nâng cao, nhiều tính năng.' },
    { id: 'P3', title: 'Premium Account', category: 'Service', price: 2590000, stock: 3, active: false, description: 'Gói premium cho nhu cầu cao.' }
  ],
  orders: [
    { id: 'ORD-1001', customer: 'customer@example.com', product: 'Pro Account', amount: 1290000, status: 'COMPLETED' },
    { id: 'ORD-1002', customer: 'user2@example.com', product: 'Starter Account', amount: 490000, status: 'PENDING' },
    { id: 'ORD-1003', customer: 'user3@example.com', product: 'Premium Account', amount: 2590000, status: 'PROCESSING' }
  ],
  users: [
    { id: 'U1', email: 'admin@example.com', name: 'Administrator', role: 'ADMIN' },
    { id: 'U2', email: 'customer@example.com', name: 'Customer One', role: 'USER' },
    { id: 'U3', email: 'user2@example.com', name: 'Customer Two', role: 'USER' }
  ]
}

const monthly = [
  { month: 'Jan', revenue: 22000 },
  { month: 'Feb', revenue: 28000 },
  { month: 'Mar', revenue: 34000 },
  { month: 'Apr', revenue: 30000 },
  { month: 'May', revenue: 42000 },
  { month: 'Jun', revenue: 51000 }
]

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'shop', label: 'Shop', icon: ShoppingCart },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: RefreshCw },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings }
]

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? { ...seed, ...JSON.parse(raw) } : seed
  } catch {
    return seed
  }
}

function Card({ title, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</div>
      {sub ? <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{sub}</div> : null}
    </div>
  )
}

function Badge({ children, tone = 'slate' }) {
  const toneCls = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    green: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
  }
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneCls[tone]}`}>{children}</span>
}

export default function App() {
  const [dark, setDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [view, setView] = useState('dashboard')
  const [authMode, setAuthMode] = useState('login')
  const [state, setState] = useState(loadState)
  const [authForm, setAuthForm] = useState({ email: 'admin@example.com', password: 'Admin@123', name: '' })
  const [productForm, setProductForm] = useState({ title: '', category: 'Game', price: '', stock: '', active: true, description: '' })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(state)) }, [state])

  const session = state.session
  const isAdmin = session?.role === 'ADMIN'
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim()
    return state.products.filter((p) => [p.title, p.category, p.description].join(' ').toLowerCase().includes(q))
  }, [state.products, search])

  const stats = useMemo(() => ({
    revenue: state.orders.reduce((sum, o) => sum + o.amount, 0),
    totalOrders: state.orders.length,
    totalUsers: state.users.length,
    growth: 18.4
  }), [state.orders, state.users])

  const activeProducts = state.products.filter((p) => p.active)
  const completedOrders = state.orders.filter((o) => o.status === 'COMPLETED').length

  const authSubmit = (e) => {
    e.preventDefault()
    const { email, password, name } = authForm

    if (authMode === 'login') {
      if (email === 'admin@example.com' && password === 'Admin@123') {
        setState((s) => ({ ...s, session: { email, name: 'Administrator', role: 'ADMIN' } }))
        setMessage('Đăng nhập admin thành công')
        return
      }
      const user = state.users.find((u) => u.email === email)
      if (user) {
        setState((s) => ({ ...s, session: { email: user.email, name: user.name, role: user.role } }))
        setMessage('Đăng nhập user thành công')
        return
      }
      setMessage('Sai email hoặc mật khẩu')
      return
    }

    if (!email || !password || !name) {
      setMessage('Vui lòng nhập đủ thông tin')
      return
    }
    if (state.users.some((u) => u.email === email)) {
      setMessage('Email đã tồn tại')
      return
    }
    const newUser = { id: `U${Date.now()}`, email, name, role: 'USER' }
    setState((s) => ({ ...s, users: [newUser, ...s.users], session: { email, name, role: 'USER' } }))
    setMessage('Đăng ký thành công')
  }

  const logout = () => {
    setState((s) => ({ ...s, session: null }))
    setView('dashboard')
    setMessage('Đã đăng xuất')
  }

  const saveProduct = (e) => {
    e.preventDefault()
    const { title, category, price, stock, active, description } = productForm
    if (!title || !category || !price) {
      setMessage('Thiếu dữ liệu sản phẩm')
      return
    }
    if (editingId) {
      setState((s) => ({
        ...s,
        products: s.products.map((p) => p.id === editingId ? { ...p, title, category, price: Number(price), stock: Number(stock || 0), active, description } : p)
      }))
      setMessage('Đã cập nhật sản phẩm')
    } else {
      setState((s) => ({
        ...s,
        products: [{ id: `P${Date.now()}`, title, category, price: Number(price), stock: Number(stock || 0), active, description }, ...s.products]
      }))
      setMessage('Đã tạo sản phẩm')
    }
    setEditingId(null)
    setProductForm({ title: '', category: 'Game', price: '', stock: '', active: true, description: '' })
  }

  const addOrder = () => {
    if (!state.products.length) {
      setMessage('Chưa có sản phẩm')
      return
    }
    const p = state.products[0]
    setState((s) => ({
      ...s,
      orders: [{ id: `ORD-${Date.now()}`, customer: session?.email || 'guest@example.com', product: p.title, amount: p.price, status: 'PENDING' }, ...s.orders]
    }))
    setMessage('Đã tạo đơn hàng')
  }

  const updateOrderStatus = (id, status) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o))
    }))
  }

  const updateUserRole = (id, role) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === id ? { ...u, role } : u))
    }))
  }

  const deleteProduct = (id) => setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }))
  const deleteOrder = (id) => setState((s) => ({ ...s, orders: s.orders.filter((o) => o.id !== id) }))
  const deleteUser = (id) => setState((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) }))

  const startEdit = (p) => {
    setEditingId(p.id)
    setProductForm({
      title: p.title,
      category: p.category,
      price: p.price,
      stock: p.stock,
      active: p.active,
      description: p.description
    })
    setView('products')
  }

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-screen">
          <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white/95 p-4 backdrop-blur-xl transition-transform dark:border-slate-800 dark:bg-slate-950/95 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold tracking-tight">New4</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Optimized Pages</div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 lg:hidden" aria-label="Close sidebar">×</button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = view === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => { setView(item.id); setSidebarOpen(false) }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-900'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-sm font-semibold">{session ? session.name : 'Guest'}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{session ? session.role : 'Not logged in'}</div>
              {session ? (
                <button onClick={logout} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900">
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              ) : null}
            </div>
          </aside>

          <div className="flex-1">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
              <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
                <button onClick={() => setSidebarOpen(true)} className="rounded-2xl p-2 lg:hidden" aria-label="Open sidebar"><Menu className="h-5 w-5" /></button>

                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm / đơn hàng / người dùng..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none transition placeholder:text-slate-400 focus:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                  />
                </div>

                <button onClick={() => setDark(v => !v)} className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Toggle dark mode">
                  {dark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
                </button>

                <button className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
                </button>
              </div>
            </header>

            <main className="p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl space-y-6">
                {message ? <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">{message}</div> : null}

                {view === 'dashboard' && (
                  <>
                    {!session ? (
                      <section className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                          <div className="mb-4 flex gap-2">
                            <button onClick={() => setAuthMode('login')} className={`rounded-xl px-4 py-2 text-sm font-medium ${authMode === 'login' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800'}`}>Đăng nhập</button>
                            <button onClick={() => setAuthMode('register')} className={`rounded-xl px-4 py-2 text-sm font-medium ${authMode === 'register' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800'}`}>Đăng ký</button>
                          </div>

                          <form onSubmit={authSubmit} className="space-y-3">
                            {authMode === 'register' ? (
                              <input
                                value={authForm.name}
                                onChange={(e) => setAuthForm(v => ({ ...v, name: e.target.value }))}
                                placeholder="Họ tên"
                                className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-800"
                              />
                            ) : null}
                            <input
                              value={authForm.email}
                              onChange={(e) => setAuthForm(v => ({ ...v, email: e.target.value }))}
                              placeholder="Email"
                              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-800"
                            />
                            <input
                              type="password"
                              value={authForm.password}
                              onChange={(e) => setAuthForm(v => ({ ...v, password: e.target.value }))}
                              placeholder="Mật khẩu"
                              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-800"
                            />
                            <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white dark:bg-white dark:text-slate-900">
                              {authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
                            </button>
                          </form>

                          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            <div className="font-semibold text-slate-900 dark:text-white">Tài khoản admin</div>
                            <div className="mt-2">admin@example.com / Admin@123</div>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <Card title="Tổng doanh thu" value={money(stats.revenue)} sub="Từ orders lưu localStorage" />
                          <Card title="Tổng đơn hàng" value={stats.totalOrders.toLocaleString('vi-VN')} sub="Dữ liệu mô phỏng" />
                          <Card title="Số người dùng" value={stats.totalUsers.toLocaleString('vi-VN')} sub="Có thể chỉnh sửa" />
                          <Card title="Tỷ lệ tăng trưởng" value={`${stats.growth}%`} sub="Dashboard hiện đại" />
                        </div>
                      </section>
                    ) : (
                      <>
                        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <Card title="Tổng doanh thu" value={money(stats.revenue)} sub="Tổng tiền từ đơn hàng" />
                          <Card title="Tổng đơn hàng" value={stats.totalOrders.toLocaleString('vi-VN')} sub="Toàn bộ đơn hàng" />
                          <Card title="Số người dùng" value={stats.totalUsers.toLocaleString('vi-VN')} sub="Users trong hệ thống" />
                          <Card title="Hoàn tất" value={`${stats.totalOrders ? Math.round((completedOrders / stats.totalOrders) * 100) : 0}%`} sub="COMPLETED rate" />
                        </section>

                        <section className="grid gap-6 xl:grid-cols-5">
                          <div className="xl:col-span-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-5 flex items-center justify-between">
                              <div>
                                <h2 className="text-lg font-semibold">Doanh thu theo tháng</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Biểu đồ trực quan cho dashboard</p>
                              </div>
                              <Badge tone="blue">Live</Badge>
                            </div>

                            <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthly}>
                                  <defs>
                                    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopOpacity={0.35} />
                                      <stop offset="95%" stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                  <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                                  <Tooltip formatter={(v) => money(v)} />
                                  <Area type="monotone" dataKey="revenue" strokeWidth={3} fillOpacity={1} fill="url(#fill)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                              <div>
                                <h2 className="text-lg font-semibold">Shop bán acc</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Dữ liệu mẫu để dễ chỉnh sửa</p>
                              </div>
                              <button onClick={addOrder} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900">
                                <Plus className="h-4 w-4" /> Tạo đơn
                              </button>
                            </div>

                            <div className="mt-4 space-y-3">
                              {activeProducts.map((p) => (
                                <div key={p.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <div className="font-semibold">{p.title}</div>
                                      <div className="text-xs text-slate-500 dark:text-slate-400">{p.category}</div>
                                    </div>
                                    <Badge tone={p.active ? 'green' : 'amber'}>{p.active ? 'Active' : 'Hidden'}</Badge>
                                  </div>
                                  <div className="mt-3 flex items-center justify-between">
                                    <div className="font-semibold">{money(p.price)}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Kho: {p.stock}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </section>
                      </>
                    )}
                  </>
                )}

                {view === 'shop' && (
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Trang chủ shop bán acc</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Responsive, dễ chỉnh sửa, dữ liệu nằm trong App.jsx</p>
                      </div>
                      <Badge tone="blue">Vite + Tailwind</Badge>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {filteredProducts.map((p) => (
                        <div key={p.id} className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold">{p.title}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{p.category}</div>
                            </div>
                            <Badge tone={p.active ? 'green' : 'amber'}>{p.active ? 'Active' : 'Hidden'}</Badge>
                          </div>
                          <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">{p.description}</div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="font-semibold">{money(p.price)}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Kho: {p.stock}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {view === 'products' && (
                  <section className="grid gap-6 xl:grid-cols-3">
                    <form onSubmit={saveProduct} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</h2>
                        <Badge tone="slate">{editingId ? 'Editing' : 'New'}</Badge>
                      </div>

                      <div className="mt-4 space-y-3">
                        <input
                          value={productForm.title}
                          onChange={(e) => setProductForm(v => ({ ...v, title: e.target.value }))}
                          placeholder="Tên sản phẩm"
                          className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-800"
                        />
                        <input
                          value={productForm.category}
                          onChange={(e) => setProductForm(v => ({ ...v, category: e.target.value }))}
                          placeholder="Danh mục"
                          className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-800"
                        />
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm(v => ({ ...v, description: e.target.value }))}
                          placeholder="Mô tả"
                          className="min-h-28 w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-800"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm(v => ({ ...v, price: e.target.value }))}
                            placeholder="Giá"
                            className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-800"
                          />
                          <input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm(v => ({ ...v, stock: e.target.value }))}
                            placeholder="Kho"
                            className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none dark:border-slate-800"
                          />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <input
                            type="checkbox"
                            checked={productForm.active}
                            onChange={(e) => setProductForm(v => ({ ...v, active: e.target.checked }))}
                          />
                          Active
                        </label>

                        <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white dark:bg-white dark:text-slate-900">
                          {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          {editingId ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                        </button>

                        {editingId ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null)
                              setProductForm({ title: '', category: 'Game', price: '', stock: '', active: true, description: '' })
                            }}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-medium dark:border-slate-800"
                          >
                            Hủy
                          </button>
                        ) : null}
                      </div>
                    </form>

                    <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-semibold">Quản lý sản phẩm</h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Edit / delete / lọc nhanh</p>
                        </div>
                        <Badge tone="blue">{filteredProducts.length} items</Badge>
                      </div>

                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              <th className="px-4 py-3">Tên</th>
                              <th className="px-4 py-3">Giá</th>
                              <th className="px-4 py-3">Kho</th>
                              <th className="px-4 py-3">Trạng thái</th>
                              <th className="px-4 py-3">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredProducts.map((p) => (
                              <tr key={p.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="px-4 py-4">
                                  <div className="font-medium text-slate-900 dark:text-white">{p.title}</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">{p.category}</div>
                                </td>
                                <td className="px-4 py-4">{money(p.price)}</td>
                                <td className="px-4 py-4">{p.stock}</td>
                                <td className="px-4 py-4">
                                  <Badge tone={p.active ? 'green' : 'amber'}>{p.active ? 'Active' : 'Hidden'}</Badge>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex gap-2">
                                    <button onClick={() => startEdit(p)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-800" title="Edit">
                                      <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => deleteProduct(p.id)} className="rounded-xl border border-slate-200 p-2 text-rose-600 dark:border-slate-800" title="Delete">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                )}

                {view === 'orders' && (
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Quản lý đơn hàng</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Đơn hàng lưu localStorage và dễ chỉnh sửa</p>
                      </div>
                      <button onClick={addOrder} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900">
                        <Plus className="h-4 w-4" />
                        Tạo đơn mẫu
                      </button>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="px-4 py-3">Mã</th>
                            <th className="px-4 py-3">Khách hàng</th>
                            <th className="px-4 py-3">Sản phẩm</th>
                            <th className="px-4 py-3">Tiền</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {state.orders.map((o) => (
                            <tr key={o.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="px-4 py-4 text-sm font-medium">{o.id}</td>
                              <td className="px-4 py-4 text-sm">{o.customer}</td>
                              <td className="px-4 py-4 text-sm">{o.product}</td>
                              <td className="px-4 py-4 text-sm font-medium">{money(o.amount)}</td>
                              <td className="px-4 py-4">
                                <select
                                  value={o.status}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                  className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-800"
                                >
                                  {['PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELED'].map((s) => (
                                    <option key={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-4">
                                <button onClick={() => deleteOrder(o.id)} className="rounded-xl border border-slate-200 p-2 text-rose-600 dark:border-slate-800" title="Delete">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {view === 'users' && (
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Quản lý người dùng</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Đổi role, xóa user, dễ chỉnh sửa</p>
                      </div>
                      <Badge tone="slate">{state.users.length} users</Badge>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Tên</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {state.users.map((u) => (
                            <tr key={u.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="px-4 py-4 text-sm font-medium">{u.email}</td>
                              <td className="px-4 py-4 text-sm">{u.name}</td>
                              <td className="px-4 py-4">
                                <select
                                  value={u.role}
                                  onChange={(e) => updateUserRole(u.id, e.target.value)}
                                  className="rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-800"
                                >
                                  <option>ADMIN</option>
                                  <option>USER</option>
                                </select>
                              </td>
                              <td className="px-4 py-4">
                                {u.email === 'admin@example.com' ? (
                                  <Badge tone="blue">Protected</Badge>
                                ) : (
                                  <button onClick={() => deleteUser(u.id)} className="rounded-xl border border-slate-200 p-2 text-rose-600 dark:border-slate-800" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {view === 'settings' && (
                  <section className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                      <h2 className="text-lg font-semibold">Cài đặt giao diện</h2>
                      <div className="mt-4 space-y-3">
                        <button onClick={() => setDark((v) => !v)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left dark:border-slate-800">
                          Toggle dark mode
                        </button>
                        <button onClick={() => setState(seed)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left dark:border-slate-800">
                          Reset dữ liệu mẫu
                        </button>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                      <h2 className="text-lg font-semibold">Deploy checklist</h2>
                      <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <li>• Repo phải tên <code>New4</code> nếu dùng base hiện tại.</li>
                        <li>• Bật Pages bằng <strong>GitHub Actions</strong>.</li>
                        <li>• Upload đúng file gốc, không bọc thêm folder ngoài.</li>
                      </ul>
                    </div>
                  </section>
                )}
              </div>
            </main>
          </div>
        </div>

        {sidebarOpen ? (
          <button
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
            aria-label="Close sidebar overlay"
          />
        ) : null}
      </div>
    </div>
  )
}
