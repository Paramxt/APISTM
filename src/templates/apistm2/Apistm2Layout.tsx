import { Routes, Route, Navigate, Link, NavLink } from 'react-router-dom'
import { ArrowLeft, Bell, LayoutDashboard, Database, Network, UsersRound } from 'lucide-react'
import type { LayoutProps } from '../types'
import Dashboard from './Dashboard'
import DataSources from './DataSources'
import GroupApi from './GroupApi'
import DynamicApi from './DynamicApi'

const nav = [
  { to: '', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/datasources', label: 'Data Sources', icon: Database },
  { to: '/group-api', label: 'Group API', icon: UsersRound },
  { to: '/dynamic-api', label: 'Dynamic API', icon: Network },
]

// Template ระบบจัดการ API (ดีไซน์ 2): แถบเมนูด้านบน + การ์ดโทนสีครีม
export default function Apistm2Layout({ project, base }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <header className="border-b border-black/10 bg-[#f9f7f2]">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4 md:px-8">
          <Link to="/" className="rounded-lg p-1.5 text-slate-500 hover:bg-black/5" aria-label="กลับไปเลือกโปรเจกต์">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="truncate text-xl font-bold text-slate-900">{project.name}</span>
          <nav className="ml-4 hidden items-center gap-6 whitespace-nowrap text-sm font-medium text-slate-500 lg:flex">
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={base + to}
                end
                className={({ isActive }) =>
                  `border-b-2 pb-1 pt-1 transition-colors ${isActive ? 'border-slate-900 text-slate-900' : 'border-transparent hover:text-slate-800'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button className="rounded-full bg-black/5 p-2.5 text-slate-600 hover:bg-black/10" aria-label="การแจ้งเตือน">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                AD
              </div>
              <div className="hidden text-sm sm:block">
                <div className="font-semibold text-slate-900">Admin</div>
                <div className="text-xs text-slate-500">Operations manager</div>
              </div>
            </div>
          </div>
        </div>
        <nav className="flex gap-5 overflow-x-auto px-4 pb-3 text-sm font-medium text-slate-500 md:px-8 lg:hidden">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={base + to}
              end
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 ${isActive ? 'bg-slate-900 text-white' : 'bg-black/5'}`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="datasources" element={<DataSources />} />
          <Route path="group-api" element={<GroupApi />} />
          <Route path="dynamic-api/*" element={<DynamicApi />} />
          <Route path="*" element={<Navigate to={base} replace />} />
        </Routes>
      </main>
    </div>
  )
}
