<template>
  <v-app>
    <v-app-bar app color="primary" dark fixed>
      <v-btn v-if="toHome !== null" icon :to="toHome">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <v-spacer />
      <a style="color: white; opacity: 0.2" :href="commitUrl" target="_blank">{{ commitHash7 }}</a>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, SetupContext, toRefs } from '@vue/composition-api'
import { Env } from '@/env'
import { Location } from 'vue-router'
import { RouteLocations, RouteNames } from '@/router/models'
import { Sample, SampleIds } from '@/models/sample'

type State = {
  //
}
export default defineComponent({
  components: {},
  setup(_: unknown, context: SetupContext) {
    const state = reactive<State>({})
    const commitHash7 = Env.commitHash?.substring(0, 7) ?? ''
    const commitUrl = Env.commitUrl

    const title = computed<string>(() => {
      const routeName = context.root.$route.name
      switch (routeName) {
        case RouteNames.Sample1:
          return Sample.find(SampleIds.One).title
        case RouteNames.Sample2:
          return Sample.find(SampleIds.Two).title
        case RouteNames.Sample3:
          return Sample.find(SampleIds.Three).title
        case RouteNames.Sample4:
          return Sample.find(SampleIds.Four).title
        default:
          return process.env.VUE_APP_TITLE
      }
    })

    const toHome = computed<Location | null>(() => {
      const routeName = context.root.$route.name
      const apiKey = context.root.$route.params.apiKey
      if (apiKey) {
        switch (routeName) {
          case RouteNames.Sample1:
          case RouteNames.Sample2:
          case RouteNames.Sample3:
          case RouteNames.Sample4:
            return RouteLocations.toHome(apiKey)
        }
      }

      return null
    })

    return {
      ...toRefs(state),
      title,
      commitHash7,
      commitUrl,
      toHome,
    }
  },
})
</script>

<style lang="scss" scoped></style>
