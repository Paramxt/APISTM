import { useMemo, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import PageTop from './PageTop'
import { CopyButton, FilterTabs, RowActions, SearchInput, StatusTag } from './TableParts'
import { generateToken, groupApis, type Status } from './mock'

const tabs: { label: string; status?: Status }[] = [{ label: 'ทั้งหมด' }, { label: 'Active', status: 'active' }, { label: 'Inactive', status: 'inactive' }]

// แสดง token แบบย่อ พร้อมปุ่มคัดลอกและสร้างใหม่
function TokenCell({ token, onRegenerate }: { token: string; onRegenerate: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
        {token.slice(0, 10)}…{token.slice(-4)}
      </code>
      <CopyButton text={token} label="คัดลอก Token" />
      <button onClick={onRegenerate} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="สร้าง Token ใหม่">
        <RefreshCw className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default function GroupApi({ onMenuClick }: { onMenuClick: () => void }) {
  const [groups, setGroups] = useState(groupApis)
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const status = tabs[tab].status
    return groups.filter((g) => (!status || g.status === status) && `${g.name} ${g.description}`.toLowerCase().includes(query.toLowerCase()))
  }, [groups, tab, query])

  function regenerate(id: number) {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, token: generateToken() } : g)))
  }

  return (
    <div>
      <PageTop title="Group API" count={groups.length} onMenuClick={onMenuClick} />
      <FilterTabs labels={tabs.map((t) => t.label)} active={tab} onChange={setTab} />

      {/* แถบเครื่องมือ */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-5">
        <SearchInput value={query} onChange={setQuery} />
        <button className="ml-auto flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-100">
          <Plus className="h-4 w-4" /> Add Group API
        </button>
      </div>

      {/* ตาราง */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              {['Group API', 'Description', 'Token', 'Count API', 'Status', 'Action'].map((h, i) => (
                <th key={h} className={`py-3 font-medium ${i === 0 ? 'pl-4 pr-3 md:pl-5' : 'px-3'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50">
                <td className="py-3 pl-4 pr-3 font-medium text-slate-900 md:pl-5">{g.name}</td>
                <td className="px-3 py-3 text-slate-600">{g.description}</td>
                <td className="px-3 py-3">
                  <TokenCell token={g.token} onRegenerate={() => regenerate(g.id)} />
                </td>
                <td className="px-3 py-3 text-slate-900">{g.apiCount}</td>
                <td className="px-3 py-3">
                  <StatusTag status={g.status} />
                </td>
                <td className="px-3 py-3">
                  <RowActions name={g.name} />
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
    </div>
  )
}
