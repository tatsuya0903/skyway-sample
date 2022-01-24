<template>
  <div>
    <v-dialog v-model="displayDialog" width="100%" max-width="480px" persistent>
      <v-card outlined>
        <v-card-title>設定</v-card-title>
        <v-card-text>
          <CameraForm @click-done="clickCamera" />
          <PeerForm @click-done="clickPeer" />
          <RoomForm @click-join="clickJoin" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <div style="display: flex; flex-direction: row">
      <div style="display: flex; flex: 1">
        <RoomVideos :media-streams="mediaStreams" />
        <div
          style="
            position: absolute;
            right: 16px;
            bottom: 16px;
            max-width: 200px;
            width: 50vw;
            border: 1px solid white;
            border-radius: 16px;
            overflow: hidden;
          "
        >
          <RoomVideo :media-stream="mediaStream" />
        </div>
      </div>
      <div style="width: 300px">
        <RoomChat :messages="messages" @send="clickSend" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import Peer, { MeshRoom, PeerConstructorOption, PeerError } from 'skyway-js'
import { Snackbars } from '@/snackbars'
import { Message } from '@/models/message'
import InputText from '@/components/InputText.vue'
import RoomForm from '@/components/RoomForm.vue'
import RoomChat from '@/components/RoomChat.vue'
import PeerForm from '@/components/PeerForm.vue'
import RoomVideos from '@/components/RoomVideos.vue'
import RoomVideo from '@/components/RoomVideo.vue'
import CameraSelect from '@/components/CameraSelect.vue'
import CameraForm from '@/components/CameraForm.vue'

// eslint-disable-next-line @typescript-eslint/ban-types
type State = {
  displayDialog: boolean
  peerId: string | null
  roomName: string | null
  peer: Peer | null
  room: MeshRoom | null
  mediaStream: MediaStream | null
  mediaStreams: MediaStream[]
  messages: Message[]
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: {
    CameraForm,
    CameraSelect,
    RoomVideo,
    RoomVideos,
    PeerForm,
    RoomChat,
    RoomForm,
    InputText,
  },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      displayDialog: true,
      peerId: null,
      roomName: null,
      peer: null,
      room: null,
      mediaStream: null,
      mediaStreams: [],
      messages: [],
    })

    watch(
      () => state.room,
      (value: MeshRoom | null) => {
        if (value !== null) {
          state.displayDialog = false
        }
      },
    )

    const clickCamera = async (mediaStream: MediaStream) => {
      state.mediaStream = mediaStream
    }
    const clickPeer = async (peerId: string) => {
      await initPeer(peerId)
    }

    const clickJoin = async (roomName: string) => {
      const peer = state.peer
      const mediaStream = state.mediaStream
      if (peer === null) {
        alert('ERROR')
        return
      }

      await joinRoom(peer, roomName, mediaStream)
    }

    const clickSend = async (text: string) => {
      const peer = state.peer
      const room = state.room
      if (peer === null || room === null) {
        alert('ERROR')
        return
      }

      const message: Message = {
        peerId: peer.id,
        text: text,
      }
      room.send(message)
      state.messages.push(message)
    }

    /**
     * Peerオブジェクト生成する
     */
    const initPeer = async (peerId: string) => {
      const options: PeerConstructorOption = {
        key: props.apiKey,
        debug: 3,
      }
      const peer = new Peer(peerId, options)
      peer.on('open', () => {
        console.info(`peer: open`)

        state.peer = peer
      })
      peer.on('close', () => {
        console.info(`peer: close`)
      })
      peer.on('error', (err: PeerError) => {
        console.info(`peer: error > ${JSON.stringify(err)}`)
      })

      state.peer = peer
    }

    /**
     * ルームに参加する
     * @param peer
     * @param roomName
     * @param stream
     */
    const joinRoom = async (peer: Peer, roomName: string, stream: MediaStream | null) => {
      const room = peer.joinRoom(roomName, {
        mode: 'mesh',
        stream: stream ?? undefined,
      })
      room.on('open', () => {
        console.log('room > open')
      })
      room.on('peerJoin', (peerId: string) => {
        Snackbars.show(`'${peerId}'が参加しました`)
      })
      room.on('peerLeave', (peerId: string) => {
        // https://webrtc.ecl.ntt.com/api-reference/javascript.html#events-4
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const index = state.mediaStreams.findIndex((v) => v.peerId === peerId)
        if (index !== -1) {
          state.mediaStreams.splice(index, 1)
        }
        Snackbars.show(`'${peerId}'が退出しました`)
      })
      room.on('log', (logs: string[]) => {
        console.log(`room >> log`)
        console.log(`    logs ${JSON.stringify(logs, null, '')}`)
      })
      room.on('stream', (stream: MediaStream) => {
        // https://webrtc.ecl.ntt.com/api-reference/javascript.html#events-4
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.mediaStreams.push(stream)
      })
      room.on('data', ({ src, data }) => {
        console.log(`data > src: ${src}`)
        const message: Message = data
        state.messages.push(message)
      })
      room.on('close', () => {
        console.log('room > close')
      })

      state.room = room
    }

    return {
      ...toRefs(state),
      clickCamera,
      clickPeer,
      clickJoin,
      clickSend,
    }
  },
})
</script>

<style lang="scss" scoped></style>
