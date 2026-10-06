// ข้อมูลจำลองสำหรับ mockup — Data Source, Group API, Dynamic API ใช้ชุดเดียวกับ apistm2
import { dataSources, dynamicApis, generateToken, groupApis, type DataSource, type Status } from '../mock'

export type { DataSource, Status }
export { dataSources, dynamicApis, generateToken, groupApis }

// จำนวนเรียกใช้ API รายชั่วโมง เทียบวันนี้กับเมื่อวาน
export const hourlyLabels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00']
export const hourlyRequests = {
  today: [80, 260, 380, 330, 520, 450, 610, 540, 880],
  yesterday: [40, 150, 220, 610, 350, 560, 470, 690, 760],
}

// จำนวนเรียกใช้ API รายวัน แยกตามผลลัพธ์
export const weeklyCalls = [
  { label: 'จ.', success: 110, slow: 20, error: 8 },
  { label: 'อ.', success: 150, slow: 20, error: 10 },
  { label: 'พ.', success: 130, slow: 20, error: 12 },
  { label: 'พฤ.', success: 145, slow: 25, error: 14 },
  { label: 'ศ.', success: 100, slow: 17, error: 18 },
  { label: 'ส.', success: 115, slow: 20, error: 20 },
  { label: 'อา.', success: 118, slow: 18, error: 20 },
]

// เวลาตอบสนองล่าสุดของแต่ละ Data Source (0 = เชื่อมต่อไม่ได้)
export const responseTimeMs: Record<number, number> = { 1: 120, 2: 180, 3: 240, 4: 0, 5: 150 }

export type ActivityKind = 'create' | 'token' | 'error' | 'update'

export const activities: { kind: ActivityKind; text: string; tag: string; time: string }[] = [
  { kind: 'create', text: 'สร้าง Dynamic API "Get Monthly Report"', tag: 'สร้างใหม่', time: '5 นาทีที่แล้ว' },
  { kind: 'token', text: 'สร้าง Token ใหม่ให้ ERS Service', tag: 'Token', time: '1 ชม.ที่แล้ว' },
  { kind: 'error', text: 'Legacy CRM เชื่อมต่อไม่สำเร็จ', tag: 'ผิดพลาด', time: '3 ชม.ที่แล้ว' },
  { kind: 'update', text: 'อัปเดต Get Employees เป็น v3.2', tag: 'อัปเดต', time: 'เมื่อวาน' },
]

export const apiCallsToday = { value: '12.4K', change: '+8.2%', trend: [30, 42, 35, 60, 48, 72, 55, 90, 70, 96] }
