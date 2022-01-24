<template>
  <LayoutView>
    <template v-slot:main>
      <v-container>
        <v-card max-width="480px" style="margin: auto">
          <v-card-text>
            <InputText v-model="apiKey" label="APIキー" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="primary" :disabled="disabled" @click="clickDone">
              <v-icon left>mdi-check</v-icon>
              決定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </template>
  </LayoutView>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'
import { LocalStorage } from '@/localStorage'
import { RouterHelper } from '@/router/helper'
import LayoutView from '@/components/LayoutView.vue'

type State = {
  apiKey: string
}
export default defineComponent({
  components: { LayoutView, InputText },
  setup() {
    const state = reactive<State>({
      apiKey: LocalStorage.apiKey ?? '',
    })

    const disabled = computed<boolean>(() => state.apiKey.length === 0)

    const clickDone = async () => {
      const apiKey = state.apiKey
      if (apiKey.length === 0) {
        return null
      }
      LocalStorage.apiKey = apiKey
      await RouterHelper.moveHome(apiKey)
    }
    return {
      ...toRefs(state),
      disabled,
      clickDone,
    }
  },
})
</script>

<style lang="scss" scoped></style>
