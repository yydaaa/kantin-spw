<template>
    <div class="container mx-auto px-4 py-10 space-y-5">
      <div class="flex justify-center">
      <NuxtLink to="/dashboard/guru/tambah" class="bg-green-600 rounded-md p-2 text-white hover:bg-green-700">Tambah Guru</NuxtLink>
    </div>
      <div v-if="status == 'error'" class="text-red-500">
        {{ error.message }}
      </div>
      <div class="flex justify-center" v-else>
        <UTable :rows="students" :columns="columns" :loading="status == 'pending'" class="w-fit border rounded-lg">
          <template #actions-data="{ row }">
            
              <UButton color="gray" variant="ghost" icon="heroicons:pencil-square-20-solid" />
              <UButton color="red" variant="ghost" icon="heroicons:trash-20-solid" />
            
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
  
  const { data: students, status, error } = await useAsyncData('teachers', async () => {
    const { data, error } = await supabase.from('guru').select(`
      nama,
      jadwal (
        hari,
        minggu
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
      key: 'jadwal.hari',
      label: 'hari'
    },  {
      key: 'jadwal.minggu',
      label: 'Jadwal'
    }, {
      key: 'actions'
    },
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