<template>
  <div class="container mx-auto px-4 py-10 space-y-5">
    <div class="flex justify-center">
      <UButton @click="navigateTo('/dashboard/kelompok/tambah')">Tambah Kelompok</UButton>
    </div>
    <div v-if="status == 'success'" class="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-5">
      <div v-for="group in groups">
        <NuxtLink :to="`/dashboard/kelompok/${group.id}`">
          <UCard>
            <template #header>
              <div class="">{{ group.nama }}</div>
              <div>{{ group.kelas?.nama }}</div>
            </template>
            <ul class="list-disc ms-4">
              <li v-for="student in group.siswa">{{ student?.nama }}</li>
            </ul>
          </UCard>
        </NuxtLink>
      </div>
    </div>
    <div v-else>
      <div v-if="status == 'pending'">
        Loading...
      </div>
      <div v-if="status == 'error'" class="text-red-500">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { data: groups, status, error } = useLazyAsyncData('groups', async () => {
  const { data, error } = await supabase.from('kelompok').select(`
    *,
    kelas (
      nama
    ),
    siswa (
      *
    )
  `)
  if (error) throw error
  return data
})
</script>

<style scoped></style>