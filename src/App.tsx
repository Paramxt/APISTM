import { Routes, Route, Navigate } from 'react-router-dom'
import ProjectList from './projects/ProjectList'
import ProjectShell from './projects/ProjectShell'

export default function App() {
  return (
    <Routes>
      {/* หน้าแรก: เลือก/สร้างโปรเจกต์ */}
      <Route path="/" element={<ProjectList />} />
      {/* หน้าภายในโปรเจกต์ — หน้าตาขึ้นกับ template ของโปรเจกต์นั้น */}
      <Route path="/p/:projectId/*" element={<ProjectShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
