<template>
  <div>
    <v-card max-width="480px" style="margin: auto">
      <v-card-text>
        <InputText v-model="apiKey" label="APIキー" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" :to="toHome" :disabled="toHome === null">
          <v-icon left>mdi-check</v-icon>
          決定
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'
import { RouteLocations } from '@/router/models'
import { Location } from 'vue-router'

type State = {
  apiKey: string
}
export default defineComponent({
  components: { InputText },
  setup() {
    const state = reactive<State>({
      apiKey: '',
    })

    const toHome = computed<Location | null>(() => {
      if (state.apiKey.length === 0) {
        return null
      }
      return RouteLocations.toHome(state.apiKey)
    })
    return {
      ...toRefs(state),
      toHome,
    }
  },
})
</script>

<style lang="scss" scoped></style>
