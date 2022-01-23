<template>
  <div>
    <div>
      <InputText v-model="peerId" label="自分のPeerId" :disabled="peer !== null" />
      <v-btn color="primary" text :disabled="peer !== null" @click="clickDone1">
        <v-icon left>mdi-check</v-icon>
        決定
      </v-btn>
    </div>
    <div>
      <InputText v-model="toPeerId" label="相手のPeerId" :disabled="dataConnection !== null" />
      <v-btn color="primary" text :disabled="dataConnection !== null" @click="clickConnect">
        <v-icon left>mdi-check</v-icon>
        決定
      </v-btn>
    </div>
    <div>
      <InputText v-model="text" />
      <v-btn color="primary" text :disabled="text.length === 0" @click="clickSend">
        <v-icon left>mdi-send</v-icon>
        送信
      </v-btn>
    </div>
    <v-divider />
    <v-list two-line>
      <template v-for="(message, index) in messages">
        <v-list-item :key="index">
          <v-list-item-content>
            <v-list-item-subtitle>{{ message.peerId }}</v-list-item-subtitle>
            <v-list-item-title>{{ message.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import Peer, { DataConnection, PeerConstructorOption, PeerError } from 'skyway-js'
import InputText from '@/components/InputText.vue'

type Message = {
  peerId: string
  text: string
}
// eslint-disable-next-line @typescript-eslint/ban-types
type State = {
  peerId: string
  peer: Peer | null
  toPeerId: string
  dataConnection: DataConnection | null
  text: string
  messages: Message[]
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { InputText },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      peerId: '',
      peer: null,
      toPeerId: '',
      dataConnection: null,
      text: '',
      messages: [],
    })

    const clickDone1 = async () => {
      const peerId = state.peerId

      const options: PeerConstructorOption = {
        key: props.apiKey,
        debug: 3,
      }
      const peer = peerId.length >= 1 ? new Peer(peerId, options) : new Peer(options)
      peer.on('open', () => {
        console.info(`peer: open`)
      })
      peer.on('close', () => {
        console.info(`peer: close`)
      })
      peer.on('error', (err: PeerError) => {
        console.info(`peer: error > ${JSON.stringify(err)}`)
      })
      peer.on('connection', (conn: DataConnection) => {
        console.info(`peer: connection`)
        setDataConnection(conn)
      })

      state.peer = peer
    }

    const clickConnect = async () => {
      const peer = state.peer
      const toPeerId = state.toPeerId
      if (peer === null || toPeerId.length === 0) {
        alert('ERROR')
        return
      }
      const dataConnection = peer.connect(toPeerId)
      setDataConnection(dataConnection)
    }

    const clickSend = async () => {
      const peerId = state.peerId
      const text = state.text
      const dataConnection = state.dataConnection
      if (peerId.length === 0 || text.length === 0 || dataConnection === null) {
        alert('ERROR')
        return
      }

      const message: Message = { peerId, text }
      dataConnection.send(message)
      state.messages.push(message)
      state.text = ''
    }

    const setDataConnection = (dataConnection: DataConnection) => {
      dataConnection.on('open', () => {
        console.info(`dataConnection: open`)
      })
      dataConnection.on('data', (data: Message) => {
        console.info(`dataConnection: data > ${JSON.stringify(data)}`)
        state.messages.push(data)
      })
      dataConnection.on('close', () => {
        console.info(`dataConnection: close`)
      })
      dataConnection.on('error', (err: PeerError) => {
        console.info(`dataConnection: error > ${JSON.stringify(err)}`)
      })
      state.dataConnection = dataConnection
    }

    return {
      ...toRefs(state),
      clickDone1,
      clickConnect,
      clickSend,
    }
  },
})
</script>

<style lang="scss" scoped></style>
