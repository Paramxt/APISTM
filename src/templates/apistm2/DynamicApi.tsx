import { useMemo, useState } from 'react'
import { ArrowLeft, Database, Trash2 } from 'lucide-react'
import { useMatch, useNavigate } from 'react-router-dom'
import { cell, CopyButton, FilterBar, PageHeading, RowActions, StatusPill, TableCard, selectClass, type StatusFilter } from './TableParts'
import { dataSources, dynamicApis, groupApis } from './mock'
import DynamicApiEditor, { type DynamicApiDraft } from '../DynamicApiEditor'
import { useProjectBase } from '../../projects/useProjectBase'

export default function DynamicApi() {
  const [apis, setApis] = useState(dynamicApis)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [groupId, setGroupId] = useState(0)
  const [versionHistory, setVersionHistory] = useState<(typeof dynamicApis)[number] | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<ApiVersion | null>(null)
  const [pendingDelete, setPendingDelete] = useState<(typeof dynamicApis)[number] | null>(null)
  const navigate = useNavigate()
  const listPath = `${useProjectBase()}/dynamic-api`
  const newMatch = useMatch(`${listPath}/new`)
  const editMatch = useMatch(`${listPath}/:apiId/edit`)
  const editingApi = editMatch?.params.apiId ? apis.find((api) => api.id === Number(editMatch.params.apiId)) : undefined

  const rows = useMemo(
    () =>
      apis.filter(
        (a) =>
          (status === 'all' || a.status === status) &&
          (groupId === 0 || a.groupId === groupId) &&
          `${a.name} ${a.groupName} ${a.view} ${a.dataSourceName} ${a.url}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [apis, query, status, groupId],
  )

  function saveApi(draft: DynamicApiDraft, apiId?: number) {
    const group = groupApis.find((item) => item.id === draft.groupId)
    const source = dataSources.find((item) => item.id === draft.dataSourceId)
    const version = draft.version.trim()
    const path = draft.path.trim().replace(/^\/+/, '')
    const api = {
      ...draft,
      version,
      path,
      groupName: group?.name ?? '',
      dataSourceName: source?.name ?? '',
      endpoint: `/${version}/${path}`,
      url: `https://api.stm.co.th/${version}/${path}`,
    }
    if (apiId === undefined) {
      const id = Math.max(0, ...apis.map((item) => item.id)) + 1
      setApis((current) => [...current, { ...api, id }])
    } else {
      setApis((current) => current.map((item) => (item.id === apiId ? { ...api, id: apiId } : item)))
    }
    navigate(listPath)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setApis((current) => current.filter((item) => item.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  function restoreVersion(api: ApiRecord) {
    setApis((current) => current.map((item) => item.id === api.id ? api : item))
    setSelectedVersion(null)
    setVersionHistory(null)
  }

  if (selectedVersion) {
    return <DynamicApiEditor api={selectedVersion.api} variant="apistm2" readOnly restoreDisabled={selectedVersion.isCurrent} onClose={() => setSelectedVersion(null)} onRestore={() => restoreVersion(selectedVersion.api)} onSave={() => undefined} />
  }

  if (versionHistory) {
    return <ApiVersionHistory api={versionHistory} versions={getApiVersions(versionHistory)} onBack={() => setVersionHistory(null)} onSelect={setSelectedVersion} />
  }

  if (editingApi) {
    return <DynamicApiEditor key={editingApi.id} api={editingApi} variant="apistm2" onClose={() => navigate(listPath)} onSave={(draft) => saveApi(draft, editingApi.id)} />
  }

  if (newMatch) {
    return <DynamicApiEditor api={null} variant="apistm2" onClose={() => navigate(listPath)} onSave={saveApi} />
  }

  return (
    <div>
      <PageHeading title="Dynamic API" addLabel="Add Dynamic API" onAdd={() => navigate(`${listPath}/new`)} />
      <FilterBar query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} placeholder="ค้นหาชื่อ API, View, URL...">
        <select value={groupId} onChange={(e) => setGroupId(Number(e.target.value))} className={selectClass} aria-label="กรองตาม Group">
          <option value={0}>ทุก Group</option>
          {groupApis.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </FilterBar>

      <TableCard
        headers={['API Name', 'Group', 'Target Data', 'Fields', 'Version', 'URL', 'Status', 'Action']}
        minWidth="min-w-[1150px]"
        shown={rows.length}
        total={apis.length}
      >
        {rows.map((a) => (
          <tr key={a.id} className="hover:bg-slate-50">
            <td className={`${cell} font-medium text-slate-900`}>{a.name}</td>
            <td className={cell}>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{a.groupName}</span>
            </td>
            <td className={cell}>
              <div className="font-mono text-xs text-slate-700">{a.view}</div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                <Database className="h-3 w-3" /> {a.dataSourceName}
              </div>
            </td>
            <td className={`${cell} text-slate-900`}>{a.fields}</td>
            <td className={cell}>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">{a.version}</span>
            </td>
            <td className={cell}>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">GET</span>
                <code className="font-mono text-xs text-slate-600" title={a.url}>
                  {a.endpoint}
                </code>
                <CopyButton text={a.url} label="คัดลอก URL" />
              </div>
            </td>
            <td className={cell}>
              <StatusPill status={a.status} />
            </td>
            <td className={cell}>
              <RowActions name={a.name} withVersions onEdit={() => navigate(`${listPath}/${a.id}/edit`)} onVersions={() => setVersionHistory(a)} onDelete={() => setPendingDelete(a)} />
            </td>
          </tr>
        ))}
      </TableCard>
      {pendingDelete && <DeleteDynamicApiModal name={pendingDelete.name} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />}
    </div>
  )
}

type ApiRecord = (typeof dynamicApis)[number]
type ApiVersion = { version: string; savedAt: string; savedBy: string; note: string; api: ApiRecord; isCurrent: boolean }

function getApiVersions(api: ApiRecord): ApiVersion[] {
  const versionParts = api.version.match(/^v(\d+)\.(\d+)$/)
  const majorVersion = Number(versionParts?.[1] ?? 1)
  const minorVersion = Number(versionParts?.[2] ?? 0)
  const previousVersion = minorVersion > 0
    ? `v${majorVersion}.${minorVersion - 1}`
    : `v${Math.max(0, majorVersion - 1)}.${majorVersion > 0 ? 9 : 0}`
  const previousApi = {
    ...api,
    version: previousVersion,
    fields: Math.max(1, api.fields - 2),
    selectedFields: api.selectedFields?.slice(0, Math.max(1, api.fields - 2)),
    endpoint: `/${previousVersion}/${api.path}`,
    url: `https://api.stm.co.th/${previousVersion}/${api.path}`,
  }

  return [
    { version: api.version, savedAt: '29 ก.ย. 2026', savedBy: 'Admin', note: 'เวอร์ชันปัจจุบัน', api, isCurrent: true },
    { version: previousVersion, savedAt: '18 ก.ย. 2026', savedBy: 'System Admin', note: 'ปรับปรุง Fields และเงื่อนไข API', api: previousApi, isCurrent: false },
  ]
}

function ApiVersionHistory({ api, versions, onBack, onSelect }: { api: ApiRecord; versions: ApiVersion[]; onBack: () => void; onSelect: (version: ApiVersion) => void }) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-4">
        <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div><h1 className="text-3xl font-bold text-slate-900">Version Control</h1><p className="mt-1 text-sm text-slate-500">{api.name}</p></div>
      </header>
      <section className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-800">ประวัติเวอร์ชัน</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] whitespace-nowrap text-left text-sm">
            <thead className="text-xs text-slate-500"><tr>{['Version', 'วันที่บันทึก', 'ผู้แก้ไข', 'รายละเอียด', ''].map((heading) => <th key={heading} className="px-3 py-3 font-medium first:pl-0">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {versions.map((item) => <tr key={item.version}>
                <td className="px-3 py-3 pl-0"><span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">{item.version}</span>{item.isCurrent && <span className="ml-2 text-xs font-medium text-emerald-700">Current</span>}</td>
                <td className="px-3 py-3 text-slate-600">{item.savedAt}</td><td className="px-3 py-3 text-slate-600">{item.savedBy}</td><td className="px-3 py-3 text-slate-600">{item.note}</td>
                <td className="px-3 py-3"><button onClick={() => onSelect(item)} className="rounded-full bg-brand-50 px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100">ดูเวอร์ชัน</button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function DeleteDynamicApiModal({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onCancel}>
      <section role="dialog" aria-modal="true" aria-labelledby="delete-dynamic-api-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Trash2 className="h-5 w-5" /></div>
        <h2 id="delete-dynamic-api-title" className="mt-4 text-lg font-semibold text-slate-900">ยืนยันการลบ Dynamic API</h2>
        <p className="mt-2 text-sm text-slate-600">ต้องการลบ <span className="font-medium text-slate-900">{name}</span> ใช่หรือไม่?</p>
        <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">ยกเลิก</button><button type="button" onClick={onConfirm} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">ลบข้อมูล</button></div>
      </section>
    </div>
  )
}

