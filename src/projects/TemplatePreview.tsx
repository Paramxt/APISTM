import type { TemplateId } from './themes'

// ภาพย่อจำลองหน้าตาของแต่ละ template (วาดด้วย div ล้วน)
export default function TemplatePreview({ template, className = '' }: { template: TemplateId; className?: string }) {
  if (template === 'admin') {
    return (
      <div className={`flex overflow-hidden rounded-md bg-slate-100 ${className}`}>
        <div className="w-1/4 space-y-1 bg-slate-800 p-1.5">
          <div className="h-1.5 rounded-sm bg-brand-500" />
          <div className="h-1.5 rounded-sm bg-slate-600" />
          <div className="h-1.5 rounded-sm bg-slate-600" />
        </div>
        <div className="flex-1 space-y-1.5 p-1.5">
          <div className="grid grid-cols-3 gap-1">
            <div className="h-3 rounded-sm bg-white" />
            <div className="h-3 rounded-sm bg-white" />
            <div className="h-3 rounded-sm bg-white" />
          </div>
          <div className="flex h-8 items-end gap-1 rounded-sm bg-white p-1">
            {[40, 70, 55, 90, 75].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-brand-500" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (template === 'kanban') {
    return (
      <div className={`flex flex-col overflow-hidden rounded-md bg-slate-100 ${className}`}>
        <div className="h-3 bg-brand-600" />
        <div className="grid flex-1 grid-cols-3 gap-1 p-1.5">
          {[3, 2, 1].map((n, c) => (
            <div key={c} className="space-y-1 rounded-sm bg-slate-200 p-1">
              {Array.from({ length: n }).map((_, i) => (
                <div key={i} className="h-2.5 rounded-sm bg-white" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (template === 'apistm') {
    return (
      <div className={`flex flex-col overflow-hidden rounded-md bg-slate-100 ${className}`}>
        <div className="h-3 bg-brand-600" />
        <div className="grid flex-1 grid-cols-3 gap-1 p-1.5">
          {[3, 2, 1].map((n, c) => (
            <div key={c} className="space-y-1 rounded-sm bg-slate-200 p-1">
              {Array.from({ length: n }).map((_, i) => (
                <div key={i} className="h-2.5 rounded-sm bg-white" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (template === 'apistm2') {
    return (
      <div className={`flex flex-col overflow-hidden rounded-md bg-[#f4f1ea] ${className}`}>
        <div className="flex h-2.5 items-center gap-1 border-b border-black/10 bg-white px-1.5">
          <div className="h-1 w-4 rounded-sm bg-slate-700" />
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
        </div>
        <div className="grid flex-1 grid-cols-4 gap-1 p-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-sm bg-white p-0.5">
              <div className="h-1 w-2/3 rounded-sm bg-brand-500" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (template === 'apistm4') {
    return (
      <div className={`flex overflow-hidden rounded-md bg-slate-100 ring-1 ring-slate-200 ${className}`}>
        <div className="w-1/5 space-y-1 border-r border-slate-200 bg-slate-50 p-1">
          <div className="h-2 w-2 rounded-sm bg-brand-600" />
          <div className="h-1 rounded-sm bg-brand-100" />
          <div className="h-1 rounded-sm bg-slate-200" />
        </div>
        <div className="flex-1 space-y-1 p-1.5">
          <div className="grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-2.5 rounded-sm bg-white" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="col-span-2 flex h-7 items-end rounded-sm bg-white p-0.5">
              <svg viewBox="0 0 40 16" className="h-full w-full" preserveAspectRatio="none">
                <path d="M0,14 C8,6 12,12 20,7 S32,4 40,2 L40,16 L0,16 Z" style={{ fill: 'var(--brand-100)' }} />
                <path d="M0,14 C8,6 12,12 20,7 S32,4 40,2" fill="none" style={{ stroke: 'var(--brand-500)' }} strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex h-7 items-center justify-center rounded-sm bg-white">
              <div className="h-4 w-4 rounded-full border-[3px] border-brand-500 border-r-teal-400" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (template === 'apistm3') {
    return (
      <div className={`flex overflow-hidden rounded-md bg-white ring-1 ring-slate-200 ${className}`}>
        <div className="w-1/4 space-y-1 border-r border-slate-200 bg-slate-50 p-1.5">
          <div className="h-2 w-2 rounded-sm bg-brand-600" />
          <div className="h-1 rounded-sm bg-white ring-1 ring-slate-200" />
          <div className="h-1 rounded-sm bg-slate-200" />
        </div>
        <div className="flex-1 space-y-1 p-1.5">
          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-2.5 rounded-sm border-b-2 border-brand-500 bg-slate-50" />
            ))}
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`h-1.5 w-1.5 rounded-sm ${i === 1 ? 'bg-brand-500' : 'bg-slate-200'}`} />
              <div className="h-1 flex-1 rounded-sm bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className={`flex flex-col overflow-hidden rounded-md bg-white ring-1 ring-slate-200 ${className}`}>
      <div className="flex h-3 items-center justify-between border-b border-slate-200 px-1.5">
        <div className="h-1 w-6 rounded-sm bg-brand-600" />
        <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      </div>
      <div className="grid flex-1 grid-cols-4 gap-1 p-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-sm bg-brand-100" />
        ))}
      </div>
    </div>
  )
}
