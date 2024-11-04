<template>
    <div class="flex  mb-10">
     <button @click="goBack" class="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-400 text-black hover:bg-gray-100">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
</div>
  <div class="flex gap-12 mb-10 flex justify-center">
    <UCard class="w-full">
      <template>
        <div class="font-semibold text-center ">JADWAL SISWA</div>
      </template>
    </UCard>

  </div>
  
    <div class="flex justify-between gap-8 w-full text-center">
      <!-- Display schedules related to students only -->
      <UCard v-for="schedule in schedules" :key="schedule.id" class="w-1/2">
        <template #header>
          <div class="font-semibold">{{ schedule.hari }}</div>
        </template>
  
        <!-- Show each student assigned to this schedule -->
        <div v-for="student in students" :key="student.id">{{ student.nama }}</div>
      </UCard>
    </div>
  </template>
  
  <script setup>
 import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}

  definePageMeta({
    middleware: 'auth',
    layout: 'dashboard',
  })
  
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  // Fetch user data to identify roles (optional if needed)
  const { data: userData } = await useAsyncData('userData', async () => {
    const { data, error } = await supabase.from('users').select('nama, role').eq('id', user.value.id).maybeSingle()
    if (error) throw error
    return data
  })
  
  // Fetch student data (siswa table)
  const { data: students } = await useAsyncData('students', async () => {
    const { data, error } = await supabase.from('siswa').select('id, nama').order('id')
    if (error) throw error
    return data
  })
  
  // Fetch schedules related to students (jadwal table)
  const { data: schedules } = await useLazyAsyncData('schedules', async () => {
    const { data, error } = await supabase.from('jadwal').select('id, hari').range(0, 3).order('id')
    if (error) throw error
    return data
  })
  
  const selectedId = ref(null)
  
  const state = reactive({
    nama: '',
    kelas: null,
    siswa: null,
  })
  </script>
  
  <style scoped>
  /* Add custom styling here if needed */
  </style>
  