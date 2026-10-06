export interface ViewField {
  name: string
  type: string
  length: string
  allowNull: boolean
  defaultValue: string
  description: string
}

interface ViewDefinition {
  name: string
  fields: Omit<ViewField, 'length' | 'allowNull' | 'defaultValue' | 'description'>[]
}

const sourceViews: Record<number, ViewDefinition[]> = {
  1: [
    { name: 'vw_AnnualPlan_Summary', fields: [{ name: 'PlanId', type: 'int' }, { name: 'PlanYear', type: 'smallint' }, { name: 'PlanName', type: 'nvarchar' }, { name: 'DepartmentCode', type: 'varchar' }, { name: 'TotalBudget', type: 'decimal' }, { name: 'ApprovedDate', type: 'datetime' }] },
    { name: 'vw_Plan_Budget', fields: [{ name: 'BudgetId', type: 'int' }, { name: 'PlanId', type: 'int' }, { name: 'BudgetCode', type: 'varchar' }, { name: 'BudgetName', type: 'nvarchar' }, { name: 'Amount', type: 'decimal' }, { name: 'FiscalYear', type: 'smallint' }] },
    { name: 'tbl_AnnualPlan', fields: [{ name: 'PlanId', type: 'int' }, { name: 'PlanCode', type: 'varchar' }, { name: 'PlanName', type: 'nvarchar' }, { name: 'StartDate', type: 'date' }, { name: 'EndDate', type: 'date' }] },
  ],
  2: [
    { name: 'vw_ERS_Employee', fields: [{ name: 'EmployeeId', type: 'int' }, { name: 'EmployeeCode', type: 'varchar' }, { name: 'FirstName', type: 'nvarchar' }, { name: 'LastName', type: 'nvarchar' }, { name: 'Email', type: 'varchar' }, { name: 'OrganizationId', type: 'int' }] },
    { name: 'vw_ERS_LeaveRequest', fields: [{ name: 'RequestId', type: 'int' }, { name: 'EmployeeId', type: 'int' }, { name: 'LeaveType', type: 'nvarchar' }, { name: 'StartDate', type: 'date' }, { name: 'EndDate', type: 'date' }, { name: 'ApprovalStatus', type: 'varchar' }] },
    { name: 'tbl_ERS_Organization', fields: [{ name: 'OrganizationId', type: 'int' }, { name: 'OrganizationCode', type: 'varchar' }, { name: 'OrganizationName', type: 'nvarchar' }, { name: 'ParentId', type: 'int' }] },
  ],
  3: [
    { name: 'vw_pocs_purchase_order', fields: [{ name: 'PurchaseOrderId', type: 'int' }, { name: 'OrderNumber', type: 'varchar' }, { name: 'VendorId', type: 'int' }, { name: 'OrderDate', type: 'date' }, { name: 'TotalAmount', type: 'decimal' }, { name: 'OrderStatus', type: 'varchar' }] },
    { name: 'vw_pocs_vendor', fields: [{ name: 'VendorId', type: 'int' }, { name: 'VendorCode', type: 'varchar' }, { name: 'VendorName', type: 'nvarchar' }, { name: 'TaxNumber', type: 'varchar' }, { name: 'Email', type: 'varchar' }] },
    { name: 'tbl_pocs_product', fields: [{ name: 'ProductId', type: 'int' }, { name: 'ProductCode', type: 'varchar' }, { name: 'ProductName', type: 'nvarchar' }, { name: 'UnitPrice', type: 'decimal' }] },
  ],
  4: [
    { name: 'vw_crm_customer', fields: [{ name: 'CustomerId', type: 'int' }, { name: 'CustomerCode', type: 'varchar' }, { name: 'CustomerName', type: 'nvarchar' }, { name: 'Email', type: 'varchar' }, { name: 'Phone', type: 'varchar' }, { name: 'CreatedDate', type: 'datetime' }] },
    { name: 'vw_crm_contact', fields: [{ name: 'ContactId', type: 'int' }, { name: 'CustomerId', type: 'int' }, { name: 'FirstName', type: 'nvarchar' }, { name: 'LastName', type: 'nvarchar' }, { name: 'Email', type: 'varchar' }] },
    { name: 'tbl_crm_account', fields: [{ name: 'AccountId', type: 'int' }, { name: 'AccountName', type: 'nvarchar' }, { name: 'AccountType', type: 'varchar' }, { name: 'IsActive', type: 'bit' }] },
  ],
  5: [
    { name: 'VW_RPT_KPI', fields: [{ name: 'KpiId', type: 'int' }, { name: 'KpiCode', type: 'varchar' }, { name: 'KpiName', type: 'nvarchar' }, { name: 'KpiValue', type: 'decimal' }, { name: 'Period', type: 'varchar' }, { name: 'UpdatedAt', type: 'datetime' }] },
    { name: 'VW_RPT_MONTHLY', fields: [{ name: 'ReportId', type: 'int' }, { name: 'ReportMonth', type: 'date' }, { name: 'DepartmentCode', type: 'varchar' }, { name: 'TotalAmount', type: 'decimal' }, { name: 'RecordCount', type: 'int' }] },
    { name: 'VW_RPT_EXECUTIVE', fields: [{ name: 'MetricId', type: 'int' }, { name: 'MetricName', type: 'nvarchar' }, { name: 'CurrentValue', type: 'decimal' }, { name: 'PreviousValue', type: 'decimal' }, { name: 'AsOfDate', type: 'date' }] },
  ],
}

function expandFields(definition: ViewDefinition): ViewField[] {
  const baseFields = definition.fields.map((field, index) => ({
    ...field,
    length: field.type === 'int' ? '4' : field.type === 'decimal' ? '18,2' : field.type === 'date' || field.type === 'datetime' ? '-' : '100',
    allowNull: index > 0,
    defaultValue: index === 0 ? '—' : 'NULL',
    description: `${definition.name} ${field.name}`,
  }))
  const extraFields = Array.from({ length: Math.max(0, 20 - baseFields.length) }, (_, index) => {
    const number = String(index + 1).padStart(2, '0')
    return { name: `Attribute${number}`, type: 'nvarchar', length: '100', allowNull: true, defaultValue: 'NULL', description: `Additional attribute ${number}` }
  })
  return [...baseFields, ...extraFields]
}

export function getViewsForDataSource(dataSourceId: number) {
  return (sourceViews[dataSourceId] ?? []).map((view) => ({ ...view, fields: expandFields(view) }))
}

export function getFieldsForView(dataSourceId: number, viewName: string) {
  return getViewsForDataSource(dataSourceId).find((view) => view.name === viewName)?.fields ?? []
}