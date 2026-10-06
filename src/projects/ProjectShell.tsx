import { Navigate, useParams } from 'react-router-dom'
import { useProjects } from './ProjectContext'
import { brandVars } from './themes'
import AdminLayout from '../templates/admin/AdminLayout'
import ApiStmLayout from '../templates/apistm/AdminLayout'
import ApiStm2Layout from '../templates/apistm2/Apistm2Layout'
import ApiStm3Layout from '../templates/apistm3/Apistm3Layout'
import ApiStm4Layout from '../templates/apistm4/Apistm4Layout'
import KanbanLayout from '../templates/kanban/KanbanLayout'
import StoreLayout from '../templates/store/StoreLayout'

// เลือก layout ตาม template ของโปรเจกต์ — เพิ่ม template ใหม่ได้ที่นี่
const layouts = {
  admin: AdminLayout,
  apistm: ApiStmLayout,
  apistm2: ApiStm2Layout,
  apistm3: ApiStm3Layout,
  apistm4: ApiStm4Layout,
  kanban: KanbanLayout,
  store: StoreLayout,
}

export default function ProjectShell() {
  const { projectId } = useParams()
  const { projects } = useProjects()
  const project = projects.find((p) => p.id === projectId)

  if (!project) return <Navigate to="/" replace />

  const Layout = layouts[project.template]
  return (
    <div style={brandVars(project.color)}>
      <Layout project={project} base={`/p/${project.id}`} />
    </div>
  )
}
