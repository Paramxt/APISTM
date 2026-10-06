import { Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, UserPlus, Settings, X, ArrowLeft } from 'lucide-react'
import type { Project } from '../../projects/ProjectContext'

const nav = [
  { to: '', label: 'แดชบอร์ด', icon: LayoutDashboard },
  { to: '/users', label: 'ผู้ใช้งาน', icon: Users },
  { to: '/users/new', label: 'เพิ่มผู้ใช้', icon: UserPlus },
  { to: '/settings', label: 'ตั้งค่า', icon: Settings },
  { to: '/datasources', label: 'Data Source', icon: Settings },
]

interface Props {
  project: Project
  base: string
  open: boolean
  onClose: () => void
}

export default function Sidebar({ project, base, open, onClose }: Props) {
  return (
    <>
      {/* ฉากหลังตอนเปิดเมนูบนมือถือ */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 md:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-slate-300 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex min-w-0 items-center gap-2 text-white">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 font-semibold ring-1 ring-inset ring-white/20">
              {project.name.charAt(0)}
            </span>
            <span className="truncate font-semibold">{project.name}</span>
          </div>
          <button className="md:hidden" onClick={onClose} aria-label="ปิดเมนู">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={base + to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-600 text-white ring-1 ring-inset ring-white/20' : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-slate-800 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            กลับไปเลือกโปรเจกต์
          </Link>
        </div>
      </aside>
    </>
  )
}
