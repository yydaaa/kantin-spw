<template>
  <div class="flex">
    <div>
      <UVerticalNavigation :links="links" />
      <UButton color="red" variant="outline" @click="logout" :disabled="status == 'pending'">Logout</UButton>
      <div v-if="status == 'error'" class="text-red-500">{{ error.message }}</div>
    </div>
    <div class="container mx-auto px-4 py-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { execute: logout, status, error } = useAsyncData('logout', async () => {
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) throw 'Logout gagal'
  else {
    navigateTo('/')
  }
}, {
  immediate: false
})

const links = [
  [
    {
      label: 'Dashboard',
      icon: 'i-heroicons-home',
      to: '/dashboard'
    }
  ]
]
</script>

<style scoped></style>