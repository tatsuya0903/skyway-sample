<template>
  <div class="layout-page">
    <div class="layout-page__header">
      <slot name="header">
        <AppBar />
      </slot>
    </div>
    <div class="layout-page__main" :style="{ overflow: scroll ? 'auto' : 'hidden' }">
      <slot name="main" />
    </div>
    <div class="layout-page__footer">
      <slot name="footer" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import AppBar from '@/components/AppBar.vue'

// eslint-disable-next-line @typescript-eslint/ban-types
type State = {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Props = {
  scroll: boolean
}
export default defineComponent({
  components: { AppBar },
  props: {
    scroll: { type: Boolean, default: true },
  },
  setup() {
    const state = reactive<State>({})
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.layout-page {
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .layout-page__header {
  }
  .layout-page__main {
    position: relative;
    flex: 1;
    width: 100%;
  }
  .layout-page__footer {
  }
}
</style>
