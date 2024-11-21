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
