import { useState, type FormEvent } from 'react'
import { ArrowLeft, Download, Plus, Trash2, X } from 'lucide-react'
import { dataSources, dynamicApis, groupApis } from './mock'
import type { ConditionLogic, DynamicApiCondition } from '../apistm2/mock'
import type { DynamicApiDraft } from '../DynamicApiEditor'
import { getFieldsForView, getViewsForDataSource, type ViewField } from '../dynamicApiCatalog'
import PageTop from './PageTop'

type DynamicApiRecord = (typeof dynamicApis)[number]

export default function DynamicApiEditor({ api, count, onMenuClick, onClose, onSave, readOnly = false, restoreDisabled = false, onRestore }: { api: DynamicApiRecord | null; count: number; onMenuClick: () => void; onClose: () => void; onSave: (draft: DynamicApiDraft) => void; readOnly?: boolean; restoreDisabled?: boolean; onRestore?: () => void }) {
  const initialDataSourceId = api?.dataSourceId ?? dataSources[0]?.id ?? 0
  const initialView = api?.view ?? getViewsForDataSource(initialDataSourceId)[0]?.name ?? ''
  const [draft, setDraft] = useState<DynamicApiDraft>(() => {
    const available = getFieldsForView(initialDataSourceId, initialView)
    const selectedFields = api?.selectedFields ?? available.slice(0, api?.fields ?? 0).map((field) => field.name)
    return {
      name: api?.name ?? '',
      groupId: api?.groupId ?? groupApis[0]?.id ?? 0,
      dataSourceId: initialDataSourceId,
      view: initialView,
      fields: selectedFields.length,
      selectedFields,
      conditions: api?.conditions ?? [],
      conditionLogic: api?.conditionLogic ?? 'AND',
      version: api?.version ?? 'v1.0',
      path: api?.path ?? '',
      status: api?.status ?? 'active',
    }
  })
  const [showFieldPicker, setShowFieldPicker] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [conditionsOpen, setConditionsOpen] = useState(true)
  const views = getViewsForDataSource(draft.dataSourceId)
  const viewFields = getFieldsForView(draft.dataSourceId, draft.view)
  const selectedColumns = draft.selectedFields.flatMap((name) => {
    const field = viewFields.find((column) => column.name === name)
    return field ? [field] : []
  })
  const availableFields = viewFields.filter((field) => !draft.selectedFields.includes(field.name))
  const inputClass = 'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
  const subtleButton = 'inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50'

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = draft.name.trim()
    const path = draft.path.trim().replace(/^\/+/, '') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    onSave({ ...draft, name, version: draft.version.trim(), path, fields: draft.selectedFields.length })
  }

  function addField(name: string) {
    if (!name) return
    setDraft((current) => ({ ...current, selectedFields: [...current.selectedFields, name], fields: current.selectedFields.length + 1 }))
    setShowFieldPicker(false)
  }

  function removeField(name: string) {
    setDraft((current) => {
      const selectedFields = current.selectedFields.filter((fieldName) => fieldName !== name)
      return { ...current, selectedFields, fields: selectedFields.length, conditions: current.conditions.filter((condition) => condition.field !== name) }
    })
  }

  function changeView(view: string) {
    setDraft((current) => ({ ...current, view, selectedFields: [], fields: 0, conditions: [] }))
  }

  function addCondition(fieldName: string) {
    if (!fieldName) return
    setDraft((current) => ({ ...current, conditions: [...current.conditions, { id: Date.now(), field: fieldName, operator: 'Equals', value: '' }] }))
  }

  function exportFields() {
    const rows = [
      ['Fields Name', 'Type', 'Length', 'Allow Nulls', 'Default', 'Description'],
      ...selectedColumns.map((field) => [field.name, field.type, field.length, field.allowNull ? 'Yes' : 'No', field.defaultValue, field.description]),
    ]
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${draft.view || 'dynamic-api'}-fields.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageTop title="Dynamic API" count={count} onMenuClick={onMenuClick} readOnly={readOnly} />
      <div className="space-y-5 px-4 py-4 md:px-5">
      <header className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200" aria-label="Back">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold text-slate-900">{readOnly ? 'View API Version' : api ? 'Edit Dynamic API' : 'Add Dynamic API'}</h1>
          {api && <p className="mt-0.5 truncate text-sm text-slate-500">{api.name}{readOnly && <span className="ml-2 font-mono">{api.version}</span>}</p>}
        </div>
      </header>

      <form onSubmit={submit} className="space-y-5">
        <section className="grid gap-x-6 gap-y-4 border-b border-slate-200 pb-5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            API Name *
            <input required autoFocus={!readOnly} disabled={readOnly} value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className={inputClass} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Group API *
            <select required disabled={readOnly} value={draft.groupId} onChange={(event) => setDraft((current) => ({ ...current, groupId: Number(event.target.value) }))} className={inputClass}>
              {groupApis.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Target Data *
            <select required disabled={readOnly} value={draft.view} onChange={(event) => changeView(event.target.value)} className={inputClass}>
              {views.map((view) => <option key={view.name} value={view.name}>{view.name}</option>)}
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
            <span>Status *</span>
            <label className={`flex items-center gap-2 ${readOnly ? '' : 'cursor-pointer'}`}>
              <span className={draft.status === 'inactive' ? 'text-brand-700' : 'text-slate-400'}>Inactive</span>
              <input type="checkbox" disabled={readOnly} checked={draft.status === 'active'} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.checked ? 'active' : 'inactive' }))} className="peer sr-only" />
              <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-brand-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
              <span className={draft.status === 'active' ? 'text-brand-700' : 'text-slate-400'}>Active</span>
            </label>
          </div>
        </section>

        <section className="border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <h2 className="text-sm font-semibold text-slate-800">Fields <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{draft.selectedFields.length}</span></h2>
            <div className="flex items-center gap-2">
              {!readOnly && <button type="button" onClick={() => setShowFieldPicker((shown) => !shown)} className={subtleButton}><Plus className="h-3.5 w-3.5" /> Add Field</button>}
              {!readOnly && <button type="button" onClick={exportFields} disabled={!selectedColumns.length} className={`${subtleButton} disabled:cursor-not-allowed disabled:opacity-50`}><Download className="h-3.5 w-3.5" /> Export Table</button>}
            </div>
          </div>
          {showFieldPicker && (
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-3 py-3">
              <label htmlFor="add-api-field" className="text-sm font-medium text-slate-700">เลือกคอลัมน์จาก {draft.view}</label>
              <select id="add-api-field" value="" onChange={(event) => addField(event.target.value)} className={`${inputClass} w-auto min-w-56`}>
                <option value="" disabled>เลือก Field...</option>
                {availableFields.map((field) => <option key={field.name} value={field.name}>{field.name} ({field.type})</option>)}
              </select>
              {!availableFields.length && <span className="text-xs text-slate-500">เลือก Fields ครบแล้ว</span>}
            </div>
          )}
          <div className="max-h-[38vh] min-h-64 overflow-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <tr>{['#', 'Fields Name', 'Type', 'Length', 'Allow Nulls', 'Default', 'Description', ''].map((heading) => <th key={heading} className="px-3 py-2.5">{heading}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedColumns.map((field, index) => <FieldRow key={field.name} field={field} index={index} readOnly={readOnly} onRemove={() => removeField(field.name)} />)}
                {!selectedColumns.length && <tr><td colSpan={8} className="h-56 text-center text-sm text-slate-400">ยังไม่มี Field ที่เลือกจาก Table/View นี้</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 pt-2 text-xs text-slate-400">แสดง {selectedColumns.length} Fields จาก {viewFields.length} คอลัมน์ใน {draft.view}</div>
        </section>

        <section className="border-b border-slate-200 pb-4">
          {readOnly ? <h2 className="py-2 text-sm font-semibold text-slate-800">Conditions <span className="text-xs font-normal text-slate-400">{draft.conditions.length}</span></h2> : <button type="button" onClick={() => setConditionsOpen((open) => !open)} className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-800"><span aria-hidden="true">{conditionsOpen ? '▾' : '▸'}</span> Conditions <span className="text-xs font-normal text-slate-400">{draft.conditions.length}</span></button>}
          {conditionsOpen && <>
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 py-3">
              <select disabled={readOnly} value={draft.conditionLogic} onChange={(event) => setDraft((current) => ({ ...current, conditionLogic: event.target.value as ConditionLogic }))} className={`${inputClass} w-auto`} aria-label="เงื่อนไขเชื่อม">
                <option value="AND">AND</option><option value="OR">OR</option>
              </select>
              {!readOnly && <select value="" onChange={(event) => addCondition(event.target.value)} className={`${inputClass} w-auto`} aria-label="เพิ่มเงื่อนไข Field">
                <option value="" disabled>+ Fields</option>{viewFields.map((field) => <option key={field.name} value={field.name}>{field.name}</option>)}
              </select>}
              {!readOnly && <span className="text-xs text-slate-500">เลือก Field เพื่อเพิ่มเงื่อนไข</span>}
            </div>
            <div className="space-y-2 py-3">
              {draft.conditions.map((condition) => <ConditionRow key={condition.id} condition={condition} viewFields={viewFields} controlClass={inputClass} readOnly={readOnly} onChange={(next) => setDraft((current) => ({ ...current, conditions: current.conditions.map((item) => item.id === condition.id ? next : item) }))} onRemove={() => setDraft((current) => ({ ...current, conditions: current.conditions.filter((item) => item.id !== condition.id) }))} />)}
            </div>
          </>}
        </section>

        {!readOnly ? <div className="flex flex-wrap justify-end gap-2 pt-1">
          <button type="button" onClick={() => setPreviewOpen(true)} className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">Preview</button>
          <button type="submit" className="rounded-md bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700">Save</button>
        </div> : <div className="flex justify-end border-t border-slate-200 pt-4"><button type="button" disabled={restoreDisabled} onClick={onRestore} className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50">นำกลับมาใช้</button></div>}
      </form>
      {previewOpen && <PreviewDialog name={draft.name} columns={selectedColumns} onClose={() => setPreviewOpen(false)} />}
      </div>
    </>
  )
}

function FieldRow({ field, index, readOnly, onRemove }: { field: ViewField; index: number; readOnly: boolean; onRemove: () => void }) {
  return (
    <tr className="text-slate-700">
      <td className="px-3 py-2 text-slate-500">{index + 1}</td><td className="px-3 py-2 font-medium">{field.name}</td><td className="px-3 py-2">{field.type}</td><td className="px-3 py-2">{field.length}</td><td className="px-3 py-2">{field.allowNull ? 'Yes' : 'No'}</td><td className="px-3 py-2">{field.defaultValue}</td><td className="px-3 py-2">{field.description}</td><td className="px-3 py-2">{!readOnly && <button type="button" onClick={onRemove} className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`เอา ${field.name} ออก`}><Trash2 className="h-4 w-4" /></button>}</td>
    </tr>
  )
}

function ConditionRow({ condition, viewFields, controlClass, readOnly, onChange, onRemove }: { condition: DynamicApiCondition; viewFields: ViewField[]; controlClass: string; readOnly: boolean; onChange: (condition: DynamicApiCondition) => void; onRemove: () => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(140px,1fr)_150px_minmax(120px,1fr)_auto]">
      <select disabled={readOnly} value={condition.field} onChange={(event) => onChange({ ...condition, field: event.target.value })} className={controlClass}>{viewFields.map((field) => <option key={field.name} value={field.name}>{field.name}</option>)}</select>
      <select disabled={readOnly} value={condition.operator} onChange={(event) => onChange({ ...condition, operator: event.target.value })} className={controlClass}>{['Equals', 'Not Equals', 'Contains', 'Greater Than', 'Less Than'].map((operator) => <option key={operator}>{operator}</option>)}</select>
      <input disabled={readOnly} value={condition.value} onChange={(event) => onChange({ ...condition, value: event.target.value })} placeholder="Value" className={controlClass} />
      {!readOnly && <button type="button" onClick={onRemove} className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="ลบเงื่อนไข"><X className="h-4 w-4" /></button>}
    </div>
  )
}

function PreviewDialog({ name, columns, onClose }: { name: string; columns: ViewField[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="dynamic-api-preview-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-4xl overflow-hidden rounded-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h2 id="dynamic-api-preview-title" className="font-semibold text-slate-900">Preview: {name || 'New API'}</h2><button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="ปิด Preview"><X className="h-5 w-5" /></button></div>
        <div className="overflow-x-auto p-4"><table className="w-full min-w-max text-left text-sm"><thead><tr>{columns.map((field) => <th key={field.name} className="border-b border-slate-200 px-3 py-2">{field.name}</th>)}</tr></thead><tbody><tr>{columns.map((field) => <td key={field.name} className="px-3 py-3 text-slate-400">{field.type}</td>)}</tr></tbody></table>{!columns.length && <p className="py-8 text-center text-sm text-slate-500">เลือก Fields ก่อนดูตัวอย่าง</p>}</div>
        <div className="flex justify-end border-t border-slate-100 px-5 py-3"><button type="button" onClick={onClose} className="rounded-md bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">ปิด</button></div>
      </section>
    </div>
  )
}