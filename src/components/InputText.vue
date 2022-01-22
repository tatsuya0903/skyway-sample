<template>
  <div class="input-text">
    <v-text-field
      v-model="localValue"
      :readonly="readonly"
      outlined
      dense
      :label="label"
      hide-details
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed } from '@vue/composition-api'

type Value = string | null
type Props = {
  value: string
  label: string | null
  readonly: boolean
}
export default defineComponent({
  components: {},
  props: {
    value: { type: String, default: null },
    label: { type: String, default: null },
    readonly: { type: Boolean, default: false },
  },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const emitInput = (value: Value) => {
      context.emit('input', value)
    }
    const localValue = computed<Value>({
      get: () => props.value,
      set: (value: Value) => {
        emitInput(value)
      },
    })
    return {
      localValue,
    }
  },
})
</script>

<style lang="scss" scoped>
.input-text {
  padding-top: 8px;
  padding-bottom: 8px;
  width: 100%;
}
</style>
