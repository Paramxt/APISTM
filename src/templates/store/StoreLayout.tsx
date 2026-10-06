import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Search, Star, X, Minus, Plus } from 'lucide-react'
import type { LayoutProps } from '../types'

// Template "หน้าร้านออนไลน์": แถบบนแบบร้านค้า + banner + กริดสินค้า + ตะกร้า

interface Product {
  id: number
  name: string
  category: string
  price: number
  rating: number
  emoji: string
}

const products: Product[] = [
  { id: 1, name: 'เมล็ดกาแฟคั่วกลาง 250g', category: 'เมล็ดกาแฟ', price: 320, rating: 4.8, emoji: '☕' },
  { id: 2, name: 'เมล็ดกาแฟคั่วเข้ม 250g', category: 'เมล็ดกาแฟ', price: 340, rating: 4.6, emoji: '🫘' },
  { id: 3, name: 'ดริปเปอร์เซรามิก', category: 'อุปกรณ์', price: 590, rating: 4.9, emoji: '🫖' },
  { id: 4, name: 'กาต้มน้ำคอห่าน', category: 'อุปกรณ์', price: 1290, rating: 4.7, emoji: '🍵' },
  { id: 5, name: 'แก้วเซรามิกทำมือ', category: 'แก้ว', price: 250, rating: 4.5, emoji: '🥛' },
  { id: 6, name: 'เครื่องบดมือหมุน', category: 'อุปกรณ์', price: 1890, rating: 4.8, emoji: '⚙️' },
  { id: 7, name: 'กระดาษกรอง 100 แผ่น', category: 'อุปกรณ์', price: 120, rating: 4.4, emoji: '📄' },
  { id: 8, name: 'แก้วใสสองชั้น', category: 'แก้ว', price: 390, rating: 4.6, emoji: '🧋' },
]

const categories = ['ทั้งหมด', ...Array.from(new Set(products.map((p) => p.category)))]
const baht = (n: number) => `฿${n.toLocaleString('th-TH')}`

export default function StoreLayout({ project }: LayoutProps) {
  const [category, setCategory] = useState('ทั้งหมด')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [cartOpen, setCartOpen] = useState(false)

  const shown = products.filter(
    (p) => (category === 'ทั้งหมด' || p.category === category) && p.name.includes(query),
  )
  const cartItems = products.filter((p) => cart[p.id])
  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const total = cartItems.reduce((sum, p) => sum + p.price * cart[p.id], 0)

  function change(id: number, delta: number) {
    setCart((prev) => {
      const qty = (prev[id] ?? 0) + delta
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* แถบด้านบน */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-8">
          <Link to="/" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="กลับไปเลือกโปรเจกต์">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="truncate text-lg font-bold text-brand-700">{project.name}</span>
          <div className="relative ml-auto hidden w-72 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative ml-auto rounded-full p-2 hover:bg-slate-100 md:ml-0"
            aria-label="ตะกร้าสินค้า"
          >
            <ShoppingBag className="h-6 w-6 text-slate-700" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        {/* Banner */}
        <section className="mt-6 overflow-hidden rounded-2xl bg-brand-600 px-6 py-10 text-white md:px-12 md:py-14">
          <p className="text-sm font-medium text-white/80">โปรโมชันเดือนนี้</p>
          <h2 className="mt-2 max-w-md text-3xl font-bold leading-tight md:text-4xl">ลด 20% ทุกเมล็ดกาแฟ</h2>
          <p className="mt-3 max-w-md text-white/85">{project.description || 'สินค้าคุณภาพ ส่งตรงถึงบ้าน'}</p>
          <button className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">
            ช้อปเลย
          </button>
        </section>

        {/* หมวดหมู่ */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* สินค้า */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {shown.map((p) => (
            <div key={p.id} className="group">
              <div className="flex aspect-square items-center justify-center rounded-xl bg-brand-50 text-6xl transition group-hover:bg-brand-100">
                {p.emoji}
              </div>
              <div className="mt-3 text-xs text-slate-500">{p.category}</div>
              <h3 className="text-sm font-medium text-slate-900">{p.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {p.rating}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold text-slate-900">{baht(p.price)}</span>
                <button
                  onClick={() => change(p.id, 1)}
                  className="rounded-full bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
                >
                  ใส่ตะกร้า
                </button>
              </div>
            </div>
          ))}
          {shown.length === 0 && <p className="col-span-full py-10 text-center text-slate-400">ไม่พบสินค้า</p>}
        </div>
      </main>

      {/* ตะกร้าสินค้า */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={() => setCartOpen(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">ตะกร้าสินค้า ({count})</h2>
              <button onClick={() => setCartOpen(false)} className="rounded p-1 hover:bg-slate-100" aria-label="ปิด">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cartItems.length === 0 && <p className="py-10 text-center text-sm text-slate-400">ยังไม่มีสินค้าในตะกร้า</p>}
              {cartItems.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-2xl">{p.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="text-sm text-slate-500">{baht(p.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => change(p.id, -1)} className="rounded-full border border-slate-200 p-1 hover:bg-slate-50" aria-label="ลด">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm">{cart[p.id]}</span>
                    <button onClick={() => change(p.id, 1)} className="rounded-full border border-slate-200 p-1 hover:bg-slate-50" aria-label="เพิ่ม">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 p-5">
              <div className="flex justify-between font-semibold">
                <span>รวม</span>
                <span>{baht(total)}</span>
              </div>
              <button
                disabled={count === 0}
                className="mt-4 w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
              >
                ชำระเงิน
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
