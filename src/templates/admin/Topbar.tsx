import { Menu, Search, Bell } from 'lucide-react'

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-8">
      <button className="md:hidden" onClick={onMenuClick} aria-label="เปิดเมนู">
        <Menu className="h-6 w-6 text-slate-600" />
      </button>
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="ค้นหา..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:bg-white"
        />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-slate-100" aria-label="การแจ้งเตือน">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            AD
          </div>
          <div className="hidden text-sm sm:block">
            <div className="font-medium">Admin</div>
            <div className="text-xs text-slate-500">ผู้ดูแลระบบ</div>
          </div>
        </div>
      </div>
    </header>
  )
}
