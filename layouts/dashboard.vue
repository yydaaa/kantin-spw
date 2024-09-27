<template>
  <div>
    <slot />
    <UButton color="red" variant="outline" @click="logout" :disabled="status == 'pending'">Logout</UButton>
    <div v-if="status == 'error'" class="text-red-500">{{ error.message }}</div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { execute: logout, status, error } = useAsyncData('logout', async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw 'Logout gagal'
  else {
    navigateTo('/')
  }
}, {
  immediate: false
})
</script>

<style scoped>

</style>