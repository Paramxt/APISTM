import { TrendingUp, TrendingDown } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { stats, monthly, activities, users } from '../data/mock'

export default function Dashboard() {
  const max = Math.max(...monthly.map((m) => m.value))

  return (
    <div>
      <PageHeader title="แดชบอร์ด" subtitle="ภาพรวมของระบบประจำเดือนนี้" />

      {/* การ์ดสรุปตัวเลข */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{s.value}</div>
            <div className={`mt-2 flex items-center gap-1 text-sm ${s.up ? 'text-emerald-600' : 'text-rose-600'}`}>
              {s.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {s.change} จากเดือนก่อน
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* กราฟแท่งแบบง่าย */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-900">ยอดคำสั่งซื้อรายเดือน</h2>
          <div className="mt-6 flex h-56 items-end gap-4">
            {monthly.map((m) => (
              <div key={m.month} className="flex h-full flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-xs text-slate-500">{m.value}</span>
                  <div
                    className="w-full max-w-12 rounded-t-md bg-indigo-500 transition-colors hover:bg-indigo-600"
                    style={{ height: `${(m.value / max) * 85}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* กิจกรรมล่าสุด */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">กิจกรรมล่าสุด</h2>
          <ul className="mt-4 space-y-4">
            {activities.map((a, i) => (
              <li key={i} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                <div className="text-sm">
                  <span className="font-medium text-slate-900">{a.who}</span>{' '}
                  <span className="text-slate-600">{a.what}</span>
                  <div className="text-xs text-slate-400">{a.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ผู้ใช้ล่าสุด */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">ผู้ใช้ที่เพิ่มล่าสุด</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {users.slice(0, 4).map((u) => (
            <div key={u.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-medium text-slate-900">{u.name}</div>
                <div className="text-slate-500">{u.department}</div>
              </div>
              <StatusBadge status={u.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
