import { useState, type ReactNode } from 'react'
import { Check, Copy, Eye, History, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Status } from '../mock'

export type StatusFilter = Status | 'all'

// หัวเพจ: ชื่อหน้า + ปุ่มเพิ่มข้อมูล (placeholder)
export function PageHeading({ title, addLabel, onAdd }: { title: string; addLabel: string; onAdd?: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      <button onClick={onAdd} className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  )
}

export const selectClass = 'rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500'

// การ์ดตัวกรอง: ช่องค้นหา + สถานะ และตัวกรองเพิ่มเติมผ่าน children
export function FilterBar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  placeholder,
  children,
}: {
  query: string
  onQueryChange: (value: string) => void
  status: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  placeholder: string
  children?: ReactNode
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:bg-white"
        />
      </div>
      {children}
      <select value={status} onChange={(e) => onStatusChange(e.target.value as StatusFilter)} className={selectClass} aria-label="กรองตามสถานะ">
        <option value="all">สถานะทั้งหมด</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  )
}

const cellPadding = 'px-4 first:pl-6 last:pr-6'
export const cell = `${cellPadding} py-3.5`

// การ์ดตาราง: หัวคอลัมน์ แถวข้อมูล แถว "ไม่พบข้อมูล" และจำนวนรายการด้านล่าง
export function TableCard({ headers, minWidth, shown, total, children }: { headers: string[]; minWidth: string; shown: number; total: number; children: ReactNode }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className={`w-full whitespace-nowrap text-left text-sm ${minWidth}`}>
          <thead className="text-slate-500">
            <tr>
              {headers.map((h) => (
                <th key={h} className={`${cellPadding} py-3 font-medium`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {children}
            {shown === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-400">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3.5 text-xs text-slate-400">
        แสดง {shown} จากทั้งหมด {total} รายการ
      </div>
    </div>
  )
}

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  )
}

const actionButton = 'rounded-full p-2'

// ปุ่มจัดการในแถวตาราง — ยังเป็น placeholder ของ mockup
// withVersions: แสดงปุ่ม Preview และ History เพิ่ม
export function RowActions({ name, withVersions = false, onEdit, onDelete, onVersions }: { name: string; withVersions?: boolean; onEdit?: () => void; onDelete?: () => void; onVersions?: () => void }) {
  return (
    <div className="flex gap-1.5">
      {withVersions && (
        <button className={`${actionButton} bg-slate-100 text-slate-600 hover:bg-slate-200`} aria-label={`ดูตัวอย่าง ${name}`} title="Preview">
          <Eye className="h-3.5 w-3.5" />
        </button>
      )}
      <button onClick={onEdit} className={`${actionButton} bg-brand-50 text-brand-600 hover:bg-brand-100`} aria-label={`แก้ไข ${name}`} title="Edit">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      {withVersions && (
        <button onClick={onVersions} className={`${actionButton} bg-sky-50 text-sky-600 hover:bg-sky-100`} aria-label={`ประวัติเวอร์ชันของ ${name}`} title="Version Control">
          <History className="h-3.5 w-3.5" />
        </button>
      )}
      <button onClick={onDelete} className={`${actionButton} bg-rose-50 text-rose-600 hover:bg-rose-100`} aria-label={`ลบ ${name}`} title="Delete">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button onClick={copy} className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label={label}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}
