// ข้อมูลจำลองสำหรับ mockup — ใช้ข้อมูลชุดเดียวกับ apistm2 และเพิ่มคอลัมน์สำหรับตาราง
// Group API และ Dynamic API ใช้ชุดเดียวกับ apistm2
import { dataSources as baseSources, dynamicApis, generateToken, groupApis, processTracking, upcomingOperations, type Status } from '../apistm2/mock'

export type { Status }
export { dynamicApis, generateToken, groupApis, processTracking, upcomingOperations }

const extra: Record<number, { owner: string; environment: string; health: number; lastSync: string }> = {
  1: { owner: 'สมชาย ใจดี', environment: 'Production', health: 9, lastSync: '25 ก.ย. 2026' },
  2: { owner: 'นภา สดใส', environment: 'Production', health: 7, lastSync: '24 ก.ย. 2026' },
  3: { owner: 'วิชัย มั่นคง', environment: 'Staging', health: 6, lastSync: '24 ก.ย. 2026' },
  4: { owner: 'อนุชา พากเพียร', environment: 'Development', health: 3, lastSync: '10 ก.ย. 2026' },
  5: { owner: 'ปิยะ ศรีสุข', environment: 'Production', health: 8, lastSync: '23 ก.ย. 2026' },
}

export const dataSources = baseSources.map((s) => ({ ...s, ...extra[s.id] }))
export type DataSourceRow = (typeof dataSources)[number]

// ตัวเลขสรุปพร้อมข้อมูลกราฟเส้นเล็ก (sparkline)
export const stats = [
  { label: 'Data Sources', value: '18', change: '+2', up: true, trend: [8, 12, 9, 14, 11, 15, 13, 18] },
  { label: 'Active Connections', value: '14', change: '+1', up: true, trend: [10, 9, 12, 11, 13, 12, 14, 14] },
  { label: 'Sync Success Rate', value: '96%', change: '1.2%', up: true, trend: [88, 90, 86, 93, 91, 95, 94, 96] },
  { label: 'Failed Syncs', value: '3', change: '2', up: false, trend: [6, 4, 7, 5, 3, 6, 4, 3] },
]
