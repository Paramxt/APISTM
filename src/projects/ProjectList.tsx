import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Boxes, Plus, Search, Trash2, RotateCcw } from 'lucide-react'
import { useProjects } from './ProjectContext'
import { brandVars, templates } from './themes'
import TemplatePreview from './TemplatePreview'
import CreateProjectModal from './CreateProjectModal'

export default function ProjectList() {
  const { projects, addProject, removeProject, resetProjects } = useProjects()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [query, setQuery] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 md:px-8">
          <Boxes className="h-6 w-6 text-indigo-600" />
          <span className="text-lg font-semibold text-slate-900">Mockup UI</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">โปรเจกต์ของฉัน</h1>
            <p className="mt-1 text-sm text-slate-500">เลือกโปรเจกต์ที่ต้องการ หรือสร้างโปรเจกต์ใหม่</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาโปรเจกต์..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" /> สร้างโปรเจกต์
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              style={brandVars(p.color)}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Link to={`/p/${p.id}`} className="block">
                <div className="bg-brand-50 p-4">
                  <TemplatePreview template={p.template} className="h-32" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                    <h3 className="truncate font-semibold text-slate-900">{p.name}</h3>
                  </div>
                  <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500">{p.description || 'ไม่มีคำอธิบาย'}</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 font-medium text-brand-700">{templates[p.template].name}</span>
                    <span className="text-slate-400">สร้างเมื่อ {p.createdAt}</span>
                  </div>
                </div>
              </Link>

              {/* ปุ่มลบ + ยืนยัน */}
              {confirmId === p.id ? (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-rose-50 px-4 py-3 text-sm">
                  <span className="text-rose-700">ลบโปรเจกต์นี้?</span>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmId(null)} className="rounded-md px-3 py-1 hover:bg-white">ยกเลิก</button>
                    <button onClick={() => removeProject(p.id)} className="rounded-md bg-rose-600 px-3 py-1 text-white hover:bg-rose-700">ลบ</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(p.id)}
                  className="absolute right-3 top-3 rounded-lg bg-white/90 p-1.5 text-slate-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:text-rose-600 focus:opacity-100"
                  aria-label="ลบโปรเจกต์"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {/* การ์ดสร้างใหม่ */}
          <button
            onClick={() => setCreating(true)}
            className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 transition hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Plus className="h-6 w-6" />
            </span>
            <span className="font-medium">สร้างโปรเจกต์ใหม่</span>
          </button>
        </div>

        {projects.length === 0 && (
          <button onClick={resetProjects} className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
            <RotateCcw className="h-4 w-4" /> คืนค่าโปรเจกต์ตัวอย่าง
          </button>
        )}
      </main>

      {creating && (
        <CreateProjectModal
          onClose={() => setCreating(false)}
          onCreate={(data) => {
            const p = addProject(data)
            navigate(`/p/${p.id}`)
          }}
        />
      )}
    </div>
  )
}
