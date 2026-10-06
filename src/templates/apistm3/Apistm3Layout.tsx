import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { LayoutProps } from '../types'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import DataSources from './DataSources'
import GroupApi from './GroupApi'
import DynamicApi from './DynamicApi'

// Template ระบบจัดการ API (ดีไซน์ 3): sidebar สีอ่อน + ตารางข้อมูลเต็มจอแบบ CRM
export default function Apistm3Layout({ project, base }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const openMenu = () => setSidebarOpen(true)

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar project={project} base={base} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 flex-1 pb-24">
        <Routes>
          <Route index element={<Dashboard onMenuClick={openMenu} />} />
          <Route path="datasources" element={<DataSources onMenuClick={openMenu} />} />
          <Route path="group-api" element={<GroupApi onMenuClick={openMenu} />} />
          <Route path="dynamic-api/*" element={<DynamicApi onMenuClick={openMenu} />} />
          <Route path="*" element={<Navigate to={base} replace />} />
        </Routes>
      </main>
    </div>
  )
}
