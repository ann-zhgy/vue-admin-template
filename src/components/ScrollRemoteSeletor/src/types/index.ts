import { PageRequest, PageResult } from '@/axios/types'
import { SelectProps } from 'element-plus/es/components/select/src/select'
import { ExtractPropTypes, PropType } from 'vue'

export interface QueryOptionItemsParam extends PageRequest {
  keyword?: string
}

export declare type ModelValue = string | number | (string | number)[]

export const propOptions = {
  ...SelectProps,
  modelValue: {
    type: [String, Number, Array<String | Number>] as PropType<ModelValue>
  },
  initOptionItems: {
    type: Array as PropType<JsonObject[]>,
    default: () => []
  },
  optionKey: {
    type: String,
    required: true
  },
  optionLabel: {
    type: String,
    required: true
  },
  optionValue: {
    type: String,
    required: true
  },
  optionDisabled: {
    type: Function as PropType<(item: JsonObject) => boolean>,
    default: () => false
  },
  remoteMethod: {
    type: Function as PropType<
      (query: QueryOptionItemsParam) => Promise<PageResult<JsonObject>> | PageResult<JsonObject>
    >,
    required: true
  },
  pageSize: {
    type: Number,
    default: 20
  },
  lastPageTip: {
    type: String,
    default: '没有更多数据了'
  }
}

export type ScrollRemoteSelectorProps = Partial<ExtractPropTypes<typeof propOptions>>

export interface ScrollRemoteSelectorEmits {
  change?: (value: ModelValue) => void
  removeTag?: (tagValue: ModelValue) => void
  clear?: () => void
  blur?: (event: FocusEvent) => void
  focus?: (event: FocusEvent) => void
}
