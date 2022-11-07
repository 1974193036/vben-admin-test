<script lang="ts">
import { createBreakpointListen } from '@/hooks/event/useBreakpoint'
import { createAppProviderContext } from './useAppContext'

const prefixCls = 'vtsc'
const props = {
  /**
   * class style prefix
   */
  prefixCls: { type: String, default: prefixCls }
}
export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  props,
  setup(props, { slots }) {
    const isMobile = ref(false)
    // Monitor screen breakpoint information changes
    createBreakpointListen(({ screenMap, sizeEnum, width }) => {
      const typeWidth = screenMap.get(sizeEnum.MD) // 768
      if (typeWidth) {
        isMobile.value = width.value - 1 < typeWidth
      }
      handleRestoreState()
    })

    const { prefixCls } = toRefs(props)

    // Inject variables into the global
    createAppProviderContext({ prefixCls, isMobile })

    /**
     * Used to maintain the state before the window changes
     */
    function handleRestoreState() {
      console.log('isMobile', isMobile.value)
    }

    return () => slots.default?.()
  }
})
</script>
