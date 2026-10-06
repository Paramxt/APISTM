import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, UserPlus, Settings, X, Boxes } from 'lucide-react'

const nav = [
  { to: '/', label: 'แดชบอร์ด', icon: LayoutDashboard, end: true },
  { to: '/users', label: 'ผู้ใช้งาน', icon: Users, end: true },
  { to: '/users/new', label: 'เพิ่มผู้ใช้', icon: UserPlus, end: true },
  { to: '/settings', label: 'ตั้งค่า', icon: Settings, end: true },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* ฉากหลังตอนเปิดเมนูบนมือถือ */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 md:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-slate-300 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 text-white">
            <Boxes className="h-6 w-6 text-indigo-400" />
            <span className="text-lg font-semibold">Mockup UI</span>
          </div>
          <button className="md:hidden" onClick={onClose} aria-label="ปิดเมนู">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
