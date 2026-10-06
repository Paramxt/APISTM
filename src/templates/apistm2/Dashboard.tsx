import { CreditCard, Rocket, Clock, BarChart3, SlidersHorizontal, LayoutGrid, CalendarDays } from 'lucide-react'
import { stats, radarAxes, radarSeries, processTracking, calendarDays, upcomingOperations } from './mock'

const cardIcons = [CreditCard, Rocket, Clock, BarChart3]
const cardTints = ['bg-emerald-100 text-emerald-700', 'bg-orange-100 text-orange-700', 'bg-zinc-200 text-zinc-700', 'bg-violet-100 text-violet-700']

// กราฟเรดาร์วาดด้วย SVG ล้วน — แสดงค่า 3 ตัวชี้วัดเทียบ 6 เดือน
function RadarChart() {
  const size = 300
  const center = size / 2
  const radius = 110
  const axisCount = radarAxes.length

  function point(index: number, value: number) {
    const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2
    const r = (value / 100) * radius
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)]
  }

  function polygon(values: number[]) {
    return values.map((v, i) => point(i, v).join(',')).join(' ')
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-xs">
      {/* เส้นกริดพื้นหลัง */}
      {[25, 50, 75, 100].map((pct) => (
        <polygon key={pct} points={polygon(Array(axisCount).fill(pct))} className="fill-none stroke-slate-200" />
      ))}
      {/* เส้นแกน */}
      {radarAxes.map((_, i) => {
        const [x, y] = point(i, 100)
        return <line key={i} x1={center} y1={center} x2={x} y2={y} className="stroke-slate-200" />
      })}
      {/* ป้ายชื่อแกน */}
      {radarAxes.map((label, i) => {
        const [x, y] = point(i, 118)
        return (
          <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[10px]">
            {label}
          </text>
        )
      })}
      {/* เส้นข้อมูลแต่ละชุด */}
      {radarSeries.map((s) => (
        <polygon key={s.name} points={polygon(s.values)} fill={s.color} fillOpacity={0.15} stroke={s.color} strokeWidth={2} />
      ))}
    </svg>
  )
}

export default function Dashboard() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <SlidersHorizontal className="h-4 w-4" /> Feb 01 - Jul 30
          </button>
          <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <LayoutGrid className="h-4 w-4" /> Layout
          </button>
        </div>
      </div>

      {/* การ์ดสรุปตัวเลข */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = cardIcons[i]
          return (
            <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="text-sm text-slate-500">{s.label}</div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-900">{s.value}</div>
                  <div className={`mt-1 text-sm ${s.up ? 'text-emerald-600' : 'text-rose-600'}`}>{s.change}</div>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cardTints[i]}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        {/* กราฟเรดาร์ */}
        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-slate-900">System Performance</h2>
          <RadarChart />
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600">
            {radarSeries.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} /> {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Process Tracking */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Process Tracking</h2>
          <ul className="mt-4 space-y-4">
            {processTracking.map((step, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${step.done ? 'bg-slate-900' : 'bg-slate-300'}`} />
                  {i < processTracking.length - 1 && <span className={`w-px flex-1 ${step.done ? 'bg-slate-900' : 'bg-slate-200'}`} />}
                </div>
                <div className={`pb-1 text-sm ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                  <div className="text-xs text-slate-400">{step.date}</div>
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-xs text-slate-400">{step.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Operations */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Upcoming Operations</h2>
            <CalendarDays className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
            {calendarDays.map((d) => (
              <div key={d.day} className="space-y-1">
                <div className="text-slate-400">{d.label}</div>
                <div
                  className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full ${
                    d.day === 8 ? 'bg-slate-900 font-semibold text-white' : 'text-slate-600'
                  }`}
                >
                  {d.day}
                </div>
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {upcomingOperations.map((op) => (
              <li key={op.label} className="rounded-xl bg-brand-50 px-3 py-2.5 text-sm">
                <div className="font-medium text-slate-900">{op.label}</div>
                <div className="text-xs text-slate-500">{op.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
