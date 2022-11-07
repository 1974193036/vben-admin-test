import type { ComputedRef } from 'vue'
import { sizeEnum, screenEnum, screenMap } from '@/enums/breakpointEnum'
import { useEventListener } from './useEventListener'

interface CreateCallbackParams {
  width: ComputedRef<number>
  realWidth: ComputedRef<number>
  sizeEnum: typeof sizeEnum
  screenEnum: typeof screenEnum
  screenMap: Map<sizeEnum, number>
  screen: ComputedRef<sizeEnum | undefined>
}

let globalScreenRef: ComputedRef<sizeEnum | undefined>
let globalWidthRef: ComputedRef<number>
let globalRealWidthRef: ComputedRef<number>

export function createBreakpointListen(fn?: (opt: CreateCallbackParams) => void) {
  const screenRef = ref<sizeEnum>(sizeEnum.XL)
  const realWidthRef = ref(window.innerWidth)

  function getWindowWidth() {
    const width = document.body.clientWidth
    const xs = screenMap.get(sizeEnum.XS)!
    const sm = screenMap.get(sizeEnum.SM)!
    const md = screenMap.get(sizeEnum.MD)!
    const lg = screenMap.get(sizeEnum.LG)!
    const xl = screenMap.get(sizeEnum.XL)!
    if (width < xs) {
      screenRef.value = sizeEnum.XS
    } else if (width < sm) {
      screenRef.value = sizeEnum.SM
    } else if (width < md) {
      screenRef.value = sizeEnum.MD
    } else if (width < lg) {
      screenRef.value = sizeEnum.LG
    } else if (width < xl) {
      screenRef.value = sizeEnum.XL
    } else {
      screenRef.value = sizeEnum.XXL
    }
    realWidthRef.value = width
  }

  useEventListener({
    el: window,
    name: 'resize',
    listener: () => {
      getWindowWidth()
      resizeFn()
    }
  })

  getWindowWidth()

  globalScreenRef = computed(() => screenRef.value) // XS
  globalWidthRef = computed((): number => screenMap.get(screenRef.value!)!) // 320
  globalRealWidthRef = computed((): number => realWidthRef.value) // 100

  function resizeFn() {
    fn?.({
      width: globalWidthRef, // 320
      realWidth: globalRealWidthRef, // 100
      sizeEnum,
      screenEnum,
      screenMap,
      screen: globalScreenRef // XS
    })
  }
  resizeFn()

  return {
    screenRef: globalScreenRef,
    screenEnum,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef
  }
}
