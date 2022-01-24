<template>
  <div class="room-form">
    <div class="room-form__row">
      <v-btn color="primary" @click="clickStart">
        <v-icon left>mdi-video-outline</v-icon>
        会議を開始
      </v-btn>
    </div>
    <div class="room-form__row">
      <InputText
        v-model="roomName"
        label="会議コード"
        icon="mdi-keyboard-outline"
        placeholder="会議コードを入力"
      />
      <v-btn text color="primary" :disabled="roomName === null" @click="clickJoin">参加</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'

type State = {
  roomName: string | null
}
export default defineComponent({
  components: { InputText },
  emits: ['click-join'],
  setup(_: unknown, context: SetupContext) {
    const state = reactive<State>({
      roomName: null,
    })

    const emitJoin = (roomName: string) => {
      context.emit('click-join', roomName)
    }
    const clickStart = async () => {
      const roomName = createRoomName()
      emitJoin(roomName)
    }
    const clickJoin = async () => {
      const roomName = state.roomName ?? createRoomName()
      emitJoin(roomName)
    }
    const createRoomName = (): string => {
      const createCode = (len: number): string => {
        const c = 'abcdefghijklmnopqrstuvwxyz0123456789'
        let r = ''
        for (let num = 1; num <= len; num++) {
          r += c[Math.floor(Math.random() * c.length)]
        }
        return r
      }
      return `${createCode(3)}-${createCode(4)}-${createCode(3)}`
    }

    return {
      ...toRefs(state),
      clickStart,
      clickJoin,
    }
  },
})
</script>

<style lang="scss" scoped>
.room-form {
  display: flex;
  flex-direction: column;
  .room-form__row {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 0px;
  }
}
</style>
