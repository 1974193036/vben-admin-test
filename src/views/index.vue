<template>
  <div>
    <div>views/index</div>
    <AppProvider>
      <HeaderTop />
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </AppProvider>
  </div>
</template>

<script lang="ts" setup>
// import { HeaderTop, AppProvider } from '@/components/Application'
</script>

<style scoped></style>
