import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import type { LayoutProps } from '../types'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import DataSources from './DataSources'
import GroupApi from './GroupApi'
import DynamicApi from './DynamicApi'
import { nav } from './nav'

// Template ระบบจัดการ API (ดีไซน์ 4): sidebar หุบได้ + แดชบอร์ดกราฟหลายแบบ
export default function Apistm4Layout({ project, base }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()
  const title = nav.find((n) => n.to && pathname.startsWith(base + n.to))?.label ?? 'Dashboard'

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        project={project}
        base={base}
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 md:px-6">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)} aria-label="เปิดเมนู">
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          <div className="relative ml-auto hidden w-64 sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input placeholder="ค้นหา" className="w-full rounded-lg bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-100" />
          </div>
          <button className="relative ml-auto rounded-full p-2 text-slate-500 hover:bg-slate-100 sm:ml-0" aria-label="การแจ้งเตือน">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">3</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-full p-0.5 hover:bg-slate-100" aria-label="เมนูผู้ใช้">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">AD</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="datasources" element={<DataSources />} />
            <Route path="group-api" element={<GroupApi />} />
            <Route path="dynamic-api/*" element={<DynamicApi />} />
            <Route path="*" element={<Navigate to={base} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
