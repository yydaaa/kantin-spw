<template>
  <div class="container mx-auto px-4 py-10 space-y-5">
    <div class="flex justify-center">
      <UButton @click="navigateTo('/dashboard/kelompok/tambah')">Tambah Kelompok</UButton>
    </div>

    <div v-if="status == 'pending' || status == 'error'">
      <div v-if="status == 'pending'">
        Loading...
      </div>

      <div v-if="status == 'error'">
        {{ error.message }}
      </div>
    </div>
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-5">
      <div v-for="group in groups" :key="group.id">
        <UCard>
          <template #header>
            <div class="">{{ group.nama }}</div>
            <div>{{ group.kelas?.nama }}</div>
          </template>
          <ul v-if="group.siswa?.length" class="list-disc ms-4">
            <li v-for="student in group?.siswa">{{ student?.nama }}</li>
          </ul>
          <div v-else class="opacity-50">Kelompok ini belum ada siswa</div>
          <template #footer>
            <UButton icon="i-heroicons-pencil-square-20-solid" size="sm" color="yellow" square variant="ghost"
              @click="openEditModal(group.id)" />
            <UButton icon="i-heroicons-trash-20-solid" size="sm" color="red" square variant="ghost" />
            <UButton icon="i-heroicons-eye-20-solid" size="sm" color="blue" square variant="ghost" />
          </template>
        </UCard>

        <UModal v-model="editModal">
          <UCard>
            <UForm class="p-10 space-y-4 flex flex-col" :validate="validate" :state="state"
              @submit="editKelompok(group.id)">
              <UFormGroup label="Nama Kelompok" name="nama">
                <UInput v-model="state.nama" placeholder="contoh: Kelompok 1" />
              </UFormGroup>
              <UFormGroup label="Kelas" name="kelas">
                <USelect :loading="!kelas" :options="kelas" option-attribute="nama" value-attribute="id"
                  v-model="state.kelas" />
              </UFormGroup>
              <UButton :loading="editLoading" color="yellow" class="justify-center" type="submit">
                Edit
              </UButton>
            </UForm>
          </UCard>
        </UModal>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const editModal = ref(false)
const deleteModal = ref(false)

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

const openEditModal = async (groupId) => {
  try {
    editModal.value = true
    const { data, error } = await supabase.from('kelompok').select('nama, kelas').eq('id', groupId).maybeSingle()
    if (error) throw error
    state.nama = data.nama
    state.kelas = data.kelas
  } catch (error) {
    console.error('Unable to fetch groups:', error)
  }
}

const { data: userData } = await useAsyncData('userData', async () => {
  const { data, error } = await supabase.from('users').select('nama, role').eq('id', user.value.id).maybeSingle()
  if (error) throw error
  return data
})

const { data: kelas } = await useAsyncData('kelas', async () => {
  const { data, error } = await supabase.from('kelas').select()
  if (error) throw error
  return data
})

const { data: groups, status, error, refresh } = useLazyAsyncData('groups', async () => {
  const { data, error } = await supabase.from('kelompok').select(`
    *,
    kelas!inner (
      nama
    ),
    siswa (
      *
    )
  `).eq('kelas.nama', userData.value.nama)
  if (error) throw error
  return data
})

const editLoading = ref(false)
const editKelompok = async (groupId) => {
  try {
    editLoading.value = true
    const { error } = await supabase.from('kelompok').update({
      nama: state.nama,
      kelas: Number(state.kelas)
    }).eq('id', groupId)
    if (error) throw error
    refresh()
  } catch (error) {
    console.error(error)
  } finally {
    editLoading.value = false
    editModal.value = false
  }
}
</script>

<style scoped></style>