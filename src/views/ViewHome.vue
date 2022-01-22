<template>
  <div>ViewHome.vue</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

// eslint-disable-next-line @typescript-eslint/ban-types
type State = {}
export default defineComponent({
  components: {},
  setup() {
    const state = reactive<State>({})
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped></style>
