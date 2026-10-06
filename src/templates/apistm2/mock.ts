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
  { id: 3, name: 'POCS', databaseType: 'PostgreSQL', host: '127.0.0.1', port: '5432', databaseName: 'stm_pocs', status: 'active' },
  { id: 4, name: 'Legacy CRM', databaseType: 'MySQL', host: '10.0.0.12', port: '3306', databaseName: 'legacy_crm', status: 'inactive' },
  { id: 5, name: 'Reporting Hub', databaseType: 'Oracle', host: '10.0.0.30', port: '1521', databaseName: 'RPT_HUB', status: 'active' },
]

// สร้าง token แบบสุ่ม (ระบบสร้างให้อัตโนมัติ)
export function generateToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return 'stm_' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export interface DynamicApiCondition {
  id: number
  field: string
  operator: string
  value: string
  valueSource?: 'body' | 'fixed'
}

export type ConditionLogic = 'AND' | 'OR'
export interface DynamicApiConditionGroup {
  id: number
  logic: ConditionLogic
  joinWith: ConditionLogic
  conditions: DynamicApiCondition[]
}

const API_BASE_URL = 'https://api.stm.co.th'

const annualPlanConditionGroups: DynamicApiConditionGroup[] = [
  {
    id: 1,
    logic: 'AND',
    joinWith: 'AND',
    conditions: [
      { id: 101, field: 'Attribute08', operator: 'Equals', value: '1', valueSource: 'fixed' },
      { id: 102, field: 'PlanYear', operator: 'Equals', value: '', valueSource: 'body' },
    ],
  },
  {
    id: 2,
    logic: 'AND',
    joinWith: 'OR',
    conditions: [{ id: 201, field: 'TotalBudget', operator: 'Equals', value: '', valueSource: 'body' }],
  },
  {
    id: 3,
    logic: 'AND',
    joinWith: 'AND',
    conditions: [{ id: 301, field: 'PlanId', operator: 'Equals', value: '121', valueSource: 'fixed' }],
  },
]

// Dynamic API: groupId อ้างถึง groupApis, dataSourceId อ้างถึง dataSources, view คือ View ที่เลือกจาก Data Source นั้น
const baseDynamicApis: { id: number; name: string; groupId: number; dataSourceId: number; view: string; fields: number; selectedFields?: string[]; conditions?: DynamicApiCondition[]; conditionLogic?: ConditionLogic; conditionGroups?: DynamicApiConditionGroup[]; version: string; path: string; status: Status }[] = [
  { id: 1, name: 'Get Annual Plan Summary', groupId: 1, dataSourceId: 1, view: 'vw_AnnualPlan_Summary', fields: 12, conditions: annualPlanConditionGroups.flatMap((group) => group.conditions), conditionLogic: 'AND', conditionGroups: annualPlanConditionGroups, version: 'v2.1', path: 'annual-plan/summary', status: 'active' },
  { id: 2, name: 'Get Plan Budget', groupId: 1, dataSourceId: 1, view: 'vw_Plan_Budget', fields: 8, version: 'v1.0', path: 'annual-plan/budget', status: 'active' },
  { id: 3, name: 'Get Employees', groupId: 2, dataSourceId: 2, view: 'vw_ERS_Employee', fields: 15, version: 'v3.2', path: 'ers/employees', status: 'active' },
  { id: 4, name: 'Get Leave Requests', groupId: 2, dataSourceId: 2, view: 'vw_ERS_LeaveRequest', fields: 9, version: 'v1.4', path: 'ers/leave-requests', status: 'active' },
  { id: 5, name: 'Get Purchase Orders', groupId: 3, dataSourceId: 3, view: 'vw_pocs_purchase_order', fields: 18, version: 'v2.0', path: 'pocs/purchase-orders', status: 'active' },
  { id: 6, name: 'Get Vendors', groupId: 3, dataSourceId: 3, view: 'vw_pocs_vendor', fields: 7, version: 'v1.1', path: 'pocs/vendors', status: 'inactive' },
  { id: 7, name: 'Get Customers', groupId: 4, dataSourceId: 4, view: 'vw_crm_customer', fields: 11, version: 'v0.9', path: 'crm/customers', status: 'inactive' },
  { id: 8, name: 'Get Executive KPI', groupId: 5, dataSourceId: 5, view: 'VW_RPT_KPI', fields: 20, version: 'v1.3', path: 'reports/kpi', status: 'active' },
  { id: 9, name: 'Get Monthly Report', groupId: 5, dataSourceId: 5, view: 'VW_RPT_MONTHLY', fields: 14, version: 'v2.0', path: 'reports/monthly', status: 'active' },
]

export const groupApis = [
  { id: 1, name: 'Annual Plan API', description: 'API สำหรับข้อมูลแผนงานประจำปี', status: 'active' as const },
  { id: 2, name: 'ERS Service', description: 'บริการข้อมูลระบบ ERS', status: 'active' as const },
  { id: 3, name: 'POCS Integration', description: 'เชื่อมต่อข้อมูลกับระบบ POCS', status: 'active' as const },
  { id: 4, name: 'Legacy CRM Bridge', description: 'API เดิมสำหรับระบบ CRM เก่า', status: 'inactive' as const },
  { id: 5, name: 'Reporting API', description: 'ดึงข้อมูลสำหรับรายงานผู้บริหาร', status: 'active' as const },
].map((g) => ({ ...g, token: generateToken(), apiCount: baseDynamicApis.filter((a) => a.groupId === g.id).length }))

export const dynamicApis = baseDynamicApis.map((a) => ({
  ...a,
  groupName: groupApis.find((g) => g.id === a.groupId)!.name,
  dataSourceName: dataSources.find((s) => s.id === a.dataSourceId)!.name,
  endpoint: `/${a.version}/${a.path}`,
  url: `${API_BASE_URL}/${a.version}/${a.path}`,
}))

export const stats = [
  { label: 'Data Sources', value: '18', change: '+2 เดือนนี้', up: true },
  { label: 'Active Connections', value: '14', change: '+1 เดือนนี้', up: true },
  { label: 'Sync Success Rate', value: '96%', change: '+1.2%', up: true },
  { label: 'Avg Response Time', value: '128ms', change: '-8ms', up: true },
]

export const radarAxes = ['เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.']

export const radarSeries = [
  { name: 'อัตราซิงค์สำเร็จ', color: '#f59e0b', values: [70, 82, 68, 95, 80, 88] },
  { name: 'อัปไทม์ระบบ', color: '#10b981', values: [55, 60, 72, 65, 78, 70] },
  { name: 'ความเร็วตอบสนอง', color: '#8b5cf6', values: [40, 55, 45, 50, 60, 48] },
]

export const processTracking = [
  { date: '06.02.26', title: 'สร้างคำขอเชื่อมต่อ', desc: 'ส่งคำขอเชื่อมต่อแหล่งข้อมูลใหม่', done: true },
  { date: '07.02.26', title: 'ตรวจสอบสิทธิ์', desc: 'ยืนยันสิทธิ์และการเชื่อมต่อสำเร็จ', done: true },
  { date: '08.02.26', title: 'เริ่มซิงค์ข้อมูล', desc: 'เริ่มดึงข้อมูลจากต้นทาง', done: true },
  { date: '09.02.26', title: 'กำลังประมวลผล', desc: 'กำลังตรวจสอบและแปลงข้อมูล', done: true },
  { date: '10.02.26', title: 'พบข้อผิดพลาด', desc: 'ระบบแจ้งเตือนความล่าช้าในขั้นตอนตรวจสอบ', done: false },
  { date: '11.02.26', title: 'เสร็จสมบูรณ์', desc: 'ซิงค์ข้อมูลสำเร็จทั้งหมด', done: false },
]

export const calendarDays = [
  { day: 3, label: 'Su' },
  { day: 4, label: 'Mo' },
  { day: 5, label: 'Tu' },
  { day: 6, label: 'We' },
  { day: 7, label: 'Th' },
  { day: 8, label: 'Fr' },
  { day: 9, label: 'Sa' },
]

export const upcomingOperations = [
  { label: 'ซิงค์ข้อมูลประจำวัน', time: '10:00 น.' },
  { label: 'ตรวจสอบ Endpoint ใหม่', time: '11:30 น.' },
  { label: 'สำรองข้อมูลรายสัปดาห์', time: '13:00 น.' },
  { label: 'ตรวจสอบ AI Insight', time: '14:30 น.' },
]
