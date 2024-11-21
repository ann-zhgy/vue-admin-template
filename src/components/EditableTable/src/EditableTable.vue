<script lang="tsx">
import { defineComponent, nextTick, provide, ref, SlotsType, watch } from 'vue'
import {
  buildTableFormKey,
  EditableTableData,
  EditableTableState,
  RowEditState,
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
  FormValidationResult
} from 'element-plus'
import type { RuleItem, Rules } from 'async-validator'
import { useI18n } from '@/hooks/web/useI18n'
import Schema from 'async-validator'

export default defineComponent({
  name: 'EditableTable',
  props: {
    data: {
      type: Array<Record<string, any>>,
      default: () => []
    },
    defaultRow: {
      type: Object,
      default: () => {}
    }
  },
  slots: Object as SlotsType<{
    default: any
  }>,
  emits: ['update:data'],
  setup(props, { emit, attrs, slots }) {
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
    const buildFormData = (propsData: object[]): Record<string | number | symbol, any> => {
      const result = {}
      propsData.forEach((item, index) => {
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            result[buildTableFormKey(index, key)] = item[key] ?? null
          }
        }
      })
      return result
    }
    const convertPropsDataToEditableData = (propsData: object[]): EditableTableData => {
      return { data: propsData, formData: buildFormData(propsData) }
    }
    const convertPropsDataToEditableState = (propsData: object[]): EditableTableState => {
      return !propsData
        ? []
        : propsData.map((_item, index) => {
            return { rowIndex: index, editableColIds: [] } as RowEditState
          })
    }
    const editableTableData = ref<EditableTableData>(convertPropsDataToEditableData(props.data))
    const editableTableState = ref<EditableTableState>(convertPropsDataToEditableState(props.data))

    provide('editableTableData', editableTableData)
    provide('editableTableState', editableTableState)
    watch(
      editableTableData,
      (newValue) => {
        console.log('editableTableData', newValue)
        emit('update:data', JSON.parse(JSON.stringify(newValue.data)))
      },
      {
        deep: true
      }
    )
    watch(
      props.data,
      (newValue) => {
        console.log('props.data', newValue)
        editableTableData.value = { data: [], formData: {} }
        editableTableState.value = []
        newValue?.forEach((item) => {
          initRefByRow(item)
        })
      },
      {
        deep: true
      }
    )

    const initRefByRow = (rowData: any) => {
      if (!editableTableData.value || !editableTableData.value.data) {
        editableTableData.value.data = []
      }
      const length = editableTableData.value.data.length
      const rowState: RowEditState = { rowIndex: length, editableColIds: [] }
      const formPropKeys: string[] = []
      const validatorRules: Rules = {}
      // 填充字段值
      columnPropertyInfo.forEach((item: { prop: string; rules: any }) => {
        const tableFormKey = buildTableFormKey(length, item.prop)
        editableTableData.value.formData[tableFormKey] = rowData[item.prop]
        formPropKeys.push(tableFormKey)
        validatorRules[tableFormKey] = item.rules ?? []
      })
      // 检验字段值
      const validator = new Schema(validatorRules)
      // debugger
      validator.validate(editableTableData.value.formData, {}, (errors, _fields) => {
        errors?.forEach((item) => {
          if (item.field) {
            const index = formPropKeys.indexOf(item.field as string)
            if (index !== -1) {
              // el-table_1_column_1
              rowState.editableColIds.push(`el-table_1_column_${index + 1}`)
            }
          }
        })
      })
      editableTableData.value.data[length] = rowData
      editableTableState.value[length] = rowState
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
    let addRowLastClickTime: number = 0
    const addRow = () => {
      const currentTime = new Date().getTime()
      const timeDifference = currentTime - addRowLastClickTime

      // 设置一个合理的阈值，例如300毫秒内两次点击视为双击
      if (timeDifference < 300) {
        // 这里是双击事件的处理逻辑
        initRefByRow(props.defaultRow)
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
      column: Column,
      cell: HTMLTableCellElement
    ) => {
      const rowIndex = editableTableData.value.data.indexOf(row)
      editableTableState.value[rowIndex].editableColIds.push(column.id)

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
      const rowIndex = editableTableData.value.data.indexOf(row)
      const rowState = editableTableState.value[rowIndex]
      if (!rowState || rowState.editableColIds.indexOf(column.id) === -1) {
        return
      }
      const element = findEditableChildren(cell)
      if (!element || element.tagName === 'DIV') {
        return
      }
      const key = buildTableFormKey(editableTableData.value.data.indexOf(row), column.property)
      formRef.value?.validateField([key], (isValid: boolean) => {
        if (isValid) {
          const columnIdIndex = rowState.editableColIds.indexOf(column.id)
          if (columnIdIndex !== -1) rowState.editableColIds.splice(columnIdIndex, 1)
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
      tableEditState.value.currentRowIndex = editableTableData.value.data.indexOf(row)
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
        editableTableData.value.data.splice(currentRowIndex, 1)
        editableTableState.value.splice(currentRowIndex, 1)
        const item = editableTableData.value.data[currentRowIndex]
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            delete editableTableData.value.formData[buildTableFormKey(currentRowIndex, key)]
          }
        }
      }
      tableEditState.value.showMenu = false
    }

    const { t } = useI18n()

    return () => (
      <div class="tb-container" id="tableRef">
        <ElForm style={{ width: '100%' }} ref={formRef} model={editableTableData.value.formData}>
          <ElTable
            data={editableTableData.value.data}
            {...attrs}
            ref={elTableRef}
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
            title={t('editableTable.popconfirmTitle')}
            onConfirm={delRow}
            teleported={false}
            onCancel={() => (tableEditState.value.showMenu = false)}
          >
            {{
              reference: () => (
                <ElButton type="primary">{t('editableTable.popconfirmButtonContent')}</ElButton>
              )
            }}
          </ElPopconfirm>
        </div>
      </div>
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
