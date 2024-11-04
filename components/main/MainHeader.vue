<template>
  <div class="flex px-6 py-3">
    <header class="bg-[#1E1E1E] text-white flex justify-between items-center flex-1 px-3 py-1 rounded-full">
      <div class="flex items-center gap-3">
        <UButton icon="i-tabler-menu-2" color="black" variant="ghost" @click="$emit('openNavbar')" />
        <NuxtLink to="/">
          <div class="font-bold text-lg">Kantin SPW</div>
        </NuxtLink>
      </div>
      <UButton v-if="user" to="/dashboard" icon="i-heroicons-user-circle" variant="ghost" color="black" size="xl" :padded="false" />
      <UButton v-else to="/login" color="white" :ui="{ rounded: 'rounded-full' }" class="px-10 py-2 font-bold">Login</UButton>
    </header>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>

<style scoped>

</style>