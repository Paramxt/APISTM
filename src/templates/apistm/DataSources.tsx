import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { dataSources, type Status } from './mock'

type Filters = {
  name: string
  databaseType: string
  host: string
  port: string
  databaseName: string
  status: Status | 'all'
}

const initialFilters: Filters = { name: '', databaseType: '', host: '', port: '', databaseName: '', status: 'all' }
const fields: Array<[keyof Omit<Filters, 'status'>, string, string]> = [
  ['name', 'Name', 'Enter Name'],
  ['databaseType', 'Database Type', 'Enter Database Type'],
  ['host', 'Host', 'Enter Host'],
  ['port', 'Port', 'Enter Port'],
  ['databaseName', 'Database Name', 'Enter Database Name'],
]

export default function DataSources() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const filtered = useMemo(
    () => dataSources.filter((source) => Object.entries(filters).every(([key, value]) => value === '' || value === 'all' || String(source[key as keyof typeof source]).toLowerCase().includes(value.toLowerCase()))),
    [filters],
  )
  const inputClass = 'h-10 w-full rounded-lg border-2 border-zinc-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-500 focus:border-brand-500'

  return (
    <div className="overflow-hidden rounded-lg bg-slate-100 shadow-sm">
      <div className="bg-brand-500 px-6 py-2 text-2xl font-semibold text-white">Data Sources</div>
      <div className="grid gap-x-10 gap-y-4 px-4 py-5 md:grid-cols-2 md:px-6">
        {fields.map(([key, label, placeholder]) => (
          <label key={key} className="grid items-center gap-2 text-sm font-semibold text-slate-700 sm:grid-cols-[10rem_1fr]">
            <span>{label} :</span>
            <input value={filters[key]} onChange={(event) => setFilters({ ...filters, [key]: event.target.value })} placeholder={placeholder} className={inputClass} />
          </label>
        ))}
        <label className="grid items-center gap-2 text-sm font-semibold text-slate-700 sm:grid-cols-[10rem_1fr]">
          <span>Status :</span>
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value as Filters['status'] })} className={inputClass}>
            <option value="all">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <div className="flex justify-center gap-5 md:col-span-2">
          <button className="rounded-md bg-brand-500 px-9 py-2 text-sm font-medium text-white hover:bg-brand-700">Search</button>
          <button onClick={() => setFilters(initialFilters)} className="rounded-md bg-zinc-300 px-9 py-2 text-sm font-medium text-slate-900 hover:bg-zinc-400">Clear</button>
        </div>
      </div>
      <div className="border-t-2 border-zinc-300 px-4 pb-5 pt-4 md:px-6">
        <div className="flex justify-end pb-3">
          <button className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"><Plus className="h-4 w-4" /> Add New</button>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[850px] text-left text-sm text-slate-600">
            <thead className="bg-brand-100 text-brand-500">
              <tr>
                {['#', 'Name', 'DB Type', 'Host', 'Port', 'Database Name', 'Status', 'Action'].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-400 bg-white">
              {filtered.map((source) => (
                <tr key={source.id} className="hover:bg-brand-50">
                  <td className="px-4 py-2.5">{source.id}</td>
                  <td className="px-4 py-2.5">{source.name}</td>
                  <td className="px-4 py-2.5">{source.databaseType}</td>
                  <td className="px-4 py-2.5">{source.host}</td>
                  <td className="px-4 py-2.5">{source.port}</td>
                  <td className="px-4 py-2.5">{source.databaseName}</td>
                  <td className="px-4 py-2.5">{source.status === 'active' ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-2.5"><div className="flex gap-2"><button className="rounded bg-brand-500 p-1.5 text-white hover:bg-brand-700" aria-label="แก้ไข"><Pencil className="h-3.5 w-3.5" /></button><button className="rounded bg-brand-100 p-1.5 text-brand-700 hover:bg-brand-50" aria-label="ลบ"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400">No data found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm font-medium text-slate-500"><span>Showing {filtered.length ? 1 : 0} of {filtered.length} on all the information {dataSources.length} data.</span><span>10 Rows <span className="rounded bg-brand-500 px-2 py-1 text-white">1</span></span></div>
      </div>
    </div>
  )
}
