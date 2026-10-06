import { useMemo, useState, type FormEvent } from 'react'
import { Trash2, X } from 'lucide-react'
import { cell, FilterBar, PageHeading, RowActions, StatusPill, TableCard, type StatusFilter } from './TableParts'
import { dataSources, type DataSource } from './mock'

export default function DataSources() {
  const [sources, setSources] = useState(dataSources)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [editing, setEditing] = useState<DataSource | null | undefined>(undefined)
  const [pendingDelete, setPendingDelete] = useState<DataSource | null>(null)

  const rows = useMemo(
    () =>
      sources.filter(
        (s) => (status === 'all' || s.status === status) && `${s.name} ${s.databaseType} ${s.host} ${s.databaseName}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [sources, query, status],
  )

  function saveSource(source: Omit<DataSource, 'id'>) {
    if (editing === null) {
      const id = Math.max(0, ...sources.map((item) => item.id)) + 1
      setSources((current) => [...current, { ...source, id }])
    } else if (editing) {
      setSources((current) => current.map((item) => (item.id === editing.id ? { ...source, id: editing.id } : item)))
    }
    setEditing(undefined)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setSources((current) => current.filter((item) => item.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  return (
    <div>
      <PageHeading title="Data Sources" addLabel="Add New" onAdd={() => setEditing(null)} />
      <FilterBar query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} placeholder="ค้นหาชื่อ, ชนิดฐานข้อมูล, host..." />

      <TableCard headers={['Name', 'DB Type', 'Host', 'Port', 'Database Name', 'Status', 'Action']} minWidth="min-w-[750px]" shown={rows.length} total={sources.length}>
        {rows.map((s) => (
          <tr key={s.id} className="hover:bg-slate-50">
            <td className={`${cell} font-medium text-slate-900`}>{s.name}</td>
            <td className={`${cell} text-slate-600`}>{s.databaseType}</td>
            <td className={`${cell} text-slate-600`}>{s.host}</td>
            <td className={`${cell} text-slate-600`}>{s.port}</td>
            <td className={`${cell} text-slate-600`}>{s.databaseName}</td>
            <td className={cell}>
              <StatusPill status={s.status} />
            </td>
            <td className={cell}>
              <RowActions name={s.name} onEdit={() => setEditing(s)} onDelete={() => setPendingDelete(s)} />
            </td>
          </tr>
        ))}
      </TableCard>
      {editing !== undefined && <DataSourceModal source={editing} onClose={() => setEditing(undefined)} onSave={saveSource} />}
      {pendingDelete && <DeleteSourceModal name={pendingDelete.name} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />}
    </div>
  )
}

function DataSourceModal({ source, onClose, onSave }: { source: DataSource | null; onClose: () => void; onSave: (source: Omit<DataSource, 'id'>) => void }) {
  const [draft, setDraft] = useState<Omit<DataSource, 'id'>>(
    source
      ? { name: source.name, databaseType: source.databaseType, host: source.host, port: source.port, databaseName: source.databaseName, status: source.status }
      : { name: '', databaseType: 'SQL Server', host: '', port: '1433', databaseName: '', status: 'active' },
  )
  const fields: { key: 'name' | 'databaseType' | 'host' | 'port' | 'databaseName'; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'databaseType', label: 'DB Type' },
    { key: 'host', label: 'Host' },
    { key: 'port', label: 'Port' },
    { key: 'databaseName', label: 'Database Name' },
  ]

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ ...draft, name: draft.name.trim(), host: draft.host.trim(), databaseName: draft.databaseName.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(event) => event.stopPropagation()} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{source ? 'Edit Data Source' : 'Add Data Source'}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="ปิด"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          {fields.map(({ key, label }) => (
            <label key={key} className="text-sm font-medium text-slate-700">
              {label} *
              <input required value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-brand-500" />
            </label>
          ))}
          <label className="text-sm font-medium text-slate-700">
            Status
            <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as DataSource['status'] }))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal outline-none focus:border-brand-500">
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

function DeleteSourceModal({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onCancel}>
      <section role="dialog" aria-modal="true" aria-labelledby="delete-apistm2-source-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Trash2 className="h-5 w-5" /></div>
        <h2 id="delete-apistm2-source-title" className="mt-4 text-lg font-semibold text-slate-900">ยืนยันการลบ Data Source</h2>
        <p className="mt-2 text-sm text-slate-600">ต้องการลบ <span className="font-medium text-slate-900">{name}</span> ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">ยกเลิก</button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">ลบข้อมูล</button>
        </div>
      </section>
    </div>
  )
}
