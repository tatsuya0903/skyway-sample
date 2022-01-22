<template>
  <v-app>
    <v-app-bar app color="primary" dark fixed>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
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

type State = {
  //
}
export default defineComponent({
  components: {},
  setup() {
    const state = reactive<State>({})
    const title = process.env.VUE_APP_TITLE
    return {
      ...toRefs(state),
      title,
    }
  },
})
</script>

<style lang="scss" scoped></style>
