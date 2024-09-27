<template>
  <div>
    <div>{{ userData?.nama }}</div>
    <ul>
      <li><NuxtLink to="../dashboard/kelompok">Kelola Kelompok</NuxtLink></li>
      <li v-if="userData?.role"><NuxtLink to="../dashboard/siswa">Kelola Siswa</NuxtLink></li>
    </ul>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { data: userData } = useAsyncData('userData', async () => {
  const { data, error } = await supabase.from('users').select('nama, role').eq('id', user.value.id).maybeSingle()
  if (error) throw error
  console.log(data)
  return data
})
</script>

<style scoped>

</style>