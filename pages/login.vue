<template>
  <UContainer>
    <form @submit.prevent="login">
      <div class="text-3xl text-center mb-4">Welcome to SPW</div>
      <div class="mb-4">
        <UInput type="email" v-model="email" placeholder="Email" />
      </div>
      <div class="mb-4">
        <UInput type="password" v-model="password" placeholder="Password" />
      </div>
      <div v-if="status == 'error'" class="mb-4">
        <p class="text-red-500 text-center">{{ error.message }}</p>
      </div>
      <div class="mb-4">
        <UButton type="submit" color="black" class="w-full justify-center rounded"
          :disabled="status == 'pending' || !password">Log In</UButton>
      </div>
    </form>
    <NuxtLink to="/">Back</NuxtLink>
  </UContainer>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')

const { execute: login, status, error } = useAsyncData('login', async () => {
  const { data: user, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (error) throw "Username atau password salah"
  if (user) {
    const { data: userRole, error } = await supabase.from('users').select('role').eq('id', user.user.id).maybeSingle()
    if (error) throw 'Role user tidak ditemukan'
    if (userRole) navigateTo(`/dashboard/${userRole.role}`)
  }
}, {
  immediate: false
})
</script>

<style scoped></style>