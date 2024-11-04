<template>
  <div class="flex  mb-10">
     <UButton class="ml-6" icon="i-line-md-chevron-left-circle-twotone" size="xl"  color="green" variant="ghost"
            @click="goBack" />
</div>
  <div class="flex gap-12 mb-10 flex justify-center">
    <UCard class="w-1/2">
      <template>
        <div class="font-semibold text-center ">JADWAL GURU</div>
      </template>
    </UCard>

  </div>
  <div class="flex justify-between gap-8 w-full text-center">
    <UCard v-for="schedule in schedules" :key="schedule.id" class="w-1/2">

      <template #header>
        <div class="font-semibold">{{ schedule.hari }}</div>
      </template>

      <div v-for="teacher in teachers" :key="teacher.id">{{ teacher.nama }}</div>
    </UCard>
  </div>
</template>

<script setup>
import { _xl } from '#tailwind-config/theme/typography';
import { useRouter } from 'vue-router'
import Dashboard from '~/layouts/dashboard.vue';

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


const { data: userData } = await useAsyncData('userData', async () => {
  const { data, error } = await supabase.from('users').select('nama, role').eq('id', user.value.id).maybeSingle()
  if (error) throw error
  return data
})


const { data: teachers } = await useAsyncData('teachers', async () => {
  const { data, error } = await supabase.from('guru').select('id, nama').order('id')
  if (error) throw error
  return data
})


const { data: schedules } = await useLazyAsyncData('schedules', async () => {
  const { data, error } = await supabase.from('jadwal').select('id, hari').range(0, 3).order('id')
  if (error) throw error
  return data
})

const selectedId = ref(null)

const state = reactive({
  nama: '',
  kelas: null,
  guru: null,
})
</script>

<style scoped>

</style>
