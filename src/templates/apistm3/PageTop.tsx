import { Bell, Info, Menu, Settings, Share2 } from 'lucide-react'

const avatars = ['สช', 'นภ', 'วช', 'อช']

// หัวหน้าเพจ: ชื่อหน้า + จำนวน, ไอคอน, ผู้ใช้ร่วม และปุ่มแชร์
export default function PageTop({ title, count, onMenuClick, readOnly = false }: { title: string; count?: number; onMenuClick: () => void; readOnly?: boolean }) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-slate-200 px-4 md:px-5">
      <button className="md:hidden" onClick={onMenuClick} aria-label="เปิดเมนู">
        <Menu className="h-5 w-5 text-slate-600" />
      </button>
      <h1 className="text-lg font-semibold text-slate-900">
        {title} {count !== undefined && <span className="text-sm font-normal text-slate-400">{count}</span>}
      </h1>
      <div className="ml-auto flex items-center gap-3 text-slate-500">
        <Info className="hidden h-4 w-4 sm:block" />
        <Settings className="hidden h-4 w-4 sm:block" />
        <Bell className="h-4 w-4" />
        <div className="hidden -space-x-2 lg:flex">
          {avatars.map((a) => (
            <span key={a} className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-medium text-slate-700 ring-2 ring-white">
              {a}
            </span>
          ))}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-[10px] font-medium text-brand-600 ring-2 ring-white">+5</span>
        </div>
        {!readOnly && <button className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600">
          <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Share Access</span>
        </button>}
      </div>
    </header>
  )
}
