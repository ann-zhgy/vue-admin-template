import { ElFormItem, ElTableColumn, FormItemRule } from 'element-plus'
import { defineComponent, SlotsType } from 'vue'
import { buildTableFormKey } from '../types'

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
    return () => (
      <ElTableColumn {...attrs} property={property}>
        {{
          default: (scope: any) =>
            property ? (
              scope.row.rowState.editableColIds.indexOf(scope.column.id) === -1 ? (
                slots.show ? (
                  slots.show({ ...scope, row: scope.row.data })
                ) : (
                  scope.row.data[property]
                )
              ) : (
                <ElFormItem
                  rules={props.rules}
                  prop={buildTableFormKey(scope.$index, property)}
                  key={buildTableFormKey(scope.$index, property)}
                >
                  {slots.edit({ ...scope, row: scope.row.data })}
                </ElFormItem>
              )
            ) : (
              slots.default({ ...scope, row: scope.row.data })
            )
        }}
      </ElTableColumn>
    )
  }
})