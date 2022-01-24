<template>
  <LayoutView>
    <template v-slot:main>
      <v-container>
        <v-list>
          <template v-for="item in items">
            <v-list-item :key="item.title" :to="item.to">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.subTitle }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-container>
    </template>
  </LayoutView>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { Location } from 'vue-router'
import { Sample } from '@/models/sample'
import LayoutView from '@/components/LayoutView.vue'

type Item = {
  title: string
  subTitle: string
  to: Location
}
// eslint-disable-next-line @typescript-eslint/ban-types
type State = {}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { LayoutView },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({})
    const items: Item[] = Sample.all.map((v) => {
      return {
        title: v.title,
        subTitle: v.subTitle,
        to: v.calcLocation(props.apiKey),
      }
    })

    return {
      ...toRefs(state),
      items,
    }
  },
})
</script>

<style lang="scss" scoped></style>
