// ข้อมูลจำลองสำหรับ mockup — แก้ไขได้ตามต้องการ

export type Status = 'active' | 'inactive'

export interface DataSource {
  id: number
  name: string
  databaseType: string
  host: string
  port: string
  databaseName: string
  status: Status
}

export const dataSources: DataSource[] = [
  { id: 1, name: 'Annual Plan', databaseType: 'SQL Server', host: '0.0.0.0', port: '1433', databaseName: 'STM_AnnualPlan', status: 'active' },
  { id: 2, name: 'ERS', databaseType: 'SQL Server', host: '127.0.0.0', port: '1434', databaseName: 'STM_ERS', status: 'active' },
  { id: 3, name: 'POCS', databaseType: 'SQL Server', host: '127.0.0.1', port: '1435', databaseName: 'STM_POCS', status: 'active' },
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
