import { Waypoints } from 'lucide-react'

// หน้า Dynamic API — ยังไม่มีฟังก์ชันจริง เป็น placeholder ของ mockup
export default function DynamicApi() {
  return (
    <div className="overflow-hidden rounded-lg bg-slate-100 shadow-sm">
      <div className="bg-brand-500 px-6 py-2 text-2xl font-semibold text-white">Dynamic API</div>
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-slate-500">
        <Waypoints className="h-10 w-10 text-brand-500" />
        <p className="text-sm">หน้านี้ยังไม่พร้อมใช้งาน อยู่ระหว่างออกแบบ</p>
      </div>
    </div>
  )
}
