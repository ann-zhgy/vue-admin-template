import { RuleItem } from 'async-validator'

export interface TableEditState {
  showMenu: boolean
  currentRowIndex: number
}

export declare type EditableTableData = Record<string | number | symbol, any>[]

export declare type EditableTableFormData = Record<string | number | symbol, any>

export declare type EditableTableFormRules = Record<string | number | symbol, RuleItem[]>

export interface EditableTableState {
  editingCell: string[]
  formData: EditableTableFormData
  formRules: EditableTableFormRules
}

export const buildTableFormKey = (rowIndex: number, fieldName: string): string => {
  return `form.${rowIndex}.${fieldName}`
}
