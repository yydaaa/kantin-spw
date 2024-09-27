<template>
  <div class="flex flex-col w-auto min-h-screen justify-center items-center">
    <div class="w-fit relative border rounded-2xl">
      <NuxtLink class="absolute top-3 left-3" to="/dashboard/kelompok">⬅️</NuxtLink>
      <UForm class="p-10 space-y-4 flex flex-col" :validate="validate" :state="state" @submit="addKelompok">
        <UFormGroup label="Nama Kelompok" name="nama">
          <UInput v-model="state.nama" placeholder="contoh: Kelompok 1" />
        </UFormGroup>
        <UFormGroup label="Kelas" name="kelas">
          <USelect :loading="!kelas" :options="kelas" option-attribute="nama" value-attribute="id"
            v-model="state.kelas" />
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
  kelas: null
})

const validate = (state) => {
  const errors = []
  if (!state.nama) errors.push({ path: 'nama', message: 'Required' })
  if (!state.kelas) errors.push({ path: 'kelas', message: 'Required' })
  return errors
}

const { execute: addKelompok, status, error } = await useAsyncData('addKelompok', async () => {
  const { error } = await supabase.from('kelompok').insert([{
    nama: state.nama,
    kelas: Number(state.kelas)
  }])
  if (error) throw new Error('Gagal menambahkan data')
  navigateTo('/dashboard/kelompok')
}, {
  immediate: false
})

const { data: kelas } = useLazyAsyncData('kelas', async () => {
  const { data, error } = await supabase.from('kelas').select()
  if (error) throw error
  return data
})
</script>

<style scoped></style>