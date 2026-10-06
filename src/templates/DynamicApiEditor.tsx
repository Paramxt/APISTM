import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowLeft, Check, Copy, Download, Plus, Trash2, X } from 'lucide-react'
import { dataSources, dynamicApis, groupApis, type ConditionLogic, type DynamicApiCondition, type DynamicApiConditionGroup } from './apistm2/mock'
import { getFieldsForView, getViewsForDataSource, type ViewField } from './dynamicApiCatalog'

type DynamicApiRecord = (typeof dynamicApis)[number]
export type DynamicApiDraft = Omit<DynamicApiRecord, 'id' | 'groupName' | 'dataSourceName' | 'endpoint' | 'url' | 'fields' | 'selectedFields' | 'conditions' | 'conditionLogic' | 'conditionGroups'> & {
  fields: number
  selectedFields: string[]
  conditions: DynamicApiCondition[]
  conditionLogic: ConditionLogic
  conditionGroups: DynamicApiConditionGroup[]
}

export default function DynamicApiEditor({ api, variant, onClose, onSave, readOnly = false, restoreDisabled = false, onRestore }: { api: DynamicApiRecord | null; variant: 'apistm2' | 'apistm4'; onClose: () => void; onSave: (draft: DynamicApiDraft) => void; readOnly?: boolean; restoreDisabled?: boolean; onRestore?: () => void }) {
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
      conditionGroups: api?.conditionGroups ?? (api?.conditions?.length ? [{ id: 1, logic: api.conditionLogic ?? 'AND', joinWith: 'AND', conditions: api.conditions }] : []),
      version: api?.version ?? 'v1.0',
      path: api?.path ?? '',
      status: api?.status ?? 'active',
    }
  })
  const [showFieldPicker, setShowFieldPicker] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [conditionPreviewOpen, setConditionPreviewOpen] = useState(false)
  const [conditionsOpen, setConditionsOpen] = useState(true)
  const classic = variant === 'apistm2'
  const inputClass = `min-w-0 border bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${classic ? 'rounded-full border-slate-200 bg-slate-50' : 'rounded-lg border-slate-300'}`
  const surfaceClass = classic ? 'rounded-2xl bg-white shadow-sm' : 'rounded-xl border border-slate-200 bg-white shadow-sm'
  const views = getViewsForDataSource(draft.dataSourceId)
  const viewFields = getFieldsForView(draft.dataSourceId, draft.view)
  const selectedColumns = draft.selectedFields.flatMap((name) => {
    const field = viewFields.find((column) => column.name === name)
    return field ? [field] : []
  })
  const availableFields = viewFields.filter((field) => !draft.selectedFields.includes(field.name))

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = draft.name.trim()
    const path = draft.path.trim().replace(/^\/+/, '') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    onSave({ ...draft, conditions: draft.conditionGroups.flatMap((group) => group.conditions), name, version: draft.version.trim(), path, fields: draft.selectedFields.length })
  }

  function addField(name: string) {
    if (!name) return
    setDraft((current) => ({ ...current, selectedFields: [...current.selectedFields, name], fields: current.selectedFields.length + 1 }))
    setShowFieldPicker(false)
  }

  function removeField(name: string) {
    setDraft((current) => {
      const selectedFields = current.selectedFields.filter((fieldName) => fieldName !== name)
      const conditionGroups = current.conditionGroups.map((group) => ({ ...group, conditions: group.conditions.filter((condition) => condition.field !== name) })).filter((group) => group.conditions.length)
      return { ...current, selectedFields, fields: selectedFields.length, conditions: conditionGroups.flatMap((group) => group.conditions), conditionGroups }
    })
  }

  function changeDataSource(dataSourceId: number) {
    const nextView = getViewsForDataSource(dataSourceId)[0]?.name ?? ''
    setDraft((current) => ({ ...current, dataSourceId, view: nextView, selectedFields: [], fields: 0, conditions: [], conditionGroups: [] }))
  }

  function changeView(view: string) {
    setDraft((current) => ({ ...current, view, selectedFields: [], fields: 0, conditions: [], conditionGroups: [] }))
  }

  function addCondition(fieldName: string, groupId: number) {
    if (!fieldName) return
    const condition = { id: Date.now(), field: fieldName, operator: 'Equals', value: '', valueSource: 'body' as const }
    setDraft((current) => ({
      ...current,
      conditions: [...current.conditions, condition],
      conditionGroups: current.conditionGroups.map((group) => group.id === groupId ? { ...group, conditions: [...group.conditions, condition] } : group),
    }))
  }

  function addConditionGroup() {
    setDraft((current) => ({ ...current, conditionGroups: [...current.conditionGroups, { id: Date.now(), logic: 'AND', joinWith: current.conditionGroups.length ? 'AND' : 'AND', conditions: [] }] }))
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
    <div className="space-y-5">
      <header className={`flex flex-wrap items-center gap-4 border-b pb-4 ${classic ? 'border-black/10' : 'border-slate-200'}`}>
        <button type="button" onClick={onClose} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-black/5 ${classic ? 'rounded-full bg-black/5' : 'rounded-lg border border-slate-200 bg-white'}`} aria-label="Back"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div>
          <h1 className={`truncate font-semibold text-slate-900 ${classic ? 'text-3xl' : 'text-lg'}`}>{readOnly ? 'View API Version' : api ? 'Edit Dynamic API' : 'Add Dynamic API'}</h1>
          {api && <p className="mt-0.5 text-sm text-slate-500">{api.name}{readOnly && <span className="ml-2 font-mono">{api.version}</span>}</p>}
        </div>
      </header>

      <form onSubmit={submit} className="space-y-4">
        <div className={`grid gap-x-8 gap-y-4 p-4 sm:grid-cols-2 sm:p-5 ${surfaceClass}`}>
          <label className="grid grid-cols-[105px_minmax(0,1fr)] items-center gap-3 text-sm font-medium text-slate-700 sm:grid-cols-[115px_minmax(0,1fr)]">
            API Name *<input required autoFocus={!readOnly} disabled={readOnly} value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className={inputClass} />
          </label>
          <label className="grid grid-cols-[105px_minmax(0,1fr)] items-center gap-3 text-sm font-medium text-slate-700 sm:grid-cols-[115px_minmax(0,1fr)]">
            Group API *<select required disabled={readOnly} value={draft.groupId} onChange={(event) => setDraft((current) => ({ ...current, groupId: Number(event.target.value) }))} className={inputClass}>{groupApis.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select>
          </label>
          {/* <label className="grid grid-cols-[105px_minmax(0,1fr)] items-center gap-3 text-sm font-medium text-slate-700 sm:grid-cols-[115px_minmax(0,1fr)]">
            Data Source *<select required value={draft.dataSourceId} onChange={(event) => changeDataSource(Number(event.target.value))} className={inputClass}>{dataSources.map((source) => <option key={source.id} value={source.id}>{source.name}</option>)}</select>
          </label> */}
          <label className="grid grid-cols-[105px_minmax(0,1fr)] items-center gap-3 text-sm font-medium text-slate-700 sm:grid-cols-[115px_minmax(0,1fr)]">
            Target Data *<select required disabled={readOnly} value={draft.view} onChange={(event) => changeView(event.target.value)} className={inputClass}>{views.map((view) => <option key={view.name} value={view.name}>{view.name}</option>)}</select>
          </label>
          <div className="grid grid-cols-[105px_minmax(0,1fr)] items-center gap-3 text-sm font-medium text-slate-700 sm:grid-cols-[115px_minmax(0,1fr)]">
            Status *<label className={`flex w-fit items-center gap-3 ${readOnly ? '' : 'cursor-pointer'}`}><span className={draft.status === 'inactive' ? 'text-brand-700' : 'text-slate-400'}>Inactive</span><input type="checkbox" disabled={readOnly} checked={draft.status === 'active'} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.checked ? 'active' : 'inactive' }))} className="peer sr-only" /><span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-brand-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" /><span className={draft.status === 'active' ? 'text-brand-700' : 'text-slate-400'}>Active</span></label>
          </div>
        </div>

        <section className={`overflow-hidden ${surfaceClass}`}>
          <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 ${classic ? 'bg-[#e9e5dc] text-slate-900' : 'border-b border-slate-200 bg-slate-50 text-slate-800'}`}>
            <h2 className="text-sm font-semibold">Fields <span className={`ml-1 px-1.5 py-0.5 text-xs ${classic ? 'rounded-full bg-white' : 'rounded bg-white'}`}>{draft.selectedFields.length}</span></h2>
            <div className="flex items-center gap-2">
              {!readOnly && <button type="button" onClick={() => setShowFieldPicker((shown) => !shown)} className={`flex items-center gap-1 border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50 ${classic ? 'rounded-full' : 'rounded-lg'}`}><Plus className="h-3.5 w-3.5" /> Add Field</button>}
              {!readOnly && <button type="button" onClick={exportFields} disabled={!selectedColumns.length} className={`flex items-center gap-1 border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${classic ? 'rounded-full' : 'rounded-lg'}`}><Download className="h-3.5 w-3.5" /> Export Table</button>}
            </div>
          </div>
          {showFieldPicker && (
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 p-3">
              <label htmlFor="add-api-field" className="text-sm font-medium text-slate-700">เลือกคอลัมน์จาก {draft.view}</label>
              <select id="add-api-field" value="" onChange={(event) => addField(event.target.value)} className={`${inputClass} min-w-56`}>
                <option value="" disabled>เลือก Field...</option>
                {availableFields.map((field) => <option key={field.name} value={field.name}>{field.name} ({field.type})</option>)}
              </select>
              {!availableFields.length && <span className="text-xs text-slate-500">เลือก Fields ครบแล้ว</span>}
            </div>
          )}
          <div className="max-h-[38vh] min-h-64 overflow-auto px-2 sm:px-3">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className={`sticky top-0 border-b border-slate-300 text-xs font-semibold text-slate-800 ${classic ? 'bg-[#f9f7f2]' : 'bg-slate-50'}`}>
                <tr>{['#', 'Fields Name', 'Type', 'Length', 'Allow Nulls', 'Default', 'Description', ''].map((heading) => <th key={heading} className="px-3 py-2">{heading}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedColumns.map((field, index) => <FieldRow key={field.name} field={field} index={index} readOnly={readOnly} onRemove={() => removeField(field.name)} />)}
                {!selectedColumns.length && <tr><td colSpan={8} className="h-56 text-center text-sm text-slate-400">ยังไม่มี Field ที่เลือกจาก Table/View นี้</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">แสดง {selectedColumns.length} Fields จาก {viewFields.length} คอลัมน์ใน {draft.view}</div>
        </section>

        <section className={`px-4 pb-4 sm:px-5 ${surfaceClass}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {readOnly ? <h2 className="py-3 text-sm font-semibold text-slate-800">Conditions <span className="text-xs font-normal text-slate-400">{draft.conditionGroups.flatMap((group) => group.conditions).length}</span></h2> : <button type="button" onClick={() => setConditionsOpen((open) => !open)} className="flex items-center gap-2 py-3 text-sm font-semibold text-slate-800"><span aria-hidden="true">{conditionsOpen ? '▾' : '▸'}</span> Conditions <span className="text-xs font-normal text-slate-400">{draft.conditionGroups.flatMap((group) => group.conditions).length}</span></button>}
            {variant === 'apistm4' && <button type="button" onClick={() => setConditionPreviewOpen(true)} className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50">Preview query</button>}
          </div>
          {conditionsOpen && <div className="space-y-3">
            {draft.conditionGroups.map((group, groupIndex) => <section key={group.id} className="space-y-3 rounded-lg border border-slate-200 p-3">
              <div className="flex flex-wrap items-center gap-2">
                {groupIndex > 0 && <><span className="text-xs text-slate-500">Group connector</span><select disabled={readOnly} value={group.joinWith} onChange={(event) => setDraft((current) => ({ ...current, conditionGroups: current.conditionGroups.map((item) => item.id === group.id ? { ...item, joinWith: event.target.value as ConditionLogic } : item) }))} className={`${inputClass} h-9 py-1.5`}><option>AND</option><option>OR</option></select></>}
                <span className="text-xs font-semibold text-slate-600">Group {groupIndex + 1} conditions</span>
                <select disabled={readOnly} value={group.logic} onChange={(event) => setDraft((current) => ({ ...current, conditionGroups: current.conditionGroups.map((item) => item.id === group.id ? { ...item, logic: event.target.value as ConditionLogic } : item) }))} className={`${inputClass} h-9 py-1.5`} aria-label={`Group ${groupIndex + 1} condition logic`}><option>AND</option><option>OR</option></select>
                {!readOnly && <select value="" onChange={(event) => addCondition(event.target.value, group.id)} className={`${inputClass} h-9 w-[104px] shrink-0 px-2 py-1.5 text-xs`} aria-label={`Add condition to group ${groupIndex + 1}`}><option value="" disabled>+ Field</option>{viewFields.map((field) => <option key={field.name} value={field.name}>{field.name}</option>)}</select>}
                {!readOnly && <button type="button" onClick={() => setDraft((current) => ({ ...current, conditionGroups: current.conditionGroups.filter((item) => item.id !== group.id), conditions: current.conditionGroups.filter((item) => item.id !== group.id).flatMap((item) => item.conditions) }))} className="ml-auto text-xs text-rose-600 hover:text-rose-700">Remove group</button>}
              </div>
              {group.conditions.map((condition) => <ConditionRow key={condition.id} condition={condition} viewFields={viewFields} controlClass={inputClass} readOnly={readOnly} onChange={(next) => setDraft((current) => ({ ...current, conditions: current.conditions.map((item) => item.id === condition.id ? next : item), conditionGroups: current.conditionGroups.map((item) => ({ ...item, conditions: item.conditions.map((entry) => entry.id === condition.id ? next : entry) })) }))} onRemove={() => setDraft((current) => ({ ...current, conditions: current.conditions.filter((item) => item.id !== condition.id), conditionGroups: current.conditionGroups.map((item) => ({ ...item, conditions: item.conditions.filter((entry) => entry.id !== condition.id) })) }))} />)}
            </section>)}
            {!readOnly && <button type="button" onClick={addConditionGroup} className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-brand-500 hover:text-brand-700">+ Add condition group</button>}
          </div>}
        </section>

        {!readOnly ? <div className={`flex flex-wrap justify-end gap-3 border-t pt-4 ${classic ? 'border-black/10' : 'border-slate-200'}`}>
          <button type="button" onClick={() => setPreviewOpen(true)} className={`px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 ${classic ? 'rounded-full bg-black/5' : 'rounded-lg bg-slate-100'}`}>Preview</button>
          <button type="submit" className={`bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 ${classic ? 'rounded-full' : 'rounded-lg'}`}>Save</button>
        </div> : <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4"><button type="button" disabled={restoreDisabled} onClick={onRestore} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50">นำกลับมาใช้</button></div>}
      </form>
      {previewOpen && <ApiRequestPreviewDialog api={draft} columns={selectedColumns} onClose={() => setPreviewOpen(false)} />}
      {conditionPreviewOpen && <ConditionQueryPreviewDialog view={draft.view} selectedFields={draft.selectedFields} groups={draft.conditionGroups} onClose={() => setConditionPreviewOpen(false)} />}
    </div>
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
  const valueSource = condition.valueSource ?? (condition.value ? 'fixed' : 'body')
  return (
    <div className="grid items-center gap-2 sm:grid-cols-[minmax(140px,1fr)_150px_minmax(0,1.5fr)_auto]">
      <select disabled={readOnly} value={condition.field} onChange={(event) => onChange({ ...condition, field: event.target.value })} className={`${controlClass} h-9 py-1.5`} title={condition.field}>{viewFields.map((field) => <option key={field.name} value={field.name}>{field.name}</option>)}</select>
      <select disabled={readOnly} value={condition.operator} onChange={(event) => onChange({ ...condition, operator: event.target.value })} className={`${controlClass} h-9 py-1.5`} title={condition.operator}>{['Equals', 'Not Equals', 'Contains', 'Greater Than', 'Less Than', 'IN'].map((operator) => <option key={operator}>{operator}</option>)}</select>
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-9 shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
          <button type="button" disabled={readOnly} onClick={() => onChange({ ...condition, valueSource: 'body', value: '' })} className={`rounded-md px-2.5 py-1.5 ${valueSource === 'body' ? 'bg-white font-semibold text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} aria-label="Use value from request body">Body</button>
          <button type="button" disabled={readOnly} onClick={() => onChange({ ...condition, valueSource: 'fixed' })} className={`rounded-md px-2.5 py-1.5 ${valueSource === 'fixed' ? 'bg-white font-semibold text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} aria-label="Use a fixed value">Fixed</button>
        </div>
        {valueSource === 'body'
          ? <div className="flex min-h-10 min-w-0 flex-1 items-center rounded-lg border border-dashed border-brand-200 bg-brand-50/50 px-3 text-xs text-slate-600">From Body: <code className="ml-1 truncate font-mono font-semibold text-brand-700">{condition.field}</code></div>
          : <input disabled={readOnly} value={condition.value} onChange={(event) => onChange({ ...condition, value: event.target.value, valueSource: 'fixed' })} placeholder={condition.operator === 'IN' ? 'Fixed values, comma separated' : 'Fixed value'} className={`${controlClass} flex-1`} />}
      </div>
      {!readOnly && <button type="button" onClick={onRemove} className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="ลบเงื่อนไข"><X className="h-4 w-4" /></button>}
    </div>
  )
}

function PreviewDialog({ name, columns, onClose }: { name: string; columns: ViewField[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="dynamic-api-preview-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h2 id="dynamic-api-preview-title" className="font-semibold text-slate-900">Preview: {name || 'New API'}</h2><button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="ปิด Preview"><X className="h-5 w-5" /></button></div>
        <div className="overflow-x-auto p-4"><table className="w-full min-w-max text-left text-sm"><thead><tr>{columns.map((field) => <th key={field.name} className="border-b border-slate-200 px-3 py-2">{field.name}</th>)}</tr></thead><tbody><tr>{columns.map((field) => <td key={field.name} className="px-3 py-3 text-slate-400">{field.type}</td>)}</tr></tbody></table>{!columns.length && <p className="py-8 text-center text-sm text-slate-500">เลือก Fields ก่อนดูตัวอย่าง</p>}</div>
        <div className="flex justify-end border-t border-slate-100 px-5 py-3"><button type="button" onClick={onClose} className="rounded-md bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">ปิด</button></div>
      </section>
    </div>
  )
}

function ApiRequestPreviewDialog({ api, columns, onClose }: { api: DynamicApiDraft; columns: ViewField[]; onClose: () => void }) {
  const group = groupApis.find((item) => item.id === api.groupId)
  const version = api.version.trim()
  const path = api.path.trim().replace(/^\/+/, '') || api.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const displayUrl = `https://api.stm.co.th/${path}`
  const conditionGroups = api.conditionGroups.length ? api.conditionGroups : api.conditions.length ? [{ id: 1, logic: api.conditionLogic, joinWith: 'AND' as const, conditions: api.conditions }] : []
  const sampleValue = (type: string) => /int|number|decimal|float/i.test(type) ? 1 : /date|time/i.test(type) ? '2026-09-30' : /bool|bit/i.test(type) ? true : `Sample ${type}`
  const bodyFields = [...new Set(conditionGroups.flatMap((group) => group.conditions
    .filter((condition) => condition.valueSource === 'body' || (!condition.valueSource && !condition.value))
    .map((condition) => condition.field)))]
  const body = Object.fromEntries(bodyFields.map((name) => [name, 'INPUT']))
  const response = { success: true, data: [Object.fromEntries(columns.map((field) => [field.name, sampleValue(field.type)]))], total: 1 }
  const codeClass = 'max-h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-5 text-slate-700'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="dynamic-api-preview-title" onClick={(event) => event.stopPropagation()} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 id="dynamic-api-preview-title" className="font-semibold text-slate-900">Preview: {api.name || 'New API'}</h2><p className="mt-1 text-xs text-slate-500">{group?.name ?? 'No group'} · {version}</p></div><button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close preview"><X className="h-5 w-5" /></button></header>
        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col gap-5">
            <EditorPreviewBlock title="URL"><div className="flex min-w-0 items-center gap-2"><span className="shrink-0 rounded bg-orange-100 px-2 py-1 text-[10px] font-semibold text-orange-700">POST</span><code className="min-w-0 flex-1 break-all rounded-lg bg-slate-50 p-3 font-mono text-sm text-slate-700">{displayUrl}</code></div></EditorPreviewBlock>
            <EditorPreviewBlock title={`Group Token${group ? ` · ${group.name}` : ''}`}><div className="rounded-lg bg-slate-50 p-3"><code className="block break-all font-mono text-sm text-slate-700">{group?.token ?? 'No token available'}</code></div></EditorPreviewBlock>
          </div>
          <section className="flex min-h-0 flex-col gap-2"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-slate-800">Body</h3><span className="rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">User Input</span></div><p className="text-xs text-slate-500">ผู้เรียก API ต้องส่งค่าเหล่านี้มาใน Request Body เมื่อต้องการใช้งาน</p><pre className={`${codeClass} max-h-none flex-1`}>{JSON.stringify(body, null, 2)}</pre></section>
          <div className="lg:col-span-2"><EditorPreviewBlock title="Response"><pre className={codeClass}>{JSON.stringify(response, null, 2)}</pre></EditorPreviewBlock></div>
        </div>
        <footer className="flex justify-end border-t border-slate-100 px-5 py-3"><button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">Close</button></footer>
      </section>
    </div>
  )
}

function EditorPreviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-2"><h3 className="text-sm font-semibold text-slate-800">{title}</h3>{children}</section>
}

function ConditionQueryPreviewDialog({ view, selectedFields, groups, onClose }: { view: string; selectedFields: string[]; groups: DynamicApiConditionGroup[]; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const parameters: { name: string; value: string }[] = []
  let nextParameter = 1
  const quoteIdentifier = (identifier: string) => `[${identifier.replaceAll(']', ']]')}]`
  const clauses = groups.flatMap((group) => {
    const conditions = group.conditions.map((condition) => {
      const field = quoteIdentifier(condition.field)
      const source = condition.valueSource ?? (condition.value ? 'fixed' : 'body')
      let value: string
      if (source === 'body') {
        const name = `@body_${condition.field.replace(/[^a-zA-Z0-9_]/g, '_')}`
        parameters.push({ name, value: `(from request body: ${condition.field})` })
        value = name
      } else if (condition.operator === 'IN') {
        const values = condition.value.split(',').map((item) => item.trim()).filter(Boolean)
        if (!values.length) return ''
        value = `(${values.map((item) => {
          const name = `@p${nextParameter++}`
          parameters.push({ name, value: item })
          return name
        }).join(', ')})`
      } else {
        const name = `@p${nextParameter++}`
        const parameterValue = condition.operator === 'Contains' ? `%${condition.value}%` : condition.value
        parameters.push({ name, value: parameterValue })
        value = name
      }
      const operator = ({ Equals: '=', 'Not Equals': '<>', Contains: 'LIKE', 'Greater Than': '>', 'Less Than': '<', IN: 'IN' } as Record<string, string>)[condition.operator] ?? '=' 
      return `${field} ${operator} ${value}`
    }).filter(Boolean)
    return conditions.length ? [{ clause: `(${conditions.join(` ${group.logic} `)})`, joinWith: group.joinWith }] : []
  })
  const whereClause = clauses.map(({ clause, joinWith }, index) => `${index ? joinWith : 'WHERE'} ${clause}`).join('\n')
  const displayedFields = selectedFields.slice(0, 4).map(quoteIdentifier)
  const selectFields = selectedFields.length > 4 ? [...displayedFields, '...'] : displayedFields
  const query = `SELECT ${selectFields.length ? selectFields.join(', ') : '(no fields selected)'}\nFROM ${quoteIdentifier(view || 'YourView')}${whereClause ? `\n${whereClause}` : ''};`
  const parameterText = parameters.length ? parameters.map(({ name, value }) => `${name} = ${value}`).join('\n') : 'No parameters.'

  async function copyQuery() {
    await navigator.clipboard.writeText(query)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="condition-query-preview-title" onClick={(event) => event.stopPropagation()} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 id="condition-query-preview-title" className="font-semibold text-slate-900">Query preview</h2><p className="mt-1 text-xs text-slate-500">Parameterized SQL generated from the current Conditions</p></div><button type="button" onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close query preview"><X className="h-5 w-5" /></button></header>
        <div className="min-h-0 space-y-4 overflow-y-auto p-5"><div><div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">SQL</h3><button type="button" onClick={copyQuery} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy query'}</button></div><pre className="min-h-56 max-h-[38vh] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-700">{query}</pre></div><div><h3 className="mb-2 text-sm font-semibold text-slate-800">Parameters</h3><pre className="min-h-24 max-h-[24vh] overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-700">{parameterText}</pre></div><p className="text-xs text-slate-500">Preview only. Values are represented as parameters and are not executed.</p></div>
        <footer className="flex justify-end border-t border-slate-100 px-5 py-3"><button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">Close</button></footer>
      </section>
    </div>
  )
}
