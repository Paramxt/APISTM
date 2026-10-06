import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { users, type Status } from '../data/mock'

export default function Users() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status | 'all'>('all')

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (status === 'all' || u.status === status) &&
          (u.name.includes(query) || u.email.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, status],
  )

  return (
    <div>
      <PageHeader
        title="ผู้ใช้งาน"
        subtitle={`ทั้งหมด ${users.length} รายการ`}
        action={
          <Link
            to="/users/new"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> เพิ่มผู้ใช้
          </Link>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        {/* ตัวกรอง */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อหรืออีเมล..."
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status | 'all')}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="active">ใช้งาน</option>
            <option value="pending">รออนุมัติ</option>
            <option value="inactive">ปิดใช้งาน</option>
          </select>
        </div>

        {/* ตาราง */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">ชื่อ</th>
                <th className="px-4 py-3 font-medium">แผนก</th>
                <th className="px-4 py-3 font-medium">ตำแหน่ง</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium">วันที่เริ่ม</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{u.name}</div>
                    <div className="text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">{u.department}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 text-slate-500">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100" aria-label="แก้ไข">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-rose-500 hover:bg-rose-50" aria-label="ลบ">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">ไม่พบข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
