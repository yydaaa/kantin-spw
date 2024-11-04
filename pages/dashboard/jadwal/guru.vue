<template>
   
  </template>
  
  <script setup>
  definePageMeta({
    layout: 'dashboard',
    middleware: 'auth'
  })
  
  const supabase = useSupabaseClient()
  
  const searchQuery = ref('')
  
  const { data: teachers, status, error, refresh } = await useAsyncData('teachers', async () => {
    try {
      const { data, error } = await supabase.from('guru').select('id, nama').order('id')
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
    nama: ''
  })
  
  const selectedItem = computed(() => {
    return teachers.value.find(teacher => teacher.id === selectedId.value)
  })
  
  const closeModal = () => {
    selectedId.value = null
    state.nama = ''
  }
  
  const openEditModal = (teacherId) => {
    selectedId.value = teacherId
    if (selectedItem.value) {
      state.nama = selectedItem.value.nama
    }
    editModal.value = true
  }
  const closeEditModal = () => {
    closeModal()
    editModal.value = false
  }
  
  const validate = (state) => {
    const errors = []
    if (!state.nama) errors.push({ path: 'nama', message: 'Required' })
    return errors
  }
  
  const editLoading = ref(false)
  const editGuru = async (teacherId) => {
    try {
      editLoading.value = true
      const { error } = await supabase.from('guru').update({
        nama: state.nama,
      }).eq('id', teacherId)
      if (error) throw error
      closeEditModal()
      refresh()
    } catch (error) {
      console.error(error)
    } finally {
      editLoading.value = false
    }
  }
  
  const deleteModal = ref(false)
  
  const openDeleteModal = (teacherId) => {
    selectedId.value = teacherId
    deleteModal.value = true
  }
  const closeDeleteModal = () => {
    closeModal()
    deleteModal.value = false
  }
  
  const deleteLoading = ref(false)
  const deleteGuru = async (teacherId) => {
    try {
      deleteLoading.value = true
      const { error } = await supabase.from('guru').delete().eq('id', teacherId)
      if (error) throw error
      closeDeleteModal()
      refresh()
    } catch (error) {
      console.error(error)
    } finally {
      deleteLoading.value = false
    }
  }
  
  const columns = [
    {
      key: 'nama',
      label: 'Nama'
    }, {
      key: 'actions',
      class: 'w-20'
    }
  ]
  
  const page = ref(1)
  const pageCount = 8
  
  const filteredRows = computed(() => {
    if (!searchQuery.value) {
      return teachers.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }
  
    const filtered = teachers.value.filter((teacher) => {
      return teacher.nama.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
    })
  
    return filtered.slice((page.value - 1) * pageCount, (page.value) * pageCount)
  })
  </script>
  
  <style scoped></style>