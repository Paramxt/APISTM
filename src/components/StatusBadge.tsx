import type { Status } from '../templates/admin/mock'

const styles: Record<Status, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  inactive: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}

const labels: Record<Status, string> = {
  active: 'ใช้งาน',
  pending: 'รออนุมัติ',
  inactive: 'ปิดใช้งาน',
}

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
