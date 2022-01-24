<template>
  <LayoutView>
    <template v-slot:main>
      <v-container>
        <div>ViewSample2.vue</div>
      </v-container>
    </template>
  </LayoutView>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import LayoutView from '@/components/LayoutView.vue'

// eslint-disable-next-line @typescript-eslint/ban-types
type State = {}
export default defineComponent({
  components: { LayoutView },
  setup() {
    const state = reactive<State>({})
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped></style>
