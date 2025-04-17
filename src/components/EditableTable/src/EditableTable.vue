<script lang="tsx">
import { defineComponent, nextTick, PropType, provide, ref, SlotsType, watch } from 'vue'
import {
  buildTableFormKey,
  EditableTableData,
  EditableTableFormData,
  EditableTableFormRules,
  EditableTableState,
  TableEditState
} from './types'
import {
  Column,
  ElTable,
  ElForm,
  ElPopconfirm,
  ElButton,
  FormValidateCallback,
  FormItemProp,
  FormValidationResult,
  ElTooltip,
  CellCls,
  TableColumnCtx
} from 'element-plus'
import type { RuleItem, Rules } from 'async-validator'
import { useI18n } from '@/hooks/web/useI18n'
import Schema from 'async-validator'

const ROW_INDEX_KEY: string = '1_editable_table_row_index'

declare type CellClassNameHandle = (context: {
  row: any
  rowIndex: number
  column: TableColumnCtx<any>
  columnIndex: number
}) => string

export default defineComponent({
  name: 'EditableTable',
  props: {
    data: {
      type: Array<Record<string, any>>,
      default: () => []
    },
    defaultRow: {
      type: Object,
      default: () => {
        return {}
      }
    },
    cellClassName: {
      type: Function as PropType<CellClassNameHandle>,
      default: () => {
        return (() => '') as CellClassNameHandle
      }
    }
  },
  slots: Object as SlotsType<{
    default: any
  }>,
  setup(props, { attrs, slots }) {
    const columnPropertyInfo = slots
      .default()
      .filter((item: { props: { prop: any } }) => item.props.prop)
      .map(
        (item: {
          props: { prop: string; label: string | undefined; rules: RuleItem[] | undefined }
        }) => {
          return {
            prop: item.props.prop,
            lable: item.props.label,
            rules: item.props.rules
          } as Record<string, any>
        }
      )
    const buildFormData = (
      propsData: object[]
    ): { formData: EditableTableFormData; formRules: EditableTableFormRules } => {
      const formData: EditableTableFormData = {}
      const formRules: EditableTableFormRules = {}
      propsData.forEach((data, index) => {
        columnPropertyInfo.forEach((item: { prop: string; rules: any }) => {
          const tableFormKey = buildTableFormKey(index, item.prop)
          formData[tableFormKey] = data[item.prop]
          formRules[tableFormKey] = item.rules ?? []
        })
      })
      return { formData, formRules }
    }
    const editableTableData = ref<EditableTableData>([])
    const editableTableState = ref<EditableTableState>({
      formData: {},
      formRules: {},
      editingCell: []
    })

    provide('editableTableState', editableTableState)

    const isUpdateCell = (value: any[], oldValue: any[] | undefined): boolean => {
      if (value.length !== oldValue?.length) {
        return false
      }
      let diffCount = 0
      for (let index = 0; index < value.length; index++) {
        const item = value[index]
        const oldItem = oldValue[index]
        if (item === oldItem) {
          continue
        }
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            if (oldItem[key] !== item[key]) diffCount++
            if (diffCount > 1) return false
          }
        }
      }
      return true
    }

    watch(
      () => props.data,
      (newValue, oldValue) => {
        editableTableData.value = newValue
        const oldRowState = editableTableState.value.editingCell
        editableTableState.value = {
          ...buildFormData(newValue),
          editingCell: []
        }
        if (isUpdateCell(newValue, oldValue)) {
          editableTableState.value.editingCell = oldRowState
          return
        }
        // 检验字段值
        const validator = new Schema(editableTableState.value.formRules)
        validator.validate(editableTableState.value.formData, {}, (errors, _fields) => {
          errors?.forEach((item) => {
            if (item.field) {
              editableTableState.value.editingCell.push(item.field)
            }
          })
        })
        nextTick(() => {
          formRef.value?.validateField(editableTableState.value.editingCell)
        })
      },
      { deep: true, immediate: true }
    )

    const initRowStateRefByRow = (rowData: any, index: number) => {
      const formPropKeys: string[] = []
      const validatorRules: Rules = {}
      const rowDataTemp = rowData ? { ...rowData } : {}
      // 填充字段值
      columnPropertyInfo.forEach((item: { prop: string; rules: any }) => {
        const tableFormKey = buildTableFormKey(index, item.prop)
        if (item.prop in rowDataTemp) {
          editableTableState.value.formData[tableFormKey] = rowDataTemp[item.prop]
        } else {
          rowDataTemp[item.prop] = null
          editableTableState.value.formData[tableFormKey] = null
        }
        formPropKeys.push(tableFormKey)
        validatorRules[tableFormKey] = item.rules ?? []
      })
      // 检验字段值
      const validator = new Schema(validatorRules)
      validator.validate(editableTableState.value.formData, {}, (errors, _fields) => {
        errors?.forEach((item) => {
          if (item.field) {
            editableTableState.value.editingCell.push(item.field)
          }
        })
      })
      editableTableData.value.push(rowDataTemp)
      nextTick(() => {
        formRef.value?.validateField(formPropKeys)
      })
    }

    // clearValidate resetFields scrollToField validate validateField
    const formRef = ref<{
      validateField: (
        props?: FormItemProp[] | undefined,
        callback?: FormValidateCallback | undefined
      ) => FormValidationResult
      [key: string]: any
    } | null>(null)
    const elTableRef = ref<InstanceType<typeof ElTable> | null>(null)
    const addRow = () => {
      dbClick(() => initRowStateRefByRow(props.defaultRow ?? {}, editableTableData.value.length))
    }

    let addRowLastClickTime: number = 0
    const dbClick = (task: () => void) => {
      const currentTime = new Date().getTime()
      const timeDifference = currentTime - addRowLastClickTime

      // 设置一个合理的阈值，例如300毫秒内两次点击视为双击
      if (timeDifference < 300) {
        // 这里是双击事件的处理逻辑
        task()
        // 清除上一次点击的时间戳，避免连续的双击被视为更多的双击
        addRowLastClickTime = 0
      } else {
        // 单击时不执行任何操作，但是记录这次点击的时间
        addRowLastClickTime = currentTime
      }
    }

    const tableEditState = ref<TableEditState>({ showMenu: false, currentRowIndex: -1 })
    const cellDblclick = (
      row: Record<string | number | symbol, any>,
      column: TableColumnCtx<any>,
      cell: HTMLTableCellElement
    ) => {
      editableTableState.value.editingCell.push(
        buildTableFormKey(row[ROW_INDEX_KEY], column.property)
      )

      nextTick(() => {
        // 如果内部是 input，获取焦点
        const element = findEditableChildren(cell)
        if (element) {
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.focus()
          }
        }
      })
    }

    function cellMouseLeave(row: any, column: Column, cell: HTMLTableCellElement) {
      const rowIndex = editableTableData.value.indexOf(row)
      const key = buildTableFormKey(rowIndex, column.property)
      if (editableTableState.value.editingCell.indexOf(key) === -1) {
        return
      }
      const element = findEditableChildren(cell)
      if (!element || element.tagName === 'DIV') {
        return
      }
      formRef.value?.validateField([key], (isValid: boolean) => {
        if (isValid) {
          const columnIdIndex = editableTableState.value.editingCell.indexOf(key)
          if (columnIdIndex !== -1) editableTableState.value.editingCell.splice(columnIdIndex, 1)
        }
      })
    }

    /**
     * 获取单元格节点下面的Form表单节点元素
     *
     * @param cell html节点，此组件中为单元格节点
     */
    function findEditableChildren(cell: Element): HTMLElement | null {
      if (cell.children.length === 1) {
        if (cell.children[0].nodeType === 1 && cell.children[0].tagName !== 'DIV') {
          return cell.children[0] as HTMLElement
        }
      }
      for (let i = 0; i < cell.children.length; i++) {
        const element = cell.children[i]
        if (element.tagName !== 'DIV') {
          continue
        }
        const result = findEditableChildren(element)
        if (result) return result
      }
      return null
    }

    function rightClick(row: any, _column: Column, $event: MouseEvent) {
      $event.preventDefault()
      tableEditState.value.showMenu = false
      locateMenu('contextmenu', 140, $event)
      tableEditState.value.showMenu = true
      tableEditState.value.currentRowIndex = editableTableData.value.indexOf(row)
    }

    /**
     * 定位菜单元素在表格中的位置
     * 此函数旨在根据鼠标点击位置和表格容器的位置，计算并设置菜单元素（如删除框）的位置
     * 它还考虑了窗口的宽度，以确保菜单元素在窗口右侧不会超出边界
     *
     * @param eleId {string} - 菜单元素的ID，用于获取该元素
     * @param eleWidth {number} - 菜单元素的宽度，用于判断是否需要调整元素位置以适应窗口边界
     * @param $event {MouseEvent} - 鼠标事件，包含鼠标点击位置的坐标
     */
    function locateMenu(eleId: string, eleWidth: number, $event: MouseEvent) {
      // 表格容器的位置
      const { x: tbX, y: tbY } = document.getElementById('tableRef')!.getBoundingClientRect()
      // console.log('表格位置', tbX, tbY)
      // 当前鼠标位置
      const { x: pX, y: pY } = $event
      // console.log('鼠标位置', pX, pY)
      const ele = document.getElementById(eleId)
      ele!.style.top = pY - tbY - 6 + 'px'
      ele!.style.left = pX - tbX - 6 + 'px'
      // console.log('删除框位置', ele!.style.top, ele!.style.left)
      if (window.innerWidth - eleWidth < pX) {
        ele!.style.left = 'unset'
        ele!.style.right = '0'
      }
    }

    /**
     * 删除行
     */
    const delRow = () => {
      const currentRowIndex = tableEditState.value.currentRowIndex
      if (currentRowIndex !== -1) {
        editableTableData.value.splice(currentRowIndex, 1)
        editableTableState.value.editingCell.splice(currentRowIndex, 1)
        const item = editableTableData.value[currentRowIndex]
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            delete editableTableState.value.formData[buildTableFormKey(currentRowIndex, key)]
          }
        }
      }
      tableEditState.value.showMenu = false
    }

    const { t } = useI18n()

    const editCellClassName: CellCls<any> = (context): string => {
      context.row[ROW_INDEX_KEY] = context.rowIndex
      return !props.cellClassName ? '' : props.cellClassName(context)
    }

    return () => (
      <ElTooltip
        class="box-item"
        effect="light"
        content="双击表头添加行，双击单元格修改数据，在行上面右键可选择删除行"
        placement="top-end"
        autoClose={2000}
      >
        <div class="tb-container" id="tableRef">
          <ElForm style={{ width: '100%' }} ref={formRef} model={editableTableState.value.formData}>
            <ElTable
              data={editableTableData.value}
              {...attrs}
              ref={elTableRef}
              cellClassName={editCellClassName}
              onCell-dblclick={cellDblclick}
              onCell-mouse-leave={cellMouseLeave}
              onRow-contextmenu={rightClick}
              onHeader-click={addRow}
            >
              {slots.default()}
            </ElTable>
          </ElForm>

          <div
            v-show={tableEditState.value.showMenu}
            onMouseleave={() => (tableEditState.value.showMenu = false)}
            id="contextmenu"
          >
            <ElPopconfirm
              title={t('components.editableTable.popconfirmTitle')}
              onConfirm={delRow}
              teleported={false}
              onCancel={() => (tableEditState.value.showMenu = false)}
            >
              {{
                reference: () => (
                  <ElButton type="primary">
                    {t('components.editableTable.popconfirmButtonContent')}
                  </ElButton>
                )
              }}
            </ElPopconfirm>
          </div>
        </div>
      </ElTooltip>
    )
  }
})
</script>

<style lang="less" scoped>
.tb-container {
  position: relative;
}

#contextmenu {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  width: 120px;
  height: auto;
  padding: 10px;
  background-color: #f4f4f4;
  border: 1px solid #999;
  border-radius: 3px;

  button {
    display: block;
    margin: 0 0 5px;
  }
}

.hideContextMenu {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
