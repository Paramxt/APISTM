import type { Project } from '../projects/ProjectContext'

/** props ที่ทุก layout ของ template ได้รับ */
export interface LayoutProps {
  project: Project
  base: string
}
