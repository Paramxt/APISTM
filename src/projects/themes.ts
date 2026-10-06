import type { CSSProperties } from 'react'

// ธีมสีและประเภทหน้าตา (template) ของแต่ละโปรเจกต์

export type TemplateId = 'admin' | 'kanban' | 'store' | 'apistm' | 'apistm2' | 'apistm3' | 'apistm4'
export type ColorId = 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky' | 'violet' | 'charcoal'

export const templates: Record<TemplateId, { name: string; description: string }> = {
  admin: { name: 'ระบบหลังบ้าน', description: 'เมนูด้านข้าง แดชบอร์ด ตาราง และฟอร์ม' },
  kanban: { name: 'บอร์ดจัดการงาน', description: 'บอร์ดแบบ Kanban ลากการ์ดย้ายสถานะได้' },
  store: { name: 'หน้าร้านออนไลน์', description: 'แสดงสินค้าเป็นกริด พร้อมตะกร้าสินค้า' },
  apistm: { name: 'UI APISTM 1', description: 'Mock UI and Data APISTM 1' },
  apistm2: { name: 'UI APISTM 2', description: 'Mock UI and Data APISTM 2' },
  apistm3: { name: 'UI APISTM 3', description: 'Mock UI and Data APISTM 3' },
  apistm4: { name: 'UI APISTM 4', description: 'Mock UI and Data APISTM 4' },
}

// ค่าสีจากชุดสีของ Tailwind (50 / 100 / 500 / 600 / 700)
export const colors: Record<ColorId, { name: string; shades: [string, string, string, string, string] }> = {
  indigo: { name: 'คราม', shades: ['#eef2ff', '#e0e7ff', '#6366f1', '#4f46e5', '#4338ca'] },
  emerald: { name: 'เขียว', shades: ['#ecfdf5', '#d1fae5', '#10b981', '#059669', '#047857'] },
  rose: { name: 'ชมพู', shades: ['#fff1f2', '#ffe4e6', '#f43f5e', '#e11d48', '#be123c'] },
  amber: { name: 'ส้ม', shades: ['#fffbeb', '#fef3c7', '#f59e0b', '#d97706', '#b45309'] },
  sky: { name: 'ฟ้า', shades: ['#f0f9ff', '#e0f2fe', '#0ea5e9', '#0284c7', '#0369a1'] },
  violet: { name: 'ม่วง', shades: ['#f5f3ff', '#ede9fe', '#8b5cf6', '#7c3aed', '#6d28d9'] },
  charcoal: { name: 'เทาดำ', shades: ['#f4f4f5', '#e4e4e7', '#52525b', '#27272a', '#18181b'] },
}

/** คืนค่า CSS variables สำหรับใส่ใน style เพื่อให้คลาส brand-* ใช้สีของโปรเจกต์ */
export function brandVars(color: ColorId): CSSProperties {
  const [s50, s100, s500, s600, s700] = colors[color].shades
  return {
    '--brand-50': s50,
    '--brand-100': s100,
    '--brand-500': s500,
    '--brand-600': s600,
    '--brand-700': s700,
  } as CSSProperties
}
