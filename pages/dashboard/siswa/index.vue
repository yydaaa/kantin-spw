<template>
  <div class="space-y-5">
    <div class="flex justify-center">
      <UButton @click="navigateTo('/dashboard/siswa/tambah')">Tambah Siswa</UButton>
    </div>
    <div v-if="status == 'error'" class="text-red-500">
      {{ error.message }}
    </div>
    <div class="flex justify-center" v-else>
      <UTable :rows="students" :columns="columns" :loading="status == 'pending'" class="w-fit border rounded-lg">
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const supabase = useSupabaseClient()

const { data: students, status, error } = await useAsyncData('students', async () => {
  const { data, error } = await supabase.from('siswa').select(`
    nama,
    kelas (
      nama
    )
  `)
  if (error) throw error
  return data
})
const columns = [
  {
    key: 'nama',
    label: 'Nama'
  }, {
    key: 'kelas.nama',
    label: 'Kelas'
  }, {
    key: 'actions'
  }
]
const items = (row) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid'
  }]
]
</script>

<style scoped></style>