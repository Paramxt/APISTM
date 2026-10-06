import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'

const input = 'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500'
const label = 'block text-sm font-medium text-slate-700'

export default function UserForm() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // mockup: ยังไม่เชื่อม backend แค่แสดงข้อความสำเร็จ
    setSaved(true)
    setTimeout(() => navigate('/users'), 1200)
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="เพิ่มผู้ใช้" subtitle="กรอกข้อมูลผู้ใช้งานใหม่" />

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> บันทึกข้อมูลเรียบร้อย (ข้อมูลจำลอง)
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>ชื่อ</label>
            <input required className={input} placeholder="เช่น สมชาย" />
          </div>
          <div>
            <label className={label}>นามสกุล</label>
            <input required className={input} placeholder="เช่น ใจดี" />
          </div>
          <div>
            <label className={label}>อีเมล</label>
            <input required type="email" className={input} placeholder="name@example.com" />
          </div>
          <div>
            <label className={label}>เบอร์โทร</label>
            <input className={input} placeholder="08x-xxx-xxxx" />
          </div>
          <div>
            <label className={label}>แผนก</label>
            <select className={input}>
              <option>ฝ่ายขาย</option>
              <option>ฝ่ายบัญชี</option>
              <option>ฝ่ายไอที</option>
              <option>ฝ่ายบุคคล</option>
              <option>ฝ่ายการตลาด</option>
            </select>
          </div>
          <div>
            <label className={label}>ตำแหน่ง</label>
            <select className={input}>
              <option>Staff</option>
              <option>Manager</option>
              <option>Developer</option>
              <option>Admin</option>
            </select>
          </div>
        </div>

        <div>
          <label className={label}>หมายเหตุ</label>
          <textarea rows={3} className={input} placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)" />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-indigo-600" defaultChecked />
          เปิดใช้งานบัญชีทันที
        </label>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ยกเลิก
          </button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}
