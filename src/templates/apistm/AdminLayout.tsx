import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { LayoutProps } from '../types'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import DataSources from './DataSources'
import GroupApi from './GroupApi'
import DynamicApi from './DynamicApi'

// Template ระบบจัดการ Dynamic API
export default function AdminLayout({ project, base }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar project={project} base={base} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
          <Routes>
            <Route path="datasources" element={<DataSources />} />
            <Route path="group-api" element={<GroupApi />} />
            <Route path="dynamic-api" element={<DynamicApi />} />
            <Route path="" element={<Navigate to="datasources" replace />} />
            <Route path="*" element={<Navigate to={base} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
