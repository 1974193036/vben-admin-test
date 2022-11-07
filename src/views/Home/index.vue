<template>
  <div>
    <div ref="AA">views/Home/index</div>
    <h1>{{ x }} - {{ y }} - {{ isDark }} - {{ store }}</h1>
    <input />
  </div>
</template>

<script lang="ts">
import { useLocalStorage, useMouse, usePreferredDark } from '@vueuse/core'
import { useEventListener } from '@/hooks/event/useEventListener'

export default {
  setup() {
    // tracks mouse position
    const { x, y } = useMouse()

    // is user prefers dark theme
    const isDark = usePreferredDark()

    // persist state in localStorage
    const store = useLocalStorage('my-storage', {
      name: 'Apple',
      color: 'red'
    })

    const AA = ref(null)
    const { removeEvent } = useEventListener({
      el: AA,
      name: 'click',
      listener: (e) => {
        console.log('点击AA', e)
      }
    })

    setTimeout(() => {
      removeEvent()
    }, 1000)

    return { x, y, isDark, store, AA }
  }
}
</script>

<style scoped></style>
