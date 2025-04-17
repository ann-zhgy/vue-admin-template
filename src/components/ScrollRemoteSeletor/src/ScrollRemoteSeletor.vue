<script lang="tsx">
import {
  ComputedRef,
  defineComponent,
  ExtractPropTypes,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  shallowRef,
  unref,
  watch
} from 'vue'
import { ModelValue, propOptions, QueryOptionItemsParam } from './types'
import { ElMessage, ElOption, ElSelect } from 'element-plus'
import { v7 as uuidv7 } from 'uuid'

export default defineComponent({
  name: 'ScrollRemoteSeletor',
  props: propOptions,
  emits: ['update:modelValue', 'change', 'remove-tag', 'clear', 'blur', 'focus'],
  setup(props, { emit, expose }) {
    const selectRef = ref<{
      focus: () => void
      blur: () => void
      selectedLabel: () => ComputedRef<string | string[]>
    } | null>(null)
    expose({
      focus: selectRef.value?.focus,
      blur: selectRef.value?.blur,
      selectedLabel: selectRef.value?.selectedLabel
    })

    const {
      modelValue,
      initOptionItems,
      optionKey,
      optionLabel,
      optionValue,
      optionDisabled,
      lastPageTip,
      pageSize,
      remoteMethod,
      loading,
      filterable,
      remote,
      popperClass,
      ...otherProps
    } = props
    const otherPropsValue = shallowRef(otherProps)
    const selectedValue = ref(modelValue)

    watch(
      () => props.modelValue,
      (val: string) => {
        if (val === unref(selectedValue)) return
        selectedValue.value = val
      }
    )
    watch(
      () => selectedValue.value,
      (val) => {
        emit('update:modelValue', val)
      },
      { deep: true }
    )
    watch(
      () => props,
      (val: ExtractPropTypes<typeof propOptions>) => {
        const {
          modelValue,
          initOptionItems,
          optionKey,
          optionLabel,
          optionValue,
          optionDisabled,
          lastPageTip,
          pageSize,
          remoteMethod,
          loading,
          filterable,
          remote,
          popperClass,
          ...otherProps
        } = val
        otherPropsValue.value = otherProps as any
        if (optionItems.value && optionItems.value.length > 0) return
        optionItems.value = val.initOptionItems
      },
      { deep: true }
    )
    const optionItems = ref<JsonObject[]>([])

    const loadmoreClass = ref('random-class-' + uuidv7().replace(/-/g, ''))
    const queryParam = reactive<QueryOptionItemsParam>({
      pageNo: 1,
      pageSize: pageSize,
      keyword: ''
    })
    const pageInfo = reactive<{ total: number; totalPage: number }>({
      total: 0,
      totalPage: 0
    })

    const isLoading = ref(false)
    const queryOptionItems = async () => {
      try {
        isLoading.value = true
        const data = await remoteMethod!(queryParam)
        pageInfo.total = data.totalCount ?? 0
        pageInfo.totalPage = data.totalPage ?? 0
        if (data.items) {
          data.items.forEach((item) => {
            if (!optionItems.value.find((i) => i[optionValue!] === item[optionValue!])) {
              optionItems.value.push(item)
            }
          })
        }
      } finally {
        isLoading.value = false
      }
    }

    function scrollAction() {
      // 判断是否到底
      const isBase = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (isBase) {
        // 可以增加防抖，用户体验会更好，视情况而定
        setTimeout(() => {
          onLoadmore && onLoadmore()
        }, 300)
      }
    }

    onMounted(() => {
      const selectDom = document.querySelector(`.${loadmoreClass.value} .el-select-dropdown__wrap`)
      selectDom?.addEventListener('scroll', scrollAction.bind(selectDom))
    })

    onUnmounted(() => {
      const selectDom = document.querySelector(`.${loadmoreClass.value} .el-select-dropdown__wrap`)
      selectDom?.removeEventListener('scroll', scrollAction.bind(selectDom))
    })

    const handleDropdownVisibleChange = async (open: boolean) => {
      if (!open) {
        optionItems.value = props.initOptionItems ?? []
        queryParam.pageNo = 1
        queryParam.keyword = undefined
      } else {
        queryOptionItems()
        // selectV2 的获取option节点渲染时机很迟，使用 nextTick 都获取不到，所以不能用这玩意了
        // nextTick(() => {
        // })
      }
    }
    // 下拉框滚动
    const onLoadmore = async () => {
      if (queryParam.pageNo >= pageInfo.totalPage) {
        ElMessage.warning(lastPageTip)
        return
      }
      queryParam.pageNo++
      const data = await remoteMethod!(queryParam)
      data.items?.forEach((item) => {
        optionItems.value.push(item)
      })
    }

    return () => (
      <ElSelect
        ref={selectRef}
        v-model={selectedValue.value}
        loading={isLoading.value}
        filterable
        popperClass={loadmoreClass.value}
        remote
        remoteMethod={queryOptionItems}
        {...unref(otherPropsValue)}
        onVisible-change={handleDropdownVisibleChange}
        onChange={(value: ModelValue) => emit('change', value)}
        onRemove-tag={(value: ModelValue) => emit('remove-tag', value)}
        onClear={() => emit('clear')}
        onBlur={(event: FocusEvent) => emit('blur', event)}
        onFocus={(event: FocusEvent) => emit('focus', event)}
      >
        {optionItems.value.map((item) => {
          return (
            <ElOption
              key={item[optionKey!]}
              label={item[optionLabel!]}
              value={item[optionValue!]}
              disabled={optionDisabled(item)}
            />
          )
        })}
      </ElSelect>
    )
  }
})
</script>
