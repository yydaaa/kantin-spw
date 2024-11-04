<template>
  <div class="space-y-5">
    <div v-if="status == 'error'">
      {{ error.message }}
    </div>
    <div v-else class="flex flex-col items-center">
      <h2 class="font-semibold text-xl mb-3">{{ group?.nama }} - {{ group?.kelas?.nama }}</h2>
      <UTable :rows="studentsInGroup" :columns="columns" class="w-1/2 border rounded-lg">
        <template #actions-data="{ row }">
          <UButton color="red" variant="ghost" icon="i-heroicons-trash-20-solid" @click="openDeleteModal(row.id)" />
        </template>
      </UTable>
    </div>

    <div class="flex justify-center">
      <UButton @click="openAddModal">Tambah Siswa Dalam Kelompok</UButton>
    </div>

    <UModal v-model="deleteModal">
      <UCard>
        <template #header>
          <div v-if="selectedItem" class="font-semibold text-center">Apakah Anda Yakin Ingin Menghapus Siswa Ini Dari {{
            selectedItem.kelompok.nama }}?</div>
        </template>
        <div v-if="selectedItem">
          <p>Nama: {{ selectedItem.nama }}</p>
          <p>Kelompok: {{ selectedItem.kelompok.nama }}</p>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <UButton color="gray" class="flex flex-grow items-center justify-center h-[38px]"
              @click="deleteModal = false">Cancel</UButton>
            <UButton :loading="deleteLoading" color="red" class="flex flex-grow items-center justify-center h-[38px]"
              @click="deleteStudentInGroup(selectedItem.id)">Delete</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="addModal">
      <UCard>
        <template #header>
          <UButton icon="i-heroicons-x-mark" size="xl" :padded="false" color="black" square variant="ghost"
            class="float-end" @click="addModal = false" />
          <h3 class="text-center font-bold">Tambah Siswa Dalam Kelompok</h3>
        </template>
        <UForm class="px-10 space-y-4 flex flex-col" :validate="validate" :state="state" @submit="addStudentInGroup">
          <UFormGroup label="Siswa" name="siswa">
            <USelect :loading="!studentsInClass" :options="studentsInClass" option-attribute="nama" value-attribute="id"
              v-model="state.siswa" />
          </UFormGroup>
          <UButton :loading="addLoading" class="justify-center" type="submit">
            Tambah
          </UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const route = useRoute()

const supabase = useSupabaseClient()

const { data: group } = await useAsyncData('group', async () => {
  const { data, error } = await supabase.from('kelompok').select(`
    id, nama,
    kelas (
      id, nama
    )
  `).eq('id', route.params.id).single()
  if (error) throw error
  return data
})

const { data: studentsInGroup, status, error, refresh } = await useAsyncData('studentsInGroup', async () => {
  const { data, error } = await supabase.from('siswa').select(`
    id, nama,
    kelompok!inner (
      id, nama
    )
  `).eq('kelompok.id', route.params.id)
  if (error) throw error
  return data
})

const columns = [
  {
    key: 'nama',
    label: 'Nama'
  }, {
    key: 'actions',
    class: 'w-20'
  }
]

const { data: studentsInClass } = await useAsyncData('studentsInClass', async () => {
  const { data, error } = await supabase.from('siswa').select('id, nama').eq('kelas', group.value.kelas.id).or(`kelompok.is.null, kelompok.neq.${route.params.id}`)
  if (error) throw error
  return data
})

const addModal = ref(false)

const openAddModal = () => addModal.value = true

const state = reactive({
  siswa: null
})

const validate = (state) => {
  const errors = []
  if (!state.siswa) errors.push({ path: 'siswa', message: 'Required' })
  return errors
}

const addLoading = ref(false)
const addStudentInGroup = async () => {
  try {
    addLoading.value = true
    const { error } = await supabase.from('siswa').update({
      kelompok: group.value.id
    }).eq('id', state.siswa)
    if (error) throw error
    addModal.value = false
    state.siswa = null
    refresh()
  } catch (error) {
    console.error(error)
  } finally {
    addLoading.value = false
  }
}

const selectedId = ref(null)

const selectedItem = computed(() => {
  return studentsInGroup.value.find(student => student.id === selectedId.value)
})

const deleteModal = ref(false)

const openDeleteModal = (studentId) => {
  selectedId.value = studentId
  deleteModal.value = true
}

const deleteLoading = ref(false)
const deleteStudentInGroup = async (studentId) => {
  try {
    deleteLoading.value = true
    const { error } = await supabase.from('siswa').update({
      kelompok: null
    }).eq('id', studentId)
    if (error) throw error
    deleteModal.value = false
    refresh()
  } catch (error) {
    console.error(error)
  } finally {
    deleteLoading.value = false
  }
}
</script>

<style scoped></style>