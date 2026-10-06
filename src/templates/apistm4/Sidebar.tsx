import { Link, NavLink } from 'react-router-dom'
import { ArrowLeft, ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import type { Project } from '../../projects/ProjectContext'
import { nav } from './nav'

interface Props {
  project: Project
  base: string
  open: boolean
  collapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

export default function Sidebar({ project, base, open, collapsed, onClose, onToggleCollapse }: Props) {
  // หุบเมนูได้เฉพาะจอ md ขึ้นไป บนมือถือแสดงเต็มเสมอ
  const hideWhenCollapsed = collapsed ? 'md:hidden' : ''

  return (
    <>
      {/* ฉากหลังตอนเปิดเมนูบนมือถือ */}
      <div className={`fixed inset-0 z-30 bg-slate-900/40 md:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 transform flex-col border-r border-slate-200 bg-slate-50 transition-all md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          collapsed ? 'md:w-16' : ''
        } ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className={`flex h-16 items-center gap-2 px-4 ${collapsed ? 'md:justify-center md:px-0' : ''}`}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">{project.name.charAt(0)}</span>
          <span className={`min-w-0 flex-1 truncate text-sm font-semibold text-slate-900 ${hideWhenCollapsed}`}>{project.name}</span>
          <button onClick={onToggleCollapse} className={`hidden rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 md:block ${collapsed ? 'md:hidden' : ''}`} aria-label="หุบเมนู">
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button className="md:hidden" onClick={onClose} aria-label="ปิดเมนู">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        {collapsed && (
          <button onClick={onToggleCollapse} className="mx-auto hidden rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 md:block" aria-label="ขยายเมนู">
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={base + to}
              end
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${collapsed ? 'md:justify-center md:px-0' : ''} ${
                  isActive ? 'bg-brand-100 font-medium text-brand-700' : 'text-slate-600 hover:bg-slate-200/60'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className={hideWhenCollapsed}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-slate-200 p-3">
          <Link
            to="/"
            title={collapsed ? 'กลับไปเลือกโปรเจกต์' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-200/60 ${collapsed ? 'md:justify-center md:px-0' : ''}`}
          >
            <ArrowLeft className="h-[18px] w-[18px] shrink-0" />
            <span className={hideWhenCollapsed}>กลับไปเลือกโปรเจกต์</span>
          </Link>
          <div className={`flex items-center gap-2.5 px-2 py-1.5 ${collapsed ? 'md:justify-center md:px-0' : ''}`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">AD</span>
            <div className={`min-w-0 ${hideWhenCollapsed}`}>
              <div className="text-sm font-medium text-slate-800">Admin</div>
              <div className="truncate text-xs text-slate-400">admin@stm.co.th</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
