import { Link, NavLink } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronsUpDown, Database, HelpCircle, LayoutDashboard, MessageSquare, MoreHorizontal, Network, Search, Settings, UsersRound, X } from 'lucide-react'
import type { Project } from '../../projects/ProjectContext'

const nav = [
  { to: '', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/datasources', label: 'Data Sources', icon: Database },
  { to: '/group-api', label: 'Group API', icon: UsersRound },
  { to: '/dynamic-api', label: 'Dynamic API', icon: Network },
]

const workspaces = [
  { label: 'Production', dot: 'bg-emerald-500' },
  { label: 'Staging', dot: 'bg-amber-400' },
  { label: 'Development', dot: 'bg-sky-500' },
]

interface Props {
  project: Project
  base: string
  open: boolean
  onClose: () => void
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mt-5 flex items-center gap-2 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
      <ChevronDown className="h-3.5 w-3.5" /> {children}
    </div>
  )
}

const itemClass = 'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors'

export default function Sidebar({ project, base, open, onClose }: Props) {
  return (
    <>
      {/* ฉากหลังตอนเปิดเมนูบนมือถือ */}
      <div className={`fixed inset-0 z-30 bg-slate-900/40 md:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-slate-200 bg-slate-50 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-4 pt-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            {project.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">{project.name}</div>
            <div className="text-xs text-slate-400">Dynamic API</div>
          </div>
          <ChevronsUpDown className="hidden h-4 w-4 text-slate-400 md:block" />
          <button className="md:hidden" onClick={onClose} aria-label="ปิดเมนู">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="mx-4 mt-5 flex items-center gap-2 rounded-lg bg-slate-200/60 px-3 py-2 text-sm text-slate-500">
          <Search className="h-4 w-4" />
          <span className="flex-1">ค้นหา</span>
          <kbd className="rounded border border-slate-300 bg-white px-1.5 text-[10px]">/</kbd>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <SectionTitle>API Management</SectionTitle>
          <div className="mt-1 space-y-0.5">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={base + to}
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `${itemClass} ${isActive ? 'bg-white font-medium text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'}`
                }
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </div>

          {/* <SectionTitle>Environments</SectionTitle>
          <div className="mt-1 space-y-0.5">
            {workspaces.map((w) => (
              <span key={w.label} className={`${itemClass} text-slate-600`}>
                <span className={`h-2 w-2 rounded-sm ${w.dot}`} /> {w.label}
              </span>
            ))}
          </div>

          <SectionTitle>Support</SectionTitle>
          <div className="mt-1 space-y-0.5">
            <span className={`${itemClass} text-slate-600`}>
              <MessageSquare className="h-4 w-4" /> <span className="flex-1">Feedback</span>
              <span className="rounded border border-slate-200 bg-white px-1.5 text-[10px]">1</span>
            </span>
            <span className={`${itemClass} text-slate-600`}>
              <HelpCircle className="h-4 w-4" /> ศูนย์ช่วยเหลือ
            </span>
            <span className={`${itemClass} text-slate-600`}>
              <Settings className="h-4 w-4" /> ตั้งค่า
            </span>
            <Link to="/" className={`${itemClass} text-slate-600 hover:bg-white/70`}>
              <ArrowLeft className="h-4 w-4" /> กลับไปเลือกโปรเจกต์
            </Link>
          </div> */}
        </nav>

        <div className="flex items-center gap-3 border-t border-slate-200 px-4 py-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            AD
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-50" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-900">Admin</div>
            <div className="truncate text-xs text-slate-400">admin@stm.co.th</div>
          </div>
          <MoreHorizontal className="h-4 w-4 text-slate-400" />
        </div>
      </aside>
    </>
  )
}
