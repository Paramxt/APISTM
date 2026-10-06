import { useMemo, useState } from 'react'
import { ArrowLeft, Database, Plus } from 'lucide-react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import PageTop from './PageTop'
import { CopyButton, FilterTabs, RowActions, SearchInput, StatusTag } from './TableParts'
import { dataSources, dynamicApis, groupApis, type Status } from './mock'
import DynamicApiEditor from './DynamicApiEditor'
import type { DynamicApiDraft } from '../DynamicApiEditor'
import { useProjectBase } from '../../projects/useProjectBase'

const tabs: { label: string; status?: Status }[] = [{ label: 'ทั้งหมด' }, { label: 'Active', status: 'active' }, { label: 'Inactive', status: 'inactive' }]

export default function DynamicApi({ onMenuClick }: { onMenuClick: () => void }) {
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const [groupId, setGroupId] = useState(0)
  const [apis, setApis] = useState(dynamicApis)
  const navigate = useNavigate()
  const listPath = `${useProjectBase()}/dynamic-api`

  const rows = useMemo(() => {
    const status = tabs[tab].status
    return apis.filter(
      (a) =>
        (!status || a.status === status) &&
        (groupId === 0 || a.groupId === groupId) &&
        `${a.name} ${a.groupName} ${a.view} ${a.dataSourceName} ${a.url}`.toLowerCase().includes(query.toLowerCase()),
    )
  }, [apis, tab, query, groupId])

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

  return (
    <Routes>
      <Route index element={<DynamicApiList rows={rows} total={apis.length} onMenuClick={onMenuClick} tab={tab} onTabChange={setTab} query={query} onQueryChange={setQuery} groupId={groupId} onGroupChange={setGroupId} onAdd={() => navigate(`${listPath}/new`)} onEdit={(apiId) => navigate(`${listPath}/${apiId}/edit`)} onVersions={(apiId) => navigate(`${listPath}/${apiId}/versions`)} />} />
      <Route path="new" element={<DynamicApiEditor api={null} count={apis.length} onMenuClick={onMenuClick} onClose={() => navigate(listPath)} onSave={(draft) => saveApi(draft)} />} />
      <Route path=":apiId/versions" element={<ApiVersionsRoute apis={apis} listPath={listPath} count={apis.length} onMenuClick={onMenuClick} />} />
      <Route path=":apiId/versions/:version" element={<ApiVersionDetailRoute apis={apis} listPath={listPath} count={apis.length} onMenuClick={onMenuClick} onClose={(apiId) => navigate(`${listPath}/${apiId}/versions`)} onRestore={(api) => {
        setApis((current) => current.map((item) => item.id === api.id ? api : item))
        navigate(listPath)
      }} />} />
      <Route path=":apiId/edit" element={<DynamicApiEditRoute apis={apis} count={apis.length} onMenuClick={onMenuClick} onClose={() => navigate(listPath)} onSave={saveApi} />} />
      <Route path="*" element={<Navigate to={listPath} replace />} />
    </Routes>
  )
}

function DynamicApiList({ rows, total, onMenuClick, tab, onTabChange, query, onQueryChange, groupId, onGroupChange, onAdd, onEdit, onVersions }: {
  rows: (typeof dynamicApis)[number][]
  total: number
  onMenuClick: () => void
  tab: number
  onTabChange: (tab: number) => void
  query: string
  onQueryChange: (query: string) => void
  groupId: number
  onGroupChange: (groupId: number) => void
  onAdd: () => void
  onEdit: (apiId: number) => void
  onVersions: (apiId: number) => void
}) {
  return (
    <div>
      <PageTop title="Dynamic API" count={total} onMenuClick={onMenuClick} />
      <FilterTabs labels={tabs.map((item) => item.label)} active={tab} onChange={onTabChange} />

      <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-5">
        <SearchInput value={query} onChange={onQueryChange} />
        <select value={groupId} onChange={(event) => onGroupChange(Number(event.target.value))} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-brand-100" aria-label="กรองตาม Group">
          <option value={0}>ทุก Group</option>
          {groupApis.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
        </select>
        <button onClick={onAdd} className="ml-auto flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-100">
          <Plus className="h-4 w-4" /> Add Dynamic API
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] whitespace-nowrap text-left text-sm">
          <thead className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              {['API Name', 'Group', 'Target Data', 'Fields', 'Version', 'URL', 'Status', 'Action'].map((heading, index) => (
                <th key={heading} className={`py-3 font-medium ${index === 0 ? 'pl-4 pr-3 md:pl-5' : 'px-3'}`}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((api) => (
              <tr key={api.id} className="hover:bg-slate-50">
                <td className="py-3 pl-4 pr-3 font-medium text-slate-900 md:pl-5">{api.name}</td>
                <td className="px-3 py-3"><span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{api.groupName}</span></td>
                <td className="px-3 py-3"><div className="font-mono text-xs text-slate-700">{api.view}</div><div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400"><Database className="h-3 w-3" /> {api.dataSourceName}</div></td>
                <td className="px-3 py-3 text-slate-900">{api.fields} ฟิลด์</td>
                <td className="px-3 py-3"><span className="rounded border border-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-600">{api.version}</span></td>
                <td className="px-3 py-3"><div className="flex max-w-60 items-center gap-1"><span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">GET</span><code className="truncate font-mono text-xs text-slate-600" title={api.url}>{api.endpoint}</code><CopyButton text={api.url} label="คัดลอก URL" /></div></td>
                <td className="px-3 py-3"><StatusTag status={api.status} /></td>
                <td className="px-3 py-3"><RowActions name={api.name} withVersions onEdit={() => onEdit(api.id)} onVersions={() => onVersions(api.id)} /></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="py-12 text-center text-slate-400">ไม่พบข้อมูล</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
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

function ApiVersionsRoute({ apis, listPath, count, onMenuClick }: { apis: ApiRecord[]; listPath: string; count: number; onMenuClick: () => void }) {
  const { apiId } = useParams()
  const api = apis.find((item) => item.id === Number(apiId))
  if (!api) return <Navigate to={listPath} replace />

  return <ApiVersionsPage api={api} versions={getApiVersions(api)} listPath={listPath} count={count} onMenuClick={onMenuClick} />
}

function ApiVersionsPage({ api, versions, listPath, count, onMenuClick }: { api: ApiRecord; versions: ApiVersion[]; listPath: string; count: number; onMenuClick: () => void }) {
  const navigate = useNavigate()

  return (
    <>
      <PageTop title="Dynamic API" count={count} onMenuClick={onMenuClick} readOnly />
      <div className="space-y-4 px-4 py-4 md:px-5">
        <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
          <button onClick={() => navigate(listPath)} className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"><ArrowLeft className="h-4 w-4" /> Back</button>
          <div><h2 className="text-lg font-semibold text-slate-900">Version Control</h2><p className="text-sm text-slate-500">{api.name}</p></div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] whitespace-nowrap text-left text-sm">
            <thead className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400"><tr>{['Version', 'วันที่บันทึก', 'ผู้แก้ไข', 'รายละเอียด', ''].map((heading) => <th key={heading} className="px-3 py-3 font-medium first:pl-0">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {versions.map((item) => <tr key={item.version}>
                <td className="px-3 py-3 pl-0"><span className="rounded border border-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-600">{item.version}</span>{item.version === api.version && <span className="ml-2 text-xs text-emerald-700">Current</span>}</td>
                <td className="px-3 py-3 text-slate-600">{item.savedAt}</td><td className="px-3 py-3 text-slate-600">{item.savedBy}</td><td className="px-3 py-3 text-slate-600">{item.note}</td>
                <td className="px-3 py-3"><button onClick={() => navigate(`${listPath}/${api.id}/versions/${encodeURIComponent(item.version)}`)} className="rounded-md bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100">ดูเวอร์ชัน</button></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function ApiVersionDetailRoute({ apis, listPath, count, onMenuClick, onClose, onRestore }: { apis: ApiRecord[]; listPath: string; count: number; onMenuClick: () => void; onClose: (apiId: number) => void; onRestore: (api: ApiRecord) => void }) {
  const { apiId, version } = useParams()
  const api = apis.find((item) => item.id === Number(apiId))
  if (!api) return <Navigate to={listPath} replace />
  const selectedVersion = getApiVersions(api).find((item) => item.version === version)
  if (!selectedVersion) return <Navigate to={`${listPath}/${api.id}/versions`} replace />

  return <DynamicApiEditor api={selectedVersion.api} count={count} onMenuClick={onMenuClick} readOnly restoreDisabled={selectedVersion.version === api.version} onClose={() => onClose(api.id)} onRestore={() => onRestore(selectedVersion.api)} onSave={() => undefined} />
}

function DynamicApiEditRoute({ apis, count, onMenuClick, onClose, onSave }: { apis: typeof dynamicApis; count: number; onMenuClick: () => void; onClose: () => void; onSave: (draft: DynamicApiDraft, apiId?: number) => void }) {
  const { apiId } = useParams()
  const api = apis.find((item) => item.id === Number(apiId))
  if (!api) return <Navigate to=".." replace />
  return <DynamicApiEditor api={api} count={count} onMenuClick={onMenuClick} onClose={onClose} onSave={(draft) => onSave(draft, api.id)} />
}
