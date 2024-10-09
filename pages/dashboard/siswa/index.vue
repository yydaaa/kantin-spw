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
        <template #actions-data>
            <UButton icon="heroicons:pencil-square-20-solid" color="gray" variant="ghost" @click="openEditModal"/>
            <UButton icon="heroicons:trash-20-solid" color="red" variant="ghost" @click="openDeleteModal"/>
        </template>
        </UTable>
        <UModal v-model="editModal">
          <UCard>
            <UForm class="p-10 space-y-4 flex flex-col" :validate="validate" :state="state"
              @submit="editSiswa(group.id)">
              <UFormGroup label="Nama Siswa" name="nama">
                <UInput v-model="state.nama" placeholder="Nama lengkap" />
              </UFormGroup>
              <UFormGroup label="Kelas" name="kelas">
                <USelect :loading="!kelas" :options="kelas" option-attribute="nama" value-attribute="id"
                  v-model="state.kelas" placeholder="kelas" />
              </UFormGroup>
              <UButton :loading="editLoading" color="green" class="justify-center" type="submit">
                Edit
              </UButton>
            </UForm>
          </UCard>
        </UModal>
        <UModal v-model="deleteModal">
          <UCard>
            <UForm class="p-10 space-y-4 flex flex-col" :validate="validate" :state="state"
              @submit="deleteSiswa(group.id)">
                <UButton :loading="deleteLoading" color="red" variant="solid" class="justify-center" type="submit" size="lg">
                  Yes
                </UButton>
                <UButton v-model="isOpen" color="gray" class="justify-center" type="submit" size="lg">
                  No
                </UButton>
            </UForm>
          </UCard>
        </UModal>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})


const supabase = useSupabaseClient()
const user = useSupabaseUser()

const editModal = ref(false)
const deleteModal = ref(false)
const isOpen = ref(false)



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
    const { data, error } = await supabase.from('siswa').delete('nama, kelas').eq('id', groupId).maybeSingle()
    if (error) throw error
    state.nama = data.nama
    state.kelas = data.kelas
  } catch (error) {
    console.error('Unable to fetch students:', error)
  }
}

const openDeleteModal = async (groupId) => {
  try {
    deleteModal.value = true
    const { data, error } = await supabase.from('siswa').delete().eq('id', groupId).maybeSingle()
    if (error) throw error
    state.nama = data.nama
    state.kelas = data.kelas
  } catch (error) {
    console.error('Unable to fetch students:', error)
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

const { data: students, status, error, refresh } = await useAsyncData('students', async () => {
  const { data, error } = await supabase.from('siswa').select(`
    nama,
    kelas (
      nama
    )
  `).eq('kelas.nama', userData.value.nama)
  if (error) throw error
  return data
})

const editLoading = ref(false)
const editSiswa = async (groupId) => {
  try {
    editLoading.value = true
    const { error } = await supabase.from('siswa').update({
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

const deleteLoading = ref(false)
const hapusSiswa = async (groupId) => {
  try {
    deleteLoading.value = true
    const { error } = await supabase.from('siswa').delete({
      nama: state.nama,
      kelas: Number(state.kelas)
    }).eq('id', groupId)
    if (error) throw error
    refresh()
  } catch (error) {
    console.error(error)
  } finally {
    deleteLoadingLoading.value = false
    deleteModal.value = false
  }
}
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
</script>

<style scoped></style>