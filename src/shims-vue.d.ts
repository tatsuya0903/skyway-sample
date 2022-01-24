import Vue from 'vue'
import type { defineComponent } from '@vue/composition-api'

declare module '*.vue' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: defineComponent<{}, {}, unknown>
  export default component
}

declare global {
  interface Window {
    vmApp: Vue
  }
}
