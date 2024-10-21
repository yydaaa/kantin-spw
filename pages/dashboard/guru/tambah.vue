<template>
    <div class="flex flex-col w-auto min-h-screen justify-center items-center">
      <div class="w-fit relative border rounded-2xl">
        <NuxtLink class="absolute top-3 left-3" to="/dashboard/guru/">⬅️</NuxtLink>
        <UForm class="p-10 space-y-4 flex flex-col" :validate="validate" :state="state" @submit="addGuru">
          <UFormGroup label="Nama Guru" name="nama">
            <UInput v-model="state.nama" placeholder="Nama lengkap" />
          </UFormGroup>
          <UFormGroup label="Jadwal" name="jadwal">
            <USelect :options="schedules" option-attribute="hari" value-attribute="id" class="text-black"
              v-model="state.jadwal" placeholder="Hari"/>
          </UFormGroup>
          <UButton :loading="status == 'pending'" class="justify-center" type="submit">
            Tambah
          </UButton>
          <div class="text-red-500" v-if="status == 'error'">{{ error.message }}</div>
        </UForm>
      </div>
    </div>
  </template>
  
  <script setup>
  const supabase = useSupabaseClient()
  
  const state = reactive({
    nama: '',
    jadwal: null,
  })
  
  const validate = (state) => {
    const errors = []
    if (!state.nama) errors.push({ path: 'nama', message: 'Required' })
    if (!state.jadwal) errors.push({ path: 'jadwal', message: 'Required' })
    return errors
  }
  
  const { execute: addGuru, status, error } = await useAsyncData('addGuru', async () => {
    const { error } = await supabase.from('guru').insert([{
      nama: state.nama,
      jadwal: Number(state.jadwal),
      
     
    }])
    if (error) throw new Error('Gagal menambahkan data')
    navigateTo('/dashboard/guru')
  }, {
    immediate: false
  })
  
  const { data: schedules } = await useAsyncData('schedules', async () => {
    const { data, error } = await supabase.from('jadwal').select()
    if (error) throw error
    return data
  })
  </script>
  
  <style scoped></style>