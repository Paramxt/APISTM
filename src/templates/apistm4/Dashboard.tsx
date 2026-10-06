import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, ArrowRight, Database, KeyRound, Network, Pencil, Plus, UsersRound, type LucideIcon } from 'lucide-react'
import { useProjectBase } from '../../projects/useProjectBase'
import { AreaChart, DonutChart, Sparkline, StackedBars } from './Charts'
import { Card, RowActions, StatusDot, TableCard, cell, inputClass } from './TableParts'
import { activities, apiCallsToday, dataSources, dynamicApis, groupApis, hourlyLabels, hourlyRequests, responseTimeMs, weeklyCalls, type ActivityKind } from './mock'

const groupColors = ['var(--brand-500)', '#14b8a6', '#22c55e', '#f59e0b', '#8b5cf6']

const activityStyle: Record<ActivityKind, { icon: LucideIcon; circle: string; tag: string }> = {
  create: { icon: Plus, circle: 'bg-brand-50 text-brand-600', tag: 'bg-brand-50 text-brand-700' },
  token: { icon: KeyRound, circle: 'bg-sky-50 text-sky-600', tag: 'bg-sky-50 text-sky-700' },
  error: { icon: AlertTriangle, circle: 'bg-rose-50 text-rose-600', tag: 'bg-rose-50 text-rose-700' },
  update: { icon: Pencil, circle: 'bg-emerald-50 text-emerald-600', tag: 'bg-emerald-50 text-emerald-700' },
}

function StatCard({ icon: Icon, tint, label, value, children }: { icon: LucideIcon; tint: string; label: string; value: string; children: ReactNode }) {
  return (
    <Card>
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tint}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {children}
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const base = useProjectBase()
  const activeSources = dataSources.filter((s) => s.status === 'active').length
  const activeApis = dynamicApis.filter((a) => a.status === 'active').length
  const reachable = dataSources.filter((s) => responseTimeMs[s.id] > 0).length
  const byGroup = groupApis.map((g, i) => ({ label: g.name, value: g.apiCount, color: groupColors[i % groupColors.length] }))

  return (
    <div className="space-y-4">
      {/* การ์ดสรุป */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Database} tint="bg-brand-50 text-brand-600" label="Data Sources" value={String(dataSources.length)}>
          <div className="text-right">
            <Sparkline values={[2, 3, 3, 4, 3, 4, 5, 5]} />
            <div className="text-xs text-slate-400">Active {activeSources}</div>
          </div>
        </StatCard>
        <StatCard icon={UsersRound} tint="bg-teal-50 text-teal-600" label="Group API" value={String(groupApis.length)}>
          <Sparkline values={[1, 2, 2, 3, 2, 4, 4, 5]} />
        </StatCard>
        <StatCard icon={Network} tint="bg-amber-50 text-amber-600" label="Dynamic API" value={String(dynamicApis.length)}>
          <div className="w-32">
            <div className="text-right text-xs text-emerald-600">Active {activeApis}</div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-teal-400" style={{ width: `${(activeApis / dynamicApis.length) * 100}%` }} />
            </div>
          </div>
        </StatCard>
        <StatCard icon={Activity} tint="bg-emerald-50 text-emerald-600" label="API Calls วันนี้" value={apiCallsToday.value}>
          <div className="text-right">
            <Sparkline values={apiCallsToday.trend} />
            <div className="text-xs text-emerald-600">{apiCallsToday.change}</div>
          </div>
        </StatCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* กราฟการเรียกใช้ API */}
        <Card
          title="การเรียกใช้ API รายชั่วโมง"
          className="lg:col-span-2"
          action={
            <select className={inputClass} aria-label="ช่วงเวลา">
              <option>วันนี้</option>
              <option>7 วันล่าสุด</option>
            </select>
          }
        >
          <AreaChart labels={hourlyLabels} primary={hourlyRequests.today} secondary={hourlyRequests.yesterday} max={1000} />
          <div className="mt-2 flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-600" /> วันนี้
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-500" /> เมื่อวาน
            </span>
          </div>
        </Card>

        {/* สัดส่วน Dynamic API ตาม Group */}
        <Card title="Dynamic API แยกตาม Group">
          <div className="relative">
            <DonutChart segments={byGroup} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{dynamicApis.length}</span>
              <span className="text-xs text-slate-400">APIs</span>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs">
            {byGroup.map((g) => (
              <li key={g.label} className="flex items-center gap-2 text-slate-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: g.color }} />
                <span className="flex-1 truncate">{g.label}</span>
                <span className="font-medium text-slate-800">{g.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1.6fr_1fr]">
        {/* สถานะการเชื่อมต่อ Data Source */}
        <Card title="สุขภาพ Data Source">
          <ul className="space-y-3">
            {dataSources.map((s) => {
              const ms = responseTimeMs[s.id]
              return (
                <li key={s.id} className="text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className={`h-2 w-2 rounded-full ${ms > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {s.name}
                    </span>
                    <span className={`text-xs ${ms > 0 ? 'text-slate-500' : 'text-rose-600'}`}>{ms > 0 ? `${ms} ms` : 'เชื่อมต่อไม่ได้'}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${ms > 200 ? 'bg-amber-400' : 'bg-teal-500'}`} style={{ width: `${Math.min(ms / 300, 1) * 100}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            เชื่อมต่อได้
            <span className="font-semibold text-slate-800">
              {reachable}/{dataSources.length}
            </span>
          </div>
        </Card>

        {/* ผลการเรียกใช้รายวัน */}
        <Card title="ผลการเรียกใช้ API รายวัน">
          <div className="mb-3 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-600" /> สำเร็จ
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> ช้ากว่าปกติ
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> ผิดพลาด
            </span>
          </div>
          <StackedBars
            data={weeklyCalls}
            series={[
              { key: 'success', label: 'สำเร็จ', className: 'bg-brand-600' },
              { key: 'slow', label: 'ช้ากว่าปกติ', className: 'bg-amber-400' },
              { key: 'error', label: 'ผิดพลาด', className: 'bg-rose-500' },
            ]}
          />
        </Card>

        {/* กิจกรรมล่าสุด */}
        <Card title="กิจกรรมล่าสุด" className="lg:col-span-2 xl:col-span-1">
          <ul className="space-y-4">
            {activities.map((a, i) => {
              const style = activityStyle[a.kind]
              const Icon = style.icon
              return (
                <li key={i} className="flex gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.circle}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-slate-700">{a.text}</p>
                      <span className="shrink-0 text-xs text-slate-400">{a.time}</span>
                    </div>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${style.tag}`}>{a.tag}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      {/* Dynamic API ล่าสุด */}
      <TableCard
        title="Dynamic API ล่าสุด"
        toolbar={
          <Link to={`${base}/dynamic-api`} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
            ดูทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        }
        headers={['API Name', 'Group', 'Target Data', 'Version', 'Status', 'Action']}
        minWidth="min-w-[860px]"
        shown={5}
        total={dynamicApis.length}
      >
        {dynamicApis.slice(0, 5).map((a) => (
          <tr key={a.id} className="hover:bg-slate-50">
            <td className={`${cell} font-medium text-slate-800`}>{a.name}</td>
            <td className={`${cell} text-slate-600`}>{a.groupName}</td>
            <td className={`${cell} font-mono text-xs text-slate-600`}>{a.view}</td>
            <td className={`${cell} text-slate-600`}>{a.version}</td>
            <td className={cell}>
              <StatusDot status={a.status} />
            </td>
            <td className={cell}>
              <RowActions name={a.name} withVersions />
            </td>
          </tr>
        ))}
      </TableCard>
    </div>
  )
}
