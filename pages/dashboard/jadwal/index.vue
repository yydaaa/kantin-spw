<template>
  <div class="flex gap-12 mb-10 align-center">
    <NuxtLink class="w-1/2" to="/dashboard/jadwal/siswa">
      <UCard>
        <template>
          <div class="font-semibold text-center">JADWAL SISWA</div>
        </template>
      </UCard>
    </NuxtLink>
    <NuxtLink class="w-1/2" to="/dashboard/jadwal/guru">
      <UCard>
        <template>
          <div class="font-semibold text-center">JADWAL GURU</div>
        </template>
      </UCard>
    </NuxtLink>
  </div>
  <template>
    <div class="flex justify-between gap-8 w-full text-center">
      <UCard v-for="schedule in schedules" :key="schedule.hari" class="w-1/2">
        <template #header>
          <div class="font-semibold">{{ schedule.hari }}</div>
        </template>

        <div v-for="kelas in classes" :key="kelas.nama">{{ kelas.nama }}</div>

        <template #footer>
          <div v-for="teacher in teachers" :key="teacher.nama">{{ teacher.nama }}</div>
        </template>
      </UCard>
    </div>
  </template>




</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
})
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { data: userData } = await useAsyncData('userData', async () => {
  const { data, error } = await supabase.from('users').select('nama, role').eq('id', user.value.id).maybeSingle()
  if (error) throw error
  return data
})

const { data: teachers } = await useAsyncData('teachers', async () => {
  try {
    const { data, error } = await supabase.from('guru').select('id, nama').order('id')
    if (error) throw error
    return data
  } catch (error) {
    console.error(error)
    return
  }
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

const { data: schedules, status, error, refresh } = useLazyAsyncData('schedules', async () => {
  try {
    let query = supabase.from('jadwal').select(`
      id, hari
    `)
    const { data, error } = await query.range(0, 3).order('id')
    if (error) throw error
    return data
  } catch (error) {
    console.error(error)
    return
  }
})

const selectedId = ref(null)

const state = reactive({
  nama: '',
  kelas: null,
  guru: null
})

const selectedItem = computed(() => {
  return schedules.value.find(schedule => schedule.id === selectedId.value)
})


const validate = (state) => {
  const errors = []
  if (!state.nama) errors.push({ path: 'nama', message: 'Required' })
  if (!state.kelas) errors.push({ path: 'kelas', message: 'Required' })
  if (!state.guru) errors.push({ path: 'guru', message: 'Required' })
  return errors
}

</script>


<style scoped>

</style>