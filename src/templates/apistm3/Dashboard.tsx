import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { useProjectBase } from '../../projects/useProjectBase'
import PageTop from './PageTop'
import StatStrip from './StatStrip'
import { dataSources, processTracking, upcomingOperations } from './mock'

export default function Dashboard({ onMenuClick }: { onMenuClick: () => void }) {
  const base = useProjectBase()
  const needsAttention = [...dataSources].sort((a, b) => a.health - b.health).slice(0, 4)

  return (
    <div>
      <PageTop title="Dashboard" onMenuClick={onMenuClick} />
      <StatStrip />

      <div className="grid gap-px bg-slate-200 lg:grid-cols-3">
        {/* Data Source ที่ควรตรวจสอบ */}
        <section className="bg-white p-4 md:p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Data Source ที่ควรตรวจสอบ</h2>
            <Link to={`${base}/datasources`} className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700">
              ดูทั้งหมด <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  {['Name', 'DB Type', 'Environment', 'Health', 'Last Sync'].map((h) => (
                    <th key={h} className="py-2 pr-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {needsAttention.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5 pr-3 font-medium text-slate-900">{s.name}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{s.databaseType}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{s.environment}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`font-medium ${s.health < 5 ? 'text-rose-600' : s.health < 8 ? 'text-amber-600' : 'text-emerald-600'}`}>{s.health}/10</span>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{s.lastSync}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* งานที่กำลังจะถึง */}
        <section className="bg-white p-4 md:p-5">
          <h2 className="font-semibold text-slate-900">Upcoming Operations</h2>
          <ul className="mt-3 space-y-2">
            {upcomingOperations.map((op) => (
              <li key={op.label} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                <Clock className="h-4 w-4 text-brand-500" />
                <span className="flex-1 text-slate-900">{op.label}</span>
                <span className="text-xs text-slate-400">{op.time}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ติดตามขั้นตอนการซิงค์ */}
        <section className="bg-white p-4 md:p-5 lg:col-span-3">
          <h2 className="font-semibold text-slate-900">Process Tracking</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {processTracking.map((step, i) => (
              <li key={i} className={`border-t-2 pt-3 text-sm ${step.done ? 'border-brand-500' : 'border-slate-200 text-slate-400'}`}>
                <div className="text-xs text-slate-400">{step.date}</div>
                <div className={`font-medium ${step.done ? 'text-slate-900' : ''}`}>{step.title}</div>
                <div className="text-xs text-slate-500">{step.desc}</div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
