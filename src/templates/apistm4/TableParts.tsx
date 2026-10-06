import { useState, type ReactNode } from 'react'
import { Check, Copy, Eye, History, Pencil, Search, Trash2 } from 'lucide-react'
import type { Status } from './mock'

export type StatusFilter = Status | 'all'

export function Card({ title, action, className = '', children }: { title?: string; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      {title && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export const addButton = 'flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700'

export const inputClass ='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 outline-none focus:border-brand-500'

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputClass} w-full pl-9`} />
    </div>
  )
}

export function StatusSelect({ value, onChange }: { value: StatusFilter; onChange: (value: StatusFilter) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as StatusFilter)} className={inputClass} aria-label="กรองตามสถานะ">
      <option value="all">สถานะทั้งหมด</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  )
}

const cellPadding = 'px-3 first:pl-4 last:pr-4'
export const cell = `${cellPadding} py-3`

// การ์ดตาราง: หัวการ์ด + เครื่องมือ (children ของ toolbar) + ตาราง + จำนวนรายการ
export function TableCard({
  title,
  toolbar,
  headers,
  minWidth,
  shown,
  total,
  children,
}: {
  title: string
  toolbar: ReactNode
  headers: string[]
  minWidth: string
  shown: number
  total: number
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <h2 className="mr-auto text-sm font-semibold text-slate-800">
          {title} <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{total}</span>
        </h2>
        {toolbar}
      </div>
      <div className="overflow-x-auto">
        <table className={`w-full whitespace-nowrap text-left text-sm ${minWidth}`}>
          <thead className="border-y border-slate-200 bg-slate-50 text-xs text-slate-600">
            <tr>
              {headers.map((h) => (
                <th key={h} className={`${cellPadding} py-2.5 font-medium`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {children}
            {shown === 0 && (
              <tr>
                <td colSpan={headers.length} className="py-12 text-center text-slate-400">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
        แสดง {shown} จากทั้งหมด {total} รายการ
      </div>
    </section>
  )
}

export function StatusDot({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-700">
      <span className={`h-2 w-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  )
}

const outlineButton = 'rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700'

// ปุ่มจัดการในแถวตาราง — ยังเป็น placeholder ของ mockup
// withVersions: แสดงปุ่ม Preview และ History เพิ่ม
export function RowActions({ name, withVersions = false, onEdit, onDelete, onVersions, onPreview }: { name: string; withVersions?: boolean; onEdit?: () => void; onDelete?: () => void; onVersions?: () => void; onPreview?: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {withVersions && (
        <button onClick={onPreview} className={outlineButton} aria-label={`ดูตัวอย่าง ${name}`} title="Preview">
          <Eye className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        onClick={onEdit}
        className={`flex items-center gap-1 rounded-md bg-brand-600 py-1.5 text-xs font-medium text-white hover:bg-brand-700 ${withVersions ? 'px-1.5' : 'px-2.5'}`}
        aria-label={`แก้ไข ${name}`}
        title="Edit"
      >
        <Pencil className="h-3.5 w-3.5" /> {!withVersions && 'Edit'}
      </button>
      {withVersions && (
        <button onClick={onVersions} className={outlineButton} aria-label={`ประวัติเวอร์ชันของ ${name}`} title="Version Control">
          <History className="h-3.5 w-3.5" />
        </button>
      )}
      <button onClick={onDelete} className={`${outlineButton} hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600`} aria-label={`ลบ ${name}`} title="Delete">
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
    <button onClick={copy} className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label={label}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}
