<template>
  <v-app>
    <v-app-bar app color="primary" dark fixed>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <v-spacer />
      <div style="color: white; opacity: 0.2">{{ version }}</div>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { Env } from '@/env'

type State = {
  //
}
export default defineComponent({
  components: {},
  setup() {
    const state = reactive<State>({})
    const title = process.env.VUE_APP_TITLE
    const version = Env.commitHash?.substring(0, 7) ?? ''

    return {
      ...toRefs(state),
      title,
      version,
    }
  },
})
</script>

<style lang="scss" scoped></style>
