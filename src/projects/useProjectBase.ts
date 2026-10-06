import { useParams } from 'react-router-dom'

/** path ตั้งต้นของโปรเจกต์ปัจจุบัน เช่น /p/hr-system */
export function useProjectBase() {
  const { projectId } = useParams()
  return `/p/${projectId}`
}
