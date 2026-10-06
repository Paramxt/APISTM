import { useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, Database, Plus, Trash2, X } from 'lucide-react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { CopyButton, RowActions, SearchInput, StatusDot, StatusSelect, TableCard, addButton, cell, inputClass, type StatusFilter } from './TableParts'
import { dataSources, dynamicApis, groupApis } from './mock'
import { getFieldsForView } from '../dynamicApiCatalog'
import DynamicApiEditor, { type DynamicApiDraft } from '../DynamicApiEditor'
import { useProjectBase } from '../../projects/useProjectBase'

export default function DynamicApi() {
  const [apis, setApis] = useState(dynamicApis)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [groupId, setGroupId] = useState(0)
  const [pendingDelete, setPendingDelete] = useState<(typeof dynamicApis)[number] | null>(null)
  const [previewApi, setPreviewApi] = useState<(typeof dynamicApis)[number] | null>(null)
  const navigate = useNavigate()
  const listPath = `${useProjectBase()}/dynamic-api`

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

  return (
    <>
    <Routes>
      <Route index element={<DynamicApiList rows={rows} total={apis.length} query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} groupId={groupId} onGroupChange={setGroupId} onAdd={() => navigate(`${listPath}/new`)} onEdit={(apiId) => navigate(`${listPath}/${apiId}/edit`)} onVersions={(apiId) => navigate(`${listPath}/${apiId}/versions`)} onPreview={setPreviewApi} onDelete={setPendingDelete} pendingDelete={pendingDelete} onCancelDelete={() => setPendingDelete(null)} onConfirmDelete={confirmDelete} />} />
      <Route path="new" element={<DynamicApiEditor api={null} variant="apistm4" onClose={() => navigate(listPath)} onSave={(draft) => saveApi(draft)} />} />
      <Route path=":apiId/versions" element={<ApiVersionsRoute apis={apis} onClose={() => navigate(listPath)} />} />
      <Route path=":apiId/versions/:version" element={<ApiVersionDetailRoute apis={apis} onClose={(apiId) => navigate(`${listPath}/${apiId}/versions`)} onRestore={(api) => {
        setApis((current) => current.map((item) => item.id === api.id ? api : item))
        navigate(listPath)
      }} />} />
      <Route path=":apiId/edit" element={<DynamicApiEditRoute apis={apis} onClose={() => navigate(listPath)} onSave={saveApi} />} />
      <Route path="*" element={<Navigate to={listPath} replace />} />
    </Routes>
    {previewApi && <DynamicApiPreview api={previewApi} onClose={() => setPreviewApi(null)} />}
    </>
  )
}

function DynamicApiList({ rows, total, query, onQueryChange, status, onStatusChange, groupId, onGroupChange, onAdd, onEdit, onVersions, onPreview, onDelete, pendingDelete, onCancelDelete, onConfirmDelete }: {
  rows: (typeof dynamicApis)[number][]
  total: number
  query: string
  onQueryChange: (query: string) => void
  status: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  groupId: number
  onGroupChange: (groupId: number) => void
  onAdd: () => void
  onEdit: (apiId: number) => void
  onVersions: (apiId: number) => void
  onPreview: (api: (typeof dynamicApis)[number]) => void
  onDelete: (api: (typeof dynamicApis)[number]) => void
  pendingDelete: (typeof dynamicApis)[number] | null
  onCancelDelete: () => void
  onConfirmDelete: () => void
}) {
  return (
    <>
      <TableCard
        title="Dynamic API"
        toolbar={<>
          <SearchInput value={query} onChange={onQueryChange} placeholder="ค้นหาชื่อ API, View, URL..." />
          <select value={groupId} onChange={(event) => onGroupChange(Number(event.target.value))} className={inputClass} aria-label="กรองตาม Group">
            <option value={0}>ทุก Group</option>{groupApis.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select>
          <StatusSelect value={status} onChange={onStatusChange} />
          <button onClick={onAdd} className={addButton}><Plus className="h-4 w-4" /> Add Dynamic API</button>
        </>}
        headers={['API Name', 'Group', 'Target Data', 'Fields', 'Version', 'URL', 'Status', 'Action']}
        minWidth="min-w-[1080px]"
        shown={rows.length}
        total={total}
      >
        {rows.map((api) => (
          (() => {
            const displayUrl = api.url.replace(`/${api.version}/`, '/')
            return (
          <tr key={api.id} className="hover:bg-slate-50">
            <td className={`${cell} font-medium text-slate-800`}>{api.name}</td>
            <td className={cell}><span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{api.groupName}</span></td>
            <td className={cell}><div className="font-mono text-xs text-slate-700">{api.view}</div><div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400"><Database className="h-3 w-3" /> {api.dataSourceName}</div></td>
            <td className={`${cell} text-slate-800`}>{api.fields}</td>
            <td className={cell}><span className="rounded-md border border-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-600">{api.version}</span></td>
            <td className={cell}><div className="flex items-center gap-1.5"><span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">POST</span><code className="font-mono text-xs text-slate-600" title={displayUrl}>{displayUrl.replace(/^https?:\/\/[^/]+/, '')}</code><CopyButton text={displayUrl} label="คัดลอก URL" /></div></td>
            <td className={cell}><StatusDot status={api.status} /></td>
            <td className={cell}><RowActions name={api.name} withVersions onEdit={() => onEdit(api.id)} onVersions={() => onVersions(api.id)} onPreview={() => onPreview(api)} onDelete={() => onDelete(api)} /></td>
          </tr>
            )
          })()
        ))}
      </TableCard>
      {pendingDelete && <DeleteDynamicApiModal name={pendingDelete.name} onCancel={onCancelDelete} onConfirm={onConfirmDelete} />}
    </>
  )
}

type ApiRecord = (typeof dynamicApis)[number]
type ApiVersion = { version: string; savedAt: string; savedBy: string; note: string; api: ApiRecord }

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
    { version: api.version, savedAt: '29 ก.ย. 2026', savedBy: 'Admin', note: 'เวอร์ชันปัจจุบัน', api },
    { version: previousVersion, savedAt: '18 ก.ย. 2026', savedBy: 'System Admin', note: 'ปรับปรุง Fields และเงื่อนไข API', api: previousApi },
  ]
}

function ApiVersionsRoute({ apis, onClose }: { apis: ApiRecord[]; onClose: () => void }) {
  const { apiId } = useParams()
  const api = apis.find((item) => item.id === Number(apiId))
  if (!api) return <Navigate to=".." replace />
  return <ApiVersionsPage api={api} versions={getApiVersions(api)} onClose={onClose} />
}

function ApiVersionsPage({ api, versions, onClose }: { api: ApiRecord; versions: ApiVersion[]; onClose: () => void }) {
  const navigate = useNavigate()
  const listPath = `${useProjectBase()}/dynamic-api`

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
        <button onClick={onClose} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div><h2 className="text-lg font-semibold text-slate-900">Version Control</h2><p className="text-sm text-slate-500">{api.name}</p></div>
      </header>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3"><h3 className="text-sm font-semibold text-slate-800">ประวัติเวอร์ชัน</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600"><tr>{['Version', 'วันที่บันทึก', 'ผู้แก้ไข', 'รายละเอียด', ''].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {versions.map((item) => <tr key={item.version}>
                <td className="px-4 py-3"><span className="rounded-md border border-slate-200 px-2 py-1 font-mono text-xs text-slate-700">{item.version}</span>{item.version === api.version && <span className="ml-2 text-xs text-emerald-700">Current</span>}</td>
                <td className="px-4 py-3 text-slate-600">{item.savedAt}</td><td className="px-4 py-3 text-slate-600">{item.savedBy}</td><td className="px-4 py-3 text-slate-600">{item.note}</td>
                <td className="px-4 py-3"><button onClick={() => navigate(`${listPath}/${api.id}/versions/${encodeURIComponent(item.version)}`)} className="whitespace-nowrap rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">ดูเวอร์ชัน</button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

function ApiVersionDetailRoute({ apis, onClose, onRestore }: { apis: ApiRecord[]; onClose: (apiId: number) => void; onRestore: (api: ApiRecord) => void }) {
  const { apiId, version } = useParams()
  const api = apis.find((item) => item.id === Number(apiId))
  if (!api) return <Navigate to=".." replace />
  const selectedVersion = getApiVersions(api).find((item) => item.version === version)
  if (!selectedVersion) return <Navigate to={`../${api.id}/versions`} replace />
  return <DynamicApiEditor api={selectedVersion.api} variant="apistm4" readOnly restoreDisabled={selectedVersion.version === api.version} onClose={() => onClose(api.id)} onRestore={() => onRestore(selectedVersion.api)} onSave={() => undefined} />
}

function DynamicApiEditRoute({ apis, onClose, onSave }: { apis: typeof dynamicApis; onClose: () => void; onSave: (draft: DynamicApiDraft, apiId?: number) => void }) {
  const { apiId } = useParams()
  const api = apis.find((item) => item.id === Number(apiId))
  if (!api) return <Navigate to=".." replace />
  return <DynamicApiEditor api={api} variant="apistm4" onClose={onClose} onSave={(draft) => onSave(draft, api.id)} />
}

function DynamicApiPreview({ api, onClose }: { api: ApiRecord; onClose: () => void }) {
  const group = groupApis.find((item) => item.id === api.groupId)
  const displayUrl = api.url.replace(`/${api.version}/`, '/')
  const availableFields = getFieldsForView(api.dataSourceId, api.view)
  const fields = api.selectedFields?.length
    ? api.selectedFields.flatMap((name) => availableFields.filter((field) => field.name === name))
    : availableFields.slice(0, api.fields)
  const sampleValue = (type: string) => /int|number|decimal|float/i.test(type) ? 1 : /date|time/i.test(type) ? '2026-09-30' : /bool|bit/i.test(type) ? true : `Sample ${type}`
  const conditionGroups = api.conditionGroups?.length
    ? api.conditionGroups
    : api.conditions?.length ? [{ id: 1, logic: api.conditionLogic ?? 'AND', joinWith: 'AND' as const, conditions: api.conditions }] : []
  const bodyConditions = conditionGroups.flatMap((item) => item.conditions).filter((condition) => condition.valueSource === 'body' || (!condition.valueSource && !condition.value))
  const body = Object.fromEntries([...new Set(bodyConditions.map((condition) => condition.field))].map((fieldName) => [fieldName, 'INPUT']))
  const responseData = Object.fromEntries(fields.map((field) => [field.name, sampleValue(field.type)]))
  const response = { success: true, data: [responseData], total: 1 }
  const codeClass = 'max-h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-5 text-slate-700'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="dynamic-api-row-preview-title" onClick={(event) => event.stopPropagation()} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div><h2 id="dynamic-api-row-preview-title" className="font-semibold text-slate-900">Preview: {api.name}</h2><p className="mt-1 text-xs text-slate-500">{api.groupName} · {api.version}</p></div>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close preview"><X className="h-5 w-5" /></button>
        </header>
        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col gap-5">
            <PreviewBlock title="URL"><div className="flex min-w-0 items-center gap-2"><span className="shrink-0 rounded bg-orange-100 px-2 py-1 text-[10px] font-semibold text-orange-700">POST</span><code className="min-w-0 flex-1 break-all rounded-lg bg-slate-50 p-3 font-mono text-sm text-slate-700">{displayUrl}</code></div></PreviewBlock>
            <PreviewBlock title={`Group Token${group ? ` · ${group.name}` : ''}`}><div className="rounded-lg bg-slate-50 p-3"><code className="block break-all font-mono text-sm text-slate-700">{group?.token ?? 'No token available'}</code></div></PreviewBlock>
          </div>
          <section className="flex min-h-0 flex-col gap-2">
            <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-slate-800">Body</h3><span className="rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">User Input</span></div>
            <p className="text-xs text-slate-500">ผู้เรียก API ต้องส่งค่าเหล่านี้มาใน Request Body เมื่อต้องการใช้งาน</p>
            <pre className={`${codeClass} max-h-none flex-1`}>{JSON.stringify(body, null, 2)}</pre>
          </section>
          <div className="lg:col-span-2"><PreviewBlock title="Response"><pre className={codeClass}>{JSON.stringify(response, null, 2)}</pre></PreviewBlock></div>
        </div>
        <footer className="flex justify-end border-t border-slate-100 px-5 py-3"><button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">Close</button></footer>
      </section>
    </div>
  )
}

function PreviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-2"><h3 className="text-sm font-semibold text-slate-800">{title}</h3>{children}</section>
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
