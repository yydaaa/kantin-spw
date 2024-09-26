<template>
  <div>
    <h1 class="text-red-500">{{ error?.statusCode }} {{ error?.message }}</h1>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<style scoped>

</style>