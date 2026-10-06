import { useMemo, useState, type FormEvent } from 'react'
import { RefreshCw, Trash2, X } from 'lucide-react'
import { cell, CopyButton, FilterBar, PageHeading, RowActions, StatusPill, TableCard, type StatusFilter } from './TableParts'
import { generateToken, groupApis } from '../mock'

export default function GroupApi() {
  const [groups, setGroups] = useState(groupApis)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [editing, setEditing] = useState<(typeof groupApis)[number] | null | undefined>(undefined)
  const [pendingDelete, setPendingDelete] = useState<(typeof groupApis)[number] | null>(null)

  const rows = useMemo(
    () => groups.filter((g) => (status === 'all' || g.status === status) && `${g.name} ${g.description}`.toLowerCase().includes(query.toLowerCase())),
    [groups, query, status],
  )

  function regenerate(id: number) {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, token: generateToken() } : g)))
  }

  function saveGroup(group: { name: string; description: string; status: (typeof groupApis)[number]['status'] }) {
    if (editing === null) {
      const id = Math.max(0, ...groups.map((item) => item.id)) + 1
      setGroups((current) => [...current, { ...group, id, token: generateToken(), apiCount: 0 }])
    } else if (editing) {
      setGroups((current) => current.map((item) => (item.id === editing.id ? { ...item, ...group } : item)))
    }
    setEditing(undefined)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setGroups((current) => current.filter((item) => item.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  return (
    <div>
      <PageHeading title="Group API" addLabel="Add Group API" onAdd={() => setEditing(null)} />
      <FilterBar query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} placeholder="ค้นหาชื่อกลุ่ม, คำอธิบาย..." />

      <TableCard headers={['Group API', 'Description', 'Token', 'Count API', 'Status', 'Action']} minWidth="min-w-[900px]" shown={rows.length} total={groups.length}>
        {rows.map((g) => (
          <tr key={g.id} className="hover:bg-slate-50">
            <td className={`${cell} font-medium text-slate-900`}>{g.name}</td>
            <td className={`${cell} text-slate-600`}>{g.description}</td>
            <td className={cell}>
              <div className="flex items-center gap-1">
                <code className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">
                  {g.token.slice(0, 10)}…{g.token.slice(-4)}
                </code>
                <CopyButton text={g.token} label="คัดลอก Token" />
                <button onClick={() => regenerate(g.id)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="สร้าง Token ใหม่">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </td>
            <td className={`${cell} text-slate-900`}>{g.apiCount}</td>
            <td className={cell}>
              <StatusPill status={g.status} />
            </td>
            <td className={cell}>
              <RowActions name={g.name} onEdit={() => setEditing(g)} onDelete={() => setPendingDelete(g)} />
            </td>
          </tr>
        ))}
      </TableCard>
      {editing !== undefined && <GroupApiModal group={editing} onClose={() => setEditing(undefined)} onSave={saveGroup} />}
      {pendingDelete && <DeleteGroupModal name={pendingDelete.name} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />}
    </div>
  )
}

function GroupApiModal({ group, onClose, onSave }: { group: (typeof groupApis)[number] | null; onClose: () => void; onSave: (group: { name: string; description: string; status: (typeof groupApis)[number]['status'] }) => void }) {
  const [draft, setDraft] = useState({ name: group?.name ?? '', description: group?.description ?? '', status: group?.status ?? 'active' as (typeof groupApis)[number]['status'] })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(event) => event.stopPropagation()} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{group ? 'Edit Group API' : 'Add Group API'}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="ปิด"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-4 px-5 py-5">
          <label className="text-sm font-medium text-slate-700">Group API *<input required autoFocus value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-brand-500" /></label>
          <label className="text-sm font-medium text-slate-700">Description<textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={3} className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-brand-500" /></label>
          <label className="text-sm font-medium text-slate-700">Status<select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as typeof current.status }))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal outline-none focus:border-brand-500"><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">ยกเลิก</button><button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">บันทึก</button></div>
      </form>
    </div>
  )
}

function DeleteGroupModal({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onCancel}>
      <section role="dialog" aria-modal="true" aria-labelledby="delete-group-api-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Trash2 className="h-5 w-5" /></div>
        <h2 id="delete-group-api-title" className="mt-4 text-lg font-semibold text-slate-900">ยืนยันการลบ Group API</h2>
        <p className="mt-2 text-sm text-slate-600">ต้องการลบ <span className="font-medium text-slate-900">{name}</span> ใช่หรือไม่?</p>
        <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">ยกเลิก</button><button type="button" onClick={onConfirm} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">ลบข้อมูล</button></div>
      </section>
    </div>
  )
}
