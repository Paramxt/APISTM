// ข้อมูลจำลองสำหรับ mockup — แก้ไขได้ตามต้องการ

export type Status = 'active' | 'pending' | 'inactive'

export interface User {
  id: number
  name: string
  email: string
  department: string
  role: string
  status: Status
  joined: string
}

export const users: User[] = [
  { id: 1, name: 'สมชาย ใจดี', email: 'somchai@example.com', department: 'ฝ่ายขาย', role: 'Manager', status: 'active', joined: '2025-01-12' },
  { id: 2, name: 'สมหญิง รักงาน', email: 'somying@example.com', department: 'ฝ่ายบัญชี', role: 'Staff', status: 'active', joined: '2025-03-04' },
  { id: 3, name: 'วิชัย มั่นคง', email: 'wichai@example.com', department: 'ฝ่ายไอที', role: 'Developer', status: 'pending', joined: '2025-05-20' },
  { id: 4, name: 'นภา สดใส', email: 'napa@example.com', department: 'ฝ่ายบุคคล', role: 'HR', status: 'active', joined: '2025-06-01' },
  { id: 5, name: 'ธนา ก้าวหน้า', email: 'thana@example.com', department: 'ฝ่ายไอที', role: 'Admin', status: 'inactive', joined: '2024-11-15' },
  { id: 6, name: 'กมล ศรีสุข', email: 'kamol@example.com', department: 'ฝ่ายขาย', role: 'Staff', status: 'active', joined: '2025-08-09' },
  { id: 7, name: 'ปรียา แสงทอง', email: 'preeya@example.com', department: 'ฝ่ายการตลาด', role: 'Staff', status: 'pending', joined: '2026-01-22' },
  { id: 8, name: 'อนุชา พากเพียร', email: 'anucha@example.com', department: 'ฝ่ายบัญชี', role: 'Manager', status: 'active', joined: '2024-09-30' },
]

export const stats = [
  { label: 'ผู้ใช้ทั้งหมด', value: '1,284', change: '+12%', up: true },
  { label: 'คำสั่งซื้อเดือนนี้', value: '342', change: '+4.5%', up: true },
  { label: 'รายได้ (บาท)', value: '฿ 486,200', change: '-2.1%', up: false },
  { label: 'งานค้าง', value: '27', change: '-8%', up: true },
]

export const monthly = [
  { month: 'เม.ย.', value: 32 },
  { month: 'พ.ค.', value: 45 },
  { month: 'มิ.ย.', value: 38 },
  { month: 'ก.ค.', value: 52 },
  { month: 'ส.ค.', value: 61 },
  { month: 'ก.ย.', value: 57 },
]

export const activities = [
  { who: 'สมชาย ใจดี', what: 'อนุมัติใบสั่งซื้อ #PO-1042', when: '5 นาทีที่แล้ว' },
  { who: 'นภา สดใส', what: 'เพิ่มพนักงานใหม่ 2 คน', when: '1 ชั่วโมงที่แล้ว' },
  { who: 'วิชัย มั่นคง', what: 'อัปเดตสิทธิ์ผู้ใช้งาน', when: '3 ชั่วโมงที่แล้ว' },
  { who: 'อนุชา พากเพียร', what: 'ปิดงบประจำเดือน ส.ค.', when: 'เมื่อวาน' },
]
