import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { LayoutProps } from '../types'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Dashboard from './Dashboard'
import Users from './Users'
import UserForm from './UserForm'
import Settings from './Settings'
import DataSources from './DataSources'

// Template "ระบบหลังบ้าน": เมนูด้านข้าง + หน้าต่าง ๆ
export default function AdminLayout({ project, base }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar project={project} base={base} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="settings" element={<Settings />} />
            <Route path="datasources" element={<DataSources />} />
            <Route path="*" element={<Navigate to={base} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
