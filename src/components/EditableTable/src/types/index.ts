export interface TableEditState {
  showMenu: boolean
  currentRowIndex: number
}

export interface RowEditState {
  rowIndex: number
  editableColIds: string[]
}

export interface EditableTableRow {
  data: Record<string | number | symbol, any>
  rowState: RowEditState
}

export interface EditableTableData {
  data: EditableTableRow[]
  formData: Record<string | number | symbol, any>
}

export const buildTableFormKey = (rowIndex: number, fieldName: string): string => {
  return `form.${rowIndex}.${fieldName}`
}
