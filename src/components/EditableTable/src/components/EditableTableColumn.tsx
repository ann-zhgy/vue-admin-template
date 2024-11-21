import { ElFormItem, ElTableColumn, FormItemRule } from 'element-plus'
import { defineComponent, inject, Ref, SlotsType } from 'vue'
import { buildTableFormKey, EditableTableState } from '../types'

export default defineComponent({
  name: 'EditableTableColumn',
  props: {
    prop: {
      type: String,
      default: () => null
    },
    property: {
      type: String,
      default: () => null
    },
    rules: {
      type: Array<FormItemRule>,
      default: () => []
    }
  },
  slots: Object as SlotsType<{
    show?: { row: any; column: any }
    edit: { row: any; column: any }
    default: { row: any; column: any }
  }>,
  setup(props, { attrs, slots }) {
    const property: string = props.prop ?? props.property
    const editableTableState = inject<Ref<EditableTableState>>('editableTableState')

    const isShowState = (index: number, columnId: string) => {
      return editableTableState!.value[index].editableColIds.indexOf(columnId) === -1
    }

    return () => (
      <ElTableColumn {...attrs} property={property}>
        {{
          default: (scope: any) =>
            property ? (
              isShowState(scope.$index, scope.column.id) ? (
                slots.show ? (
                  slots.show({ ...scope, row: scope.row })
                ) : (
                  scope.row[property]
                )
              ) : (
                <ElFormItem
                  rules={props.rules}
                  prop={buildTableFormKey(scope.$index, property)}
                  key={buildTableFormKey(scope.$index, property)}
                >
                  {slots.edit({ ...scope, row: scope.row })}
                </ElFormItem>
              )
            ) : (
              slots.default({ ...scope, row: scope.row })
            )
        }}
      </ElTableColumn>
    )
  }
})
