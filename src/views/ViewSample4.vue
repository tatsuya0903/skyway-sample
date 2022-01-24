<template>
  <LayoutView :scroll="false">
    <template v-slot:header></template>
    <template v-slot:main>
      <div class="room">
        <div class="room__item room__item--video">
          <RoomVideos :media-streams="mediaStreams" :media-stream="mediaStream" />
        </div>
        <div v-show="displayDrawer" class="room__item room__item--chat">
          <RoomChat :messages="messages" @send="clickSend" />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <v-toolbar dark>
        <v-spacer />
        <v-btn icon @click="clickQr">
          <v-icon>mdi-qrcode</v-icon>
        </v-btn>
        <v-btn icon :color="displayDrawer ? 'primary' : null" @click="clickChat">
          <v-icon>{{ displayDrawer ? 'mdi-message' : 'mdi-message-text' }}</v-icon>
        </v-btn>
        <v-spacer />
      </v-toolbar>
    </template>
    <v-dialog v-model="displayDialog" width="100%" max-width="480px" persistent>
      <v-card outlined>
        <v-card-title>設定</v-card-title>
        <v-card-text>
          <CameraForm @click-done="clickCamera" />
          <PeerForm @click-done="clickPeer" />
          <RoomForm :room-name="roomName" @click-join="clickJoin" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </LayoutView>
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
import LayoutView from '@/components/LayoutView.vue'
import { Dialogs } from '@/dialogs'
import { Env } from '@/env'

// eslint-disable-next-line @typescript-eslint/ban-types
type State = {
  displayDrawer: boolean
  displayDialog: boolean
  peerId: string | null
  localRoomName: string | null
  peer: Peer | null
  room: MeshRoom | null
  mediaStream: MediaStream | null
  mediaStreams: MediaStream[]
  messages: Message[]
}
type Props = {
  apiKey: string
  roomName: string | null
}
export default defineComponent({
  components: {
    LayoutView,
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
    roomName: { type: String, default: null },
  },
  setup(props: Props) {
    const state = reactive<State>({
      displayDrawer: true,
      displayDialog: true,
      peerId: null,
      localRoomName: props.roomName,
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
      state.localRoomName = roomName
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

    const clickChat = async () => {
      state.displayDrawer = !state.displayDrawer
    }
    const clickQr = async () => {
      const roomName = state.localRoomName
      if (roomName === null) {
        await Dialogs.showError('')
        return
      }
      const shareUrl = Env.calcSample4ShareUrl(props.apiKey, roomName)
      await Dialogs.showShareUrl(shareUrl)
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
     * @param localRoomName
     * @param stream
     */
    const joinRoom = async (peer: Peer, localRoomName: string, stream: MediaStream | null) => {
      const room = peer.joinRoom(localRoomName, {
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
      clickChat,
      clickQr,
    }
  },
})
</script>

<style lang="scss" scoped>
.room {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .room__item {
    position: relative;
    display: flex;
    &.room__item--video {
      background: orange;
      flex: 1;
    }
    &.room__item--chat {
      background: black;
      width: 380px;
      padding: 8px;
    }
    &.room__item--actions {
      position: absolute;
      right: 8px;
      top: 8px;
    }
  }
}
</style>
