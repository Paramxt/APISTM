import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ColorId, TemplateId } from './themes'

export interface Project {
  id: string
  name: string
  description: string
  template: TemplateId
  color: ColorId
  createdAt: string
}

const STORAGE_KEY = 'mockup-ui.projects'

// โปรเจกต์ตัวอย่างตอนเปิดครั้งแรก
const seed: Project[] = [
  { id: 'hr-system', name: 'ระบบบุคคล (HR)', description: 'จัดการข้อมูลพนักงานและสิทธิ์การใช้งาน', template: 'admin', color: 'indigo', createdAt: '2026-09-01' },
  { id: 'sprint-board', name: 'Sprint Board', description: 'ติดตามงานของทีมพัฒนาแต่ละสปรินต์', template: 'kanban', color: 'emerald', createdAt: '2026-09-10' },
  { id: 'coffee-shop', name: 'ร้านกาแฟออนไลน์', description: 'หน้าร้านขายเมล็ดกาแฟและอุปกรณ์', template: 'store', color: 'amber', createdAt: '2026-09-18' },
  { id: 'api-manager', name: 'ระบบจัดการ API', description: 'จัดการ Data Source และ API ของระบบ STM', template: 'apistm', color: 'sky', createdAt: '2026-09-20' },
  { id: 'api-insights', name: 'API Insights', description: 'แดชบอร์ดสรุปผลและจัดการ Data Source แบบใหม่', template: 'apistm2', color: 'violet', createdAt: '2026-09-22' },
  { id: 'api-console', name: 'API Console', description: 'ตาราง Data Source แบบเต็มจอ เลือกและจัดการหลายรายการ', template: 'apistm3', color: 'amber', createdAt: '2026-09-25' },
  { id: 'api-analytics', name: 'API Analytics', description: 'แดชบอร์ดกราฟวิเคราะห์การใช้งาน API และจัดการข้อมูล', template: 'apistm4', color: 'sky', createdAt: '2026-09-25' },
]

function load(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Project[]
  } catch {
    /* ใช้ค่าเริ่มต้นแทน */
  }
  return seed
}

interface Ctx {
  projects: Project[]
  addProject: (p: Omit<Project, 'id' | 'createdAt'>) => Project
  removeProject: (id: string) => void
  resetProjects: () => void
}

const ProjectContext = createContext<Ctx | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    } catch {
      /* เบราว์เซอร์ไม่อนุญาตให้บันทึก — ข้อมูลจะอยู่แค่ในหน้านี้ */
    }
  }, [projects])

  function addProject(p: Omit<Project, 'id' | 'createdAt'>) {
    const project: Project = {
      ...p,
      id: `${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setProjects((prev) => [project, ...prev])
    return project
  }

  function removeProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  function resetProjects() {
    setProjects(seed)
  }

  return (
    <ProjectContext.Provider value={{ projects, addProject, removeProject, resetProjects }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjects ต้องใช้ภายใน <ProjectProvider>')
  return ctx
}
