<template>
  <div class="container mx-auto px-4 py-10 space-y-5">
    <div class="flex justify-center">
      <UButton @click="navigateTo('/dashboard/siswa/tambah')">Tambah siswa</UButton>
    </div>

    <div v-if="status == 'pending' || status == 'error'">
      <div v-if="status == 'pending'">
        Loading...
      </div>

      <div v-if="status == 'error'">
        {{ error.message }}
      </div>
    </div>
    <div v-else class="flex flex-col items-center"> 
      <div class="w-1/2 py-3">
        <UInput v-model="searchQuery" placeholder="Cari Siswa..." icon="heroicons:magnifying-glass-20-solid" @input="() => page = 1" />
      </div>
      <UTable :rows="filteredRows"   :columns="columns" :loading="status == 'pending'" class="w-1/2 border rounded-lg ">
        <template #actions-data="{ row }">
          <UButton icon="heroicons:pencil-square-20-solid" color="gray" variant="ghost" @click="openEditModal(row.id)" />
          <UButton icon="heroicons:trash-20-solid" color="red" variant="ghost" @click="openDeleteModal(row.id)" />
        </template>
      </UTable>
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="page" :page-count="pageCount" :total="students.length" />
      </div>
    </div>

    <UModal v-model="editModal">
      <UCard>
        <template #header>
          <UButton icon="i-heroicons-x-mark" size="xl" :padded="false" color="black" square variant="ghost" class="float-end" @click="editModal = false" />
          <h3 class="text-center font-bold">Edit Siswa</h3>
        </template>
        <UForm class="px-10 space-y-4 flex flex-col" :validate="validate" :state="state"
          @submit="editSiswa(selectedItem.id)">
          <UFormGroup label="Nama Siswa" name="nama">
            <UInput v-model="state.nama" placeholder="Nama Lengkap" />
          </UFormGroup>
          <UFormGroup label="Kelas" name="kelas">
            <USelect :loading="!classes" :options="classes" option-attribute="nama" value-attribute="id"
              v-model="state.kelas" />
          </UFormGroup>
          <UButton :loading="editLoading" color="yellow" class="justify-center" type="submit">
            Edit
          </UButton>
        </UForm>
      </UCard>
    </UModal>

    <UModal v-model="deleteModal">
      <UCard>
        <template #header>
          <div class="font-semibold">Apakah Anda Yakin Ingin Menghapus Ini?</div>
        </template>
        <div v-if="selectedItem">
          <p>Nama Siswa: {{ selectedItem.nama }}</p>
          <p v-if="selectedItem.kelas">Kelas: {{ selectedItem.kelas.nama }}</p>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <UButton color="gray" class="flex flex-grow items-center justify-center h-[38px]"
              @click="deleteModal = false">Cancel</UButton>
            <UButton :loading="deleteLoading" color="red" class="flex flex-grow items-center justify-center h-[38px]"
              @click="deleteSiswa(selectedItem.id)">Delete</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const searchQuery = ref('')

const { data: userData } = await useAsyncData('userData', async () => {
  const { data, error } = await supabase.from('users').select('nama, role').eq('id', user.value.id).maybeSingle()
  if (error) throw error
  return data
})

const { data: classes } = useAsyncData('classes', async () => {
  try {
    let query = supabase.from('kelas').select()
    if (userData.value.role === 'kelas') query = query.eq('nama', userData.value.nama)
    const { data, error } = await query
    if (error) throw error
    if (userData.value.role === 'kelas') state.kelas = data[0].id
    return data
  } catch (error) {
    console.error(error)
  }
})

const { data: students, status, error, refresh } = await useAsyncData('students', async () => {
  try {
    let query = supabase.from('siswa').select(`
      id, nama,
      kelas (
        id, nama
      ),
      token_siswa (
        token
      )
    `)
    if (userData.value?.role === 'kelas') query = query.eq('kelas.nama', userData.value?.nama)
    else query = query.order('kelas')
    query = query.order('id')
    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error(error)
    return
  }
})

const editModal = ref(false)
const selectedId = ref(null)

const state = reactive({
  nama: '',
  kelas: null
})

const selectedItem = computed(() => {
  return students.value.find(student => student.id === selectedId.value)
})

const openEditModal = (studentId) => {
  selectedId.value = studentId
  if (selectedItem.value) {
    state.nama = selectedItem.value.nama
    state.kelas = selectedItem.value.kelas?.id
  }
  editModal.value = true
}

const validate = (state) => {
  const errors = []
  if (!state.nama) errors.push({ path: 'nama', message: 'Required' })
  if (!state.kelas) errors.push({ path: 'kelas', message: 'Required' })
  return errors
}

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

const deleteModal = ref(false)

const openDeleteModal = (groupId) => {
  selectedId.value = groupId
  deleteModal.value = true
}

const deleteLoading = ref(false)
const deleteSiswa = async (groupId) => {
  try {
    deleteLoading.value = true
    const { error } = await supabase.from('siswa').delete().eq('id', groupId)
    if (error) throw error
    refresh()
  } catch (error) {
    console.error(error)
  } finally {
    deleteLoading.value = true
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
    key: 'token_siswa.token',
    label: 'Token'
  }, {
    key: 'actions',
    class: 'w-20'
  }
]

const page = ref(1)
const pageCount = 10

const filteredRows = computed(() => {
  if (!searchQuery.value) {
    return students.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
  }
  
  const filtered = students.value.filter((student) => {
    const filternama = student.nama.toLowerCase().includes(searchQuery.value.toLowerCase());
    // const filterkelas = student.kelas.nama.toLowerCase().includes(searchQuery.value.toLowerCase());

    return filternama //|| filterkelas;
  })
  
  return filtered.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})


</script>


<style scoped></style>