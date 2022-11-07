<script setup lang="ts">
const a = '1'

type B = {
  name: string
}

const b: B = {
  name: 'zs'
}
console.log(a)
console.log(b)
console.log(import.meta.env)
</script>

<template>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped></style>
