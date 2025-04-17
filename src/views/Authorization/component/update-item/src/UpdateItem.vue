<template>
  <el-form label-width="auto" style="max-width: 600px">
    <el-form-item :label="itemTitle">
      <el-tag v-for="item in existsItems" :key="item[optionKey]" closable @close="removeItem(item)">
        {{ item[optionLabel] }}</el-tag
      >
    </el-form-item>
    <el-form-item :label="allItemTitle" style="width: 200px">
      <scroll-remote-seletor
        v-model="value"
        :init-option-items="items"
        :option-key="optionKey"
        :option-value="optionValue"
        :option-label="optionLabel"
        multiple
        :remote-method="queryAllItems"
        @change="selectChange"
      />
    </el-form-item>
  </el-form>
</template>
<script lang="tsx" setup>
import { onMounted, PropType, ref } from 'vue'
import { ScrollRemoteSeletor } from '@/components/ScrollRemoteSeletor'
import { QueryOptionItemsParam } from '@/components/ScrollRemoteSeletor/src/types'
import { PageResult } from '@/axios/types'
import { UpdateItemAction } from '../../index'

defineOptions({
  name: 'UpdateItem'
})

const props = defineProps({
  optionKey: {
    type: String,
    required: true
  },
  optionValue: {
    type: String,
    required: true
  },
  optionLabel: {
    type: String,
    required: true
  },
  itemTitle: {
    type: String,
    required: true
  },
  allItemTitle: {
    type: String,
    required: true
  },
  items: {
    type: Array<JsonObject>,
    required: true
  },
  queryAllItems: {
    type: Function as PropType<(query: QueryOptionItemsParam) => Promise<PageResult<JsonObject>>>,
    required: true
  }
})
const existsItems = ref<JsonObject[]>(props.items.slice())
const value = ref<(string | number)[]>([])
const deletedItems = ref<JsonObject[]>([])
const originValue = ref<(string | number)[]>([])
onMounted(() => {
  value.value = []
  originValue.value = []
  props.items.forEach((i) => {
    if (i[props.optionValue]) {
      value.value.push(i[props.optionValue])
      originValue.value.push(i[props.optionValue])
    }
  })
})
const removeItem = (item: JsonObject) => {
  deletedItems.value.push(item)
  existsItems.value = existsItems.value.filter(
    (i) => i[props.optionValue] !== item[props.optionValue]
  )
  const index = value.value.indexOf(item[props.optionValue])
  if (index !== -1) {
    value.value.splice(index, 1)
  }
}

const selectChange = (value: (string | number)[]) => {
  existsItems.value = props.items.filter((i) => value.includes(i[props.optionValue]))
  deletedItems.value = []
  props.items.forEach((item) => {
    if (!value.includes(item[props.optionValue])) {
      deletedItems.value.push(item)
    }
  })
}

defineExpose<UpdateItemAction>({
  addedItems: () => {
    return value.value.filter((item) => !originValue.value.includes(item))
  },
  deletedItems: () => deletedItems.value.map((item) => item[props.optionValue]),
  finalItems: () => {
    const actAddedItem = value.value.filter(
      (item) => !props.items.some((i) => i[props.optionValue] === item)
    )
    return existsItems.value.map((item) => item[props.optionValue]).concat(actAddedItem)
  }
})
</script>
