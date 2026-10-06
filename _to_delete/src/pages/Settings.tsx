import { useState } from 'react'
import PageHeader from '../components/PageHeader'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  )
}

export default function Settings() {
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)
  const [twoFa, setTwoFa] = useState(true)

  const rows = [
    { title: 'แจ้งเตือนทางอีเมล', desc: 'รับอีเมลเมื่อมีกิจกรรมสำคัญ', v: email, set: setEmail },
    { title: 'แจ้งเตือนทาง SMS', desc: 'รับข้อความเมื่อมีงานเร่งด่วน', v: sms, set: setSms },
    { title: 'ยืนยันตัวตน 2 ขั้นตอน', desc: 'เพิ่มความปลอดภัยให้บัญชี', v: twoFa, set: setTwoFa },
  ]

  return (
    <div className="max-w-3xl">
      <PageHeader title="ตั้งค่า" subtitle="จัดการการแจ้งเตือนและความปลอดภัย" />
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {rows.map((r) => (
          <div key={r.title} className="flex items-center justify-between gap-4 p-5">
            <div>
              <div className="font-medium text-slate-900">{r.title}</div>
              <div className="text-sm text-slate-500">{r.desc}</div>
            </div>
            <Toggle checked={r.v} onChange={r.set} />
          </div>
        ))}
      </div>
    </div>
  )
}
