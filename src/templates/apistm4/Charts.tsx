import { useId } from 'react'

type Point = [number, number]

// แปลงจุดเป็นเส้นโค้ง (Catmull-Rom → Bezier)
function smoothPath(points: Point[]) {
  return points.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x},${y}`
    const p0 = points[i - 2] ?? points[i - 1]
    const p1 = points[i - 1]
    const p3 = points[i + 1] ?? [x, y]
    const c1 = [p1[0] + (x - p0[0]) / 6, p1[1] + (y - p0[1]) / 6]
    const c2 = [x - (p3[0] - p1[0]) / 6, y - (p3[1] - p1[1]) / 6]
    return `${d} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${x},${y}`
  }, '')
}

function toPoints(values: number[], width: number, height: number, max: number, left = 0, top = 0): Point[] {
  return values.map((v, i) => [left + (i / (values.length - 1)) * width, top + height - (v / max) * height])
}

// กราฟเส้นเล็กในการ์ดสรุป ใช้สีหลักของโปรเจกต์
export function Sparkline({ values, className = 'h-12 w-28' }: { values: number[]; className?: string }) {
  const id = useId()
  const w = 120
  const h = 48
  const min = Math.min(...values)
  const pts = toPoints(values.map((v) => v - min), w, h - 6, Math.max(...values) - min || 1, 0, 3)
  const line = smoothPath(pts)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--brand-500)', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: 'var(--brand-500)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" className="stroke-brand-500" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

// กราฟพื้นที่ 2 ชุด: ชุดหลักใช้สีหลักของโปรเจกต์ ชุดเปรียบเทียบใช้สีเขียวอมฟ้า
export function AreaChart({ labels, primary, secondary, max }: { labels: string[]; primary: number[]; secondary: number[]; max: number }) {
  const id = useId()
  const W = 640
  const H = 240
  const left = 40
  const bottom = 26
  const plotW = W - left - 8
  const plotH = H - bottom - 10
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t))
  const pPrimary = toPoints(primary, plotW, plotH, max, left, 10)
  const pSecondary = toPoints(secondary, plotW, plotH, max, left, 10)
  const base = 10 + plotH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <linearGradient id={`${id}-a`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--brand-500)', stopOpacity: 0.28 }} />
          <stop offset="100%" style={{ stopColor: 'var(--brand-500)', stopOpacity: 0.02 }} />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.22} />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
        </linearGradient>
      </defs>
      {ticks.map((t) => {
        const y = 10 + plotH - (t / max) * plotH
        return (
          <g key={t}>
            <line x1={left} x2={W - 8} y1={y} y2={y} className="stroke-slate-200" strokeDasharray={t === 0 ? undefined : '4 4'} />
            <text x={left - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-slate-400 text-[11px]">
              {t}
            </text>
          </g>
        )
      })}
      {labels.map((label, i) => (
        <text key={label} x={left + (i / (labels.length - 1)) * plotW} y={H - 6} textAnchor="middle" className="fill-slate-400 text-[11px]">
          {label}
        </text>
      ))}
      <path d={`${smoothPath(pSecondary)} L${left + plotW},${base} L${left},${base} Z`} fill={`url(#${id}-b)`} />
      <path d={smoothPath(pSecondary)} fill="none" stroke="#14b8a6" strokeWidth={2} />
      <path d={`${smoothPath(pPrimary)} L${left + plotW},${base} L${left},${base} Z`} fill={`url(#${id}-a)`} />
      <path d={smoothPath(pPrimary)} fill="none" className="stroke-brand-600" strokeWidth={2.5} />
    </svg>
  )
}

// กราฟโดนัท: ใช้ stroke-dasharray บนวงกลมเส้นรอบวง 100
export function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  let offset = 0
  return (
    <svg viewBox="0 0 42 42" className="mx-auto h-40 w-40 -rotate-90">
      {segments.map((s) => {
        const pct = (s.value / total) * 100
        const gap = segments.length > 1 ? 1.2 : 0
        const el = (
          <circle
            key={s.label}
            cx="21"
            cy="21"
            r="15.915"
            fill="none"
            style={{ stroke: s.color }}
            strokeWidth="6"
            strokeDasharray={`${Math.max(pct - gap, 0)} ${100 - pct + gap}`}
            strokeDashoffset={-offset}
          />
        )
        offset += pct
        return el
      })}
    </svg>
  )
}

// กราฟแท่งซ้อน วาดด้วย div
export function StackedBars({ data, series }: { data: ({ label: string } & Record<string, number | string>)[]; series: { key: string; label: string; className: string }[] }) {
  const totals = data.map((d) => series.reduce((sum, s) => sum + Number(d[s.key]), 0))
  const max = Math.ceil(Math.max(...totals) / 50) * 50
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((t) => Math.round(max * t))

  return (
    <div className="flex gap-3">
      <div className="flex h-44 flex-col justify-between pb-6 text-right text-[11px] text-slate-400">
        {ticks.map((t) => (
          <span key={t} className="-translate-y-1/2 leading-none">
            {t}
          </span>
        ))}
      </div>
      <div className="relative flex h-44 flex-1 items-end justify-around gap-2 pb-6">
        <div className="pointer-events-none absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between">
          {ticks.map((t) => (
            <div key={t} className="border-t border-dashed border-slate-200" />
          ))}
        </div>
        {data.map((d, i) => (
          <div key={d.label} className="relative flex h-full w-full max-w-9 flex-col items-center justify-end">
            <div className="flex w-full flex-col-reverse overflow-hidden rounded-t-md" style={{ height: `${(totals[i] / max) * 100}%` }} title={`${d.label}: ${totals[i]}`}>
              {series.map((s) => (
                <div key={s.key} className={s.className} style={{ height: `${(Number(d[s.key]) / totals[i]) * 100}%` }} />
              ))}
            </div>
            <span className="absolute -bottom-6 text-[11px] text-slate-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
