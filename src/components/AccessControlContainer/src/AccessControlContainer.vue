<script lang="tsx">
import router from '@/router'
import { defineComponent, SlotsType } from 'vue'

export default defineComponent({
  name: 'AccessControlContainer',
  props: {
    flag: {
      type: String,
      required: true
    }
  },
  slots: Object as SlotsType<{
    default: any
    disabled: any
  }>,
  setup(props, { slots }) {
    return () => (
      <>
        {router.currentRoute.value.meta.containerComponentKeys?.indexOf(props.flag) !== -1
          ? slots.default
            ? slots.default()
            : null
          : slots.disabled
            ? slots.disabled()
            : null}
      </>
    )
  }
})
</script>
