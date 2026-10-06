import { TrendingDown, TrendingUp } from 'lucide-react'
import { stats } from './mock'

// กราฟเส้นเล็กวาดด้วย SVG
function Sparkline({ values }: { values: number[] }) {
  const w = 90
  const h = 32
  const min = Math.min(...values)
  const max = Math.max(...values)
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`)
    .join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="hidden h-8 w-24 shrink-0 sm:block">
      <polyline points={`0,${h} ${points} ${w},${h}`} className="fill-brand-50 stroke-none" />
      <polyline points={points} className="fill-none stroke-brand-500" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}

export default function StatStrip() {
  return (
    <div className="grid gap-px border-b border-slate-200 bg-slate-200 grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex items-end justify-between gap-3 bg-white px-4 py-4 md:px-5">
          <div>
            <div className="text-xs text-slate-500">{s.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">{s.value}</span>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {s.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {s.change}
              </span>
            </div>
          </div>
          <Sparkline values={s.trend} />
        </div>
      ))}
    </div>
  )
}
