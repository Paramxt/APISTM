import { useMemo, useState, type FormEvent } from 'react'
import { ArrowUpDown, CloudDownload, CloudUpload, Filter, LayoutGrid, List, Plus, SlidersHorizontal, Trash2, X } from 'lucide-react'
import PageTop from './PageTop'
import { FilterTabs, RowActions, SearchInput, StatusTag } from './TableParts'
import { dataSources, type DataSourceRow } from './mock'

const tabs: { label: string; match: (s: DataSourceRow) => boolean }[] = [
  { label: 'ทั้งหมด', match: () => true },
  { label: 'Active', match: (s) => s.status === 'active' },
  { label: 'Inactive', match: (s) => s.status === 'inactive' },
]

export default function DataSources({ onMenuClick }: { onMenuClick: () => void }) {
  const [sources, setSources] = useState(dataSources)
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<DataSourceRow | null | undefined>(undefined)
  const [pendingDelete, setPendingDelete] = useState<DataSourceRow | null>(null)

  const rows = useMemo(
    () =>
      sources.filter(
        (s) => tabs[tab].match(s) && `${s.name} ${s.databaseType} ${s.host} ${s.databaseName}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [sources, tab, query],
  )

  function saveSource(source: Omit<DataSourceRow, 'id'>) {
    if (editing === null) {
      const id = Math.max(0, ...sources.map((item) => item.id)) + 1
      setSources((current) => [...current, { ...source, id }])
    } else if (editing) {
      setSources((current) => current.map((item) => (item.id === editing.id ? { ...source, id: editing.id } : item)))
    }
    setEditing(undefined)
  }

  function deleteSource(source: DataSourceRow) {
    setPendingDelete(source)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setSources((current) => current.filter((item) => item.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  const toolButton = 'flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200'

  return (
    <div>
      <PageTop title="Data Sources" count={sources.length} onMenuClick={onMenuClick} />

      <FilterTabs labels={tabs.map((t) => t.label)} active={tab} onChange={setTab} />

      {/* แถบเครื่องมือ */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-5">
        <SearchInput value={query} onChange={setQuery} />
        <div className="flex items-center gap-3 text-slate-500">
          
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-100">
            <Plus className="h-4 w-4" /> Add Data Source
          </button>
        </div>
      </div>

      {/* ตาราง */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              {['Name', 'DB Type', 'Host', 'Database Name', 'Status', 'Action'].map((h, i) => (
                <th key={h} className={`py-3 font-medium ${i === 0 ? 'pl-4 pr-3 md:pl-5' : 'px-3'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="py-3 pl-4 pr-3 font-medium text-slate-900 md:pl-5">{s.name}</td>
                <td className="px-3 py-3 text-slate-600">{s.databaseType}</td>
                <td className="px-3 py-3 text-slate-600">
                  {s.host}:{s.port}
                </td>
                <td className="px-3 py-3 text-slate-600">{s.databaseName}</td>
                <td className="px-3 py-3">
                  <StatusTag status={s.status} />
                </td>
                <td className="px-3 py-3">
                  <RowActions name={s.name} onEdit={() => setEditing(s)} onDelete={() => deleteSource(s)} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editing !== undefined && <DataSourceModal source={editing} onClose={() => setEditing(undefined)} onSave={saveSource} />}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={() => setPendingDelete(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="delete-source-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <h2 id="delete-source-title" className="mt-4 text-lg font-semibold text-slate-900">ยืนยันการลบ Data Source</h2>
            <p className="mt-2 text-sm text-slate-600">
              ต้องการลบ <span className="font-medium text-slate-900">{pendingDelete.name}</span> ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setPendingDelete(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">ยกเลิก</button>
              <button type="button" onClick={confirmDelete} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">ลบข้อมูล</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function DataSourceModal({
  source,
  onClose,
  onSave,
}: {
  source: DataSourceRow | null
  onClose: () => void
  onSave: (source: Omit<DataSourceRow, 'id'>) => void
}) {
  const [draft, setDraft] = useState<Omit<DataSourceRow, 'id'>>(
    source
      ? { name: source.name, databaseType: source.databaseType, host: source.host, port: source.port, databaseName: source.databaseName, status: source.status, owner: source.owner, environment: source.environment, health: source.health, lastSync: source.lastSync }
      : { name: '', databaseType: 'SQL Server', host: '', port: '', databaseName: '', status: 'active', owner: '', environment: 'Development', health: 10, lastSync: new Date().toLocaleDateString('th-TH') },
  )

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ ...draft, name: draft.name.trim(), host: draft.host.trim(), databaseName: draft.databaseName.trim(), owner: draft.owner.trim() })
  }

  const fields: { key: keyof Omit<DataSourceRow, 'id' | 'status' | 'health'>; label: string; required?: boolean }[] = [
    { key: 'name', label: 'Name', required: true },
    { key: 'databaseType', label: 'DB Type', required: true },
    { key: 'host', label: 'Host', required: true },
    { key: 'port', label: 'Port', required: true },
    { key: 'databaseName', label: 'Database Name', required: true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(event) => event.stopPropagation()} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{source ? 'Edit Data Source' : 'Add Data Source'}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="ปิด">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          {fields.map(({ key, label, required }) => (
            <label key={key} className="text-sm font-medium text-slate-700">
              {label}{required && ' *'}
              <input
                required={required}
                value={String(draft[key])}
                onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-brand-500"
              />
            </label>
          ))}
          <label className="text-sm font-medium text-slate-700">
            Status
            <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as DataSourceRow['status'] }))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal outline-none focus:border-brand-500">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">ยกเลิก</button>
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">บันทึก</button>
        </div>
      </form>
    </div>
  )
}
