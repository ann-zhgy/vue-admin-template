export interface TableEditState {
  showMenu: boolean
  currentRowIndex: number
}

export interface RowEditState {
  rowIndex: number
  editableColIds: string[]
}

export declare type EditableTableState = RowEditState[]

export interface EditableTableData {
  data: Record<string | number | symbol, any>[]
  formData: Record<string | number | symbol, any>
}

export const buildTableFormKey = (rowIndex: number, fieldName: string): string => {
  return `form.${rowIndex}.${fieldName}`
}

// EditableTable 组件会暴露addRow方法用来在外部添加数据
export interface ExposedEditableTable {
  addRow: (rowData: any) => void
}
