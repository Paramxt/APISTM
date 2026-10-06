import { Link, NavLink } from 'react-router-dom'
import { ArrowLeft, Database, LayoutDashboard, LogOut, Network, UsersRound, X } from 'lucide-react'
import type { Project } from '../../projects/ProjectContext'

const nav = [
  { to: '', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/datasources', label: 'Data Sources', icon: Database },
  { to: '/group-api', label: 'Group API', icon: UsersRound },
  { to: '/dynamic-api', label: 'Dynamic API', icon: Network },
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
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-200 bg-[#fff7f3] text-slate-700 shadow-md transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-300 px-4">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="text-3xl font-semibold text-brand-500">STM</span>
            <span className="truncate text-sm font-semibold text-slate-900">Dynamic API</span>
          </div>
          <button className="md:hidden" onClick={onClose} aria-label="ปิดเมนู">
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>
        <div className="flex items-center gap-3 border-b border-zinc-300 px-4 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-xl text-white">●</div>
          <div className="min-w-0 flex-1"><div className="font-semibold">Admin</div><div className="truncate text-xs">admin@stm.co.th</div></div>
          <LogOut className="h-7 w-7 text-slate-700" />
        </div>
        <nav className="mt-2 space-y-1 px-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={base + to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-100 text-brand-500' : 'hover:bg-brand-50 hover:text-brand-700'
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
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-brand-50 hover:text-brand-700"
          >
            <ArrowLeft className="h-5 w-5" />
            กลับไปเลือกโปรเจกต์
          </Link>
        </div>
      </aside>
    </>
  )
}
