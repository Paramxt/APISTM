import { useState } from 'react'
import { Check, Copy, Eye, History, Pencil, Search, Trash2 } from 'lucide-react'
import type { Status } from './mock'

const iconButton = 'rounded-lg p-1.5'

// แท็บกรองข้อมูลใต้หัวเพจ
export function FilterTabs({ labels, active, onChange }: { labels: string[]; active: number; onChange: (index: number) => void }) {
  return (
    <div className="flex gap-6 overflow-x-auto border-b border-slate-200 px-4 text-sm md:px-5">
      {labels.map((label, i) => (
        <button
          key={label}
          onClick={() => onChange(i)}
          className={`shrink-0 border-b-2 py-3 ${active === i ? 'border-brand-500 font-medium text-brand-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative w-full sm:w-56">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ค้นหา"
        className="w-full rounded-lg bg-slate-100 py-1.5 pl-9 pr-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-100"
      />
    </div>
  )
}

// ปุ่มจัดการในแถวตาราง — ยังเป็น placeholder ของ mockup
// withVersions: แสดงปุ่ม Preview และ History เพิ่ม
export function RowActions({ name, withVersions = false, onEdit, onDelete, onVersions }: { name: string; withVersions?: boolean; onEdit?: () => void; onDelete?: () => void; onVersions?: () => void }) {
  return (
    <div className="flex gap-1.5">
      {withVersions && (
        <button className={`${iconButton} bg-slate-100 text-slate-600 hover:bg-slate-200`} aria-label={`ดูตัวอย่าง ${name}`} title="Preview">
          <Eye className="h-3.5 w-3.5" />
        </button>
      )}
      <button onClick={onEdit} className={`${iconButton} bg-brand-50 text-brand-600 hover:bg-brand-100`} aria-label={`แก้ไข ${name}`} title="Edit">
        <Pencil className="h-3.5 w-3.5" />
      </button>
      {withVersions && (
        <button onClick={onVersions} className={`${iconButton} bg-sky-50 text-sky-600 hover:bg-sky-100`} aria-label={`ประวัติเวอร์ชันของ ${name}`} title="Version Control">
          <History className="h-3.5 w-3.5" />
        </button>
      )}
      <button onClick={onDelete} className={`${iconButton} bg-rose-50 text-rose-600 hover:bg-rose-100`} aria-label={`ลบ ${name}`} title="Delete">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function StatusTag({ status }: { status: Status }) {
  return (
    <span
      className={`rounded border px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
        status === 'active' ? 'border-emerald-200 text-emerald-700' : 'border-slate-200 text-slate-500'
      }`}
    >
      {status}
    </span>
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
