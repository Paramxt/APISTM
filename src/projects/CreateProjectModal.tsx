import { useState, type FormEvent } from 'react'
import { X, Check } from 'lucide-react'
import { colors, templates, brandVars, type ColorId, type TemplateId } from './themes'
import TemplatePreview from './TemplatePreview'
import type { Project } from './ProjectContext'

interface Props {
  onClose: () => void
  onCreate: (p: Omit<Project, 'id' | 'createdAt'>) => void
}

export default function CreateProjectModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [template, setTemplate] = useState<TemplateId>('admin')
  const [color, setColor] = useState<ColorId>('indigo')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onCreate({ name: name.trim(), description: description.trim(), template, color })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={brandVars(color)}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">สร้างโปรเจกต์ใหม่</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="ปิด">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">ชื่อโปรเจกต์ *</label>
              <input
                autoFocus
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น ระบบจองห้องประชุม"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">คำอธิบาย</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายสั้น ๆ"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-slate-700">รูปแบบหน้าตา</div>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {(Object.keys(templates) as TemplateId[]).map((id) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setTemplate(id)}
                  className={`relative rounded-xl border-2 p-3 text-left transition-colors ${
                    template === id ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {template === id && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <TemplatePreview template={id} className="h-20" />
                  <div className="mt-2 text-sm font-medium text-slate-900">{templates[id].name}</div>
                  <div className="text-xs text-slate-500">{templates[id].description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-slate-700">สีหลัก</div>
            <div className="mt-2 flex flex-wrap gap-3">
              {(Object.keys(colors) as ColorId[]).map((id) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setColor(id)}
                  title={colors[id].name}
                  aria-label={colors[id].name}
                  className={`flex h-9 w-9 items-center justify-center rounded-full ring-offset-2 transition ${
                    color === id ? 'ring-2 ring-slate-900' : ''
                  }`}
                  style={{ backgroundColor: colors[id].shades[3] }}
                >
                  {color === id && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
            ยกเลิก
          </button>
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50" disabled={!name.trim()}>
            สร้างโปรเจกต์
          </button>
        </div>
      </form>
    </div>
  )
}
