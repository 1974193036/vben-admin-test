<script setup lang="ts">
defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <hr />

  <div
    class="border-b test-box capitalize bg-black w-auto text-base italic font-bold text-right w-100px h-100px relative z-10 scale-75 rotate-45"
  >
    <p class="ring-0 text-black p-10px mt-10px">abc</p>
    <!-- <svg class="fill-cyan-500 hover:fill-cyan-700">

    </svg> -->
    <p class="text-dark-400 hover:bg-light-50">123</p>
  </div>
  <!-- <div class="test-box" w:sm="bg-red-400 text-light-100 p-10" w:md="bg-blue-700 p-50" w:lg="p-100 bg-cyan-800 text-50px"> 响应式 </div> -->
  <div class="btn-blue btn">button</div>

  <div class="text-test bg-primary w-screen-md h-screen-xs -z-1">test</div>

  <div class="bbb">bbb</div>

  <!-- xs: '320px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1600px' -->
  <div
    w:sm="bg-red-400 text-primary"
    w:md="bg-blue-700 text-dark-900"
    w:lg="bg-cyan-800 text-red-700"
  >
    响应式
  </div>
  <div>
    <div class="enter-y bg-blue-300">1</div>
    <div class="enter-y bg-blue-300">2</div>
    <div class="enter-y bg-blue-300">3</div>
    <div class="enter-y bg-blue-300">4</div>
    <div class="enter-y bg-blue-300">5</div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
  display: flex;
}
</style>
