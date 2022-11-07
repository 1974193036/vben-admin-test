<template>
  <div class="head-top" w:xs="bg-red-400" w:sm="bg-blue-700">
    头部 -- {{ injectContext.prefixCls }} -- {{ injectContext.isMobile }}
  </div>
</template>

<script setup lang="ts" name="HeaderTop">
// test 空着的话 setup name 就无效了
import { useAppProviderContext } from './useAppContext'

const injectContext = useAppProviderContext()
</script>
