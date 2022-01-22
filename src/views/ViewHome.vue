<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { Location } from 'vue-router'
import { RouteLocations } from '@/router/models'

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
  components: {},
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({})
    const items: Item[] = [
      {
        title: 'サンプル1',
        subTitle: 'テキスト送受信(P2P)',
        to: RouteLocations.toSample1(props.apiKey),
      },
      {
        title: 'サンプル2',
        subTitle: 'テキスト送受信(ルーム)',
        to: RouteLocations.toSample2(props.apiKey),
      },
      {
        title: 'サンプル3',
        subTitle: 'ファイル共有',
        to: RouteLocations.toSample3(props.apiKey),
      },
      {
        title: 'サンプル4',
        subTitle: '映像・音声通話(ルーム)',
        to: RouteLocations.toSample4(props.apiKey),
      },
    ]
    return {
      ...toRefs(state),
      items,
    }
  },
})
</script>

<style lang="scss" scoped></style>
