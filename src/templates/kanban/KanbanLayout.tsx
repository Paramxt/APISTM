import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Calendar, Filter } from 'lucide-react'
import type { LayoutProps } from '../types'

// Template "บอร์ดจัดการงาน": แถบด้านบน + บอร์ด Kanban ลากการ์ดได้

type ColumnId = 'todo' | 'doing' | 'review' | 'done'
type Priority = 'สูง' | 'กลาง' | 'ต่ำ'

interface Task {
  id: number
  title: string
  tag: string
  assignee: string
  due: string
  priority: Priority
  column: ColumnId
}

const columns: { id: ColumnId; title: string; dot: string }[] = [
  { id: 'todo', title: 'รอดำเนินการ', dot: 'bg-slate-400' },
  { id: 'doing', title: 'กำลังทำ', dot: 'bg-brand-500' },
  { id: 'review', title: 'รอตรวจสอบ', dot: 'bg-amber-500' },
  { id: 'done', title: 'เสร็จแล้ว', dot: 'bg-emerald-500' },
]

const priorityStyle: Record<Priority, string> = {
  สูง: 'bg-rose-50 text-rose-700',
  กลาง: 'bg-amber-50 text-amber-700',
  ต่ำ: 'bg-slate-100 text-slate-600',
}

const initialTasks: Task[] = [
  { id: 1, title: 'ออกแบบหน้า Login', tag: 'UI', assignee: 'สช', due: '25 ก.ย.', priority: 'สูง', column: 'todo' },
  { id: 2, title: 'เขียน API รายการสินค้า', tag: 'Backend', assignee: 'วช', due: '27 ก.ย.', priority: 'กลาง', column: 'todo' },
  { id: 3, title: 'ตั้งค่า CI/CD', tag: 'DevOps', assignee: 'ธน', due: '30 ก.ย.', priority: 'ต่ำ', column: 'todo' },
  { id: 4, title: 'ทำหน้า Dashboard', tag: 'UI', assignee: 'นภ', due: '24 ก.ย.', priority: 'สูง', column: 'doing' },
  { id: 5, title: 'เชื่อมระบบชำระเงิน', tag: 'Backend', assignee: 'วช', due: '28 ก.ย.', priority: 'สูง', column: 'doing' },
  { id: 6, title: 'ทดสอบฟอร์มสมัครสมาชิก', tag: 'QA', assignee: 'ปย', due: '23 ก.ย.', priority: 'กลาง', column: 'review' },
  { id: 7, title: 'เก็บ Requirement รอบแรก', tag: 'SA', assignee: 'สญ', due: '15 ก.ย.', priority: 'กลาง', column: 'done' },
  { id: 8, title: 'ออกแบบฐานข้อมูล', tag: 'SA', assignee: 'อช', due: '18 ก.ย.', priority: 'สูง', column: 'done' },
]

export default function KanbanLayout({ project }: LayoutProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [dragId, setDragId] = useState<number | null>(null)
  const [overCol, setOverCol] = useState<ColumnId | null>(null)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  function moveTo(column: ColumnId) {
    if (dragId === null) return
    setTasks((prev) => prev.map((t) => (t.id === dragId ? { ...t, column } : t)))
    setDragId(null)
    setOverCol(null)
  }

  function addTask(e: FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setTasks((prev) => [
      { id: Date.now(), title: newTitle.trim(), tag: 'ใหม่', assignee: 'AD', due: '-', priority: 'กลาง', column: 'todo' },
      ...prev,
    ])
    setNewTitle('')
    setAdding(false)
  }

  const doneCount = tasks.filter((t) => t.column === 'done').length
  const progress = Math.round((doneCount / Math.max(tasks.length, 1)) * 100)

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* แถบด้านบน */}
      <header className="bg-brand-600 text-white">
        <div className="flex h-14 items-center gap-3 px-4 md:px-6">
          <Link to="/" className="rounded-lg p-1.5 hover:bg-white/15" aria-label="กลับไปเลือกโปรเจกต์">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate text-lg font-semibold">{project.name}</h1>
          <div className="ml-auto flex -space-x-2">
            {['สช', 'วช', 'นภ', 'ปย'].map((n) => (
              <span key={n} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-brand-700 ring-2 ring-brand-600">
                {n}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-white/15 px-4 py-2 text-sm md:px-6">
          <nav className="flex gap-1">
            <span className="rounded-md bg-white/20 px-3 py-1 font-medium">บอร์ด</span>
            <span className="rounded-md px-3 py-1 text-white/80 hover:bg-white/10">รายการ</span>
            <span className="rounded-md px-3 py-1 text-white/80 hover:bg-white/10">ปฏิทิน</span>
          </nav>
          <div className="ml-auto flex items-center gap-2 text-white/90">
            ความคืบหน้า
            <div className="h-2 w-28 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
            </div>
            {progress}%
          </div>
        </div>
      </header>

      {/* แถบเครื่องมือ */}
      <div className="flex items-center gap-2 px-4 pt-4 md:px-6">
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> เพิ่มงาน
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
          <Filter className="h-4 w-4" /> ตัวกรอง
        </button>
        <span className="ml-auto hidden text-sm text-slate-500 sm:block">ลากการ์ดเพื่อย้ายสถานะ</span>
      </div>

      {/* บอร์ด */}
      <div className="flex flex-1 gap-4 overflow-x-auto p-4 md:px-6">
        {columns.map((col) => {
          const items = tasks.filter((t) => t.column === col.id)
          return (
            <section
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault()
                setOverCol(col.id)
              }}
              onDragLeave={() => setOverCol(null)}
              onDrop={() => moveTo(col.id)}
              className={`flex w-72 shrink-0 flex-col rounded-xl p-3 transition-colors ${
                overCol === col.id ? 'bg-brand-100' : 'bg-slate-200/60'
              }`}
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                <h2 className="text-sm font-semibold text-slate-700">{col.title}</h2>
                <span className="ml-auto rounded-full bg-white px-2 text-xs text-slate-500">{items.length}</span>
              </div>

              {col.id === 'todo' && adding && (
                <form onSubmit={addTask} className="mb-2 rounded-lg bg-white p-2 shadow-sm">
                  <input
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="ชื่องาน..."
                    className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                  />
                  <div className="mt-2 flex justify-end gap-2 text-sm">
                    <button type="button" onClick={() => setAdding(false)} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">
                      ยกเลิก
                    </button>
                    <button type="submit" className="rounded-md bg-brand-600 px-3 py-1 text-white hover:bg-brand-700">
                      เพิ่ม
                    </button>
                  </div>
                </form>
              )}

              <div className="flex-1 space-y-2">
                {items.map((t) => (
                  <article
                    key={t.id}
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    onDragEnd={() => {
                      setDragId(null)
                      setOverCol(null)
                    }}
                    className={`cursor-grab rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 transition hover:ring-brand-500 active:cursor-grabbing ${
                      dragId === t.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded bg-brand-50 px-1.5 py-0.5 font-medium text-brand-700">{t.tag}</span>
                      <span className={`rounded px-1.5 py-0.5 ${priorityStyle[t.priority]}`}>{t.priority}</span>
                    </div>
                    <h3 className={`mt-2 text-sm font-medium ${t.column === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {t.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {t.due}
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                        {t.assignee}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
