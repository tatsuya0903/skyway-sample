<template>
  <v-row>
    <v-col cols="12">
      <input ref="input" type="file" @change="changeFile" />
    </v-col>
    <v-col cols="12">
      <v-btn color="primary" @click="clickShare">
        <v-icon left>mdi-share</v-icon>
        共有開始
      </v-btn>
    </v-col>
    <template v-if="shareUrl">
      <v-col cols="12">
        ダウンロードURL：
        <a :href="shareUrl" target="_blank">{{ shareUrl }}</a>
      </v-col>
      <v-col cols="12">
        <QrCode :data="shareUrl" size="400" />
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from '@vue/composition-api'
import Peer, { DataConnection, PeerConstructorOption, PeerError } from 'skyway-js'
import { Env } from '@/env'
import QrCode from '@/components/QrCode.vue'

// eslint-disable-next-line @typescript-eslint/ban-types
type State = {
  peer: Peer | null
  file: File | null
  shareUrl: string | null
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { QrCode },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      peer: null,
      file: null,
      shareUrl: null,
    })

    const peerId = computed(() => state.peer?.id ?? null)

    const clickShare = async () => {
      const options: PeerConstructorOption = {
        key: props.apiKey,
        debug: 3,
      }
      const peer = new Peer(options)
      peer.on('open', () => {
        console.info(`peer: open`)

        state.peer = peer
        state.shareUrl = Env.calcSample3ShareUrl(props.apiKey, peerId.value ?? '')
      })
      peer.on('close', () => {
        console.info(`peer: close`)
      })
      peer.on('error', (err: PeerError) => {
        console.info(`peer: error > ${JSON.stringify(err)}`)
      })
      peer.on('connection', (conn: DataConnection) => {
        console.info(`peer: connection`)
        sendFile(conn)
      })
    }

    const sendFile = async (dataConnection: DataConnection) => {
      dataConnection.on('open', () => {
        console.info(`dataConnection: open`)

        const file = state.file
        if (file) {
          dataConnection.send(file)
        }
      })
      dataConnection.on('close', () => {
        console.info(`dataConnection: close`)
      })
      dataConnection.on('error', (err: PeerError) => {
        console.info(`dataConnection: error > ${JSON.stringify(err)}`)
      })
    }

    const input = ref<HTMLInputElement>()
    const changeFile = async () => {
      const element = input.value
      if (element) {
        state.file = element.files === null ? null : element.files[0]
      }
    }

    return {
      ...toRefs(state),
      clickShare,
      peerId,
      input,
      changeFile,
    }
  },
})
</script>

<style lang="scss" scoped></style>
