declare module '*.vue' {
  import type { defineComponent } from '@vue/composition-api'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: defineComponent<{}, {}, unknown>
  export default component
}
