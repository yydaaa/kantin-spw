<template>
  <div class="flex min-h-screen">
    <div class="min-w-52 bg-gray-300 flex flex-col">
      <UVerticalNavigation :links="links">
        <template #default="{ link }">
          <span class="group-hover:text-primary relative" :class="{ 'text-red-700 group-hover:text-red-700': link.label === 'Logout' }">{{ link.label }}</span>
        </template>
      </UVerticalNavigation>
      <div v-if="status == 'error'" class="text-red-500">{{ error.message }}</div>
    </div>
    <div class="container px-4 py-10 flex">
      <slot />
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { execute: logout, status, error } = useAsyncData('logout', async () => {
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) throw 'Logout gagal'
  else {
    navigateTo('/')
  }
}, {
  immediate: false
})

const links = [
  [
    {
      label: 'Dashboard',
      icon: 'i-heroicons-home',
      to: '/dashboard'
    },
    {
      label: 'Siswa',
      to: '/dashboard/siswa'
    },
    {
      label: 'Kelompok',
      to: '/dashboard/kelompok'
    },
    {
      label: 'Kelola Produk',
      to: '/dashboard/produk'
    }
  ],
  [
    {
      label: 'Logout',
      click: () => logout(),
      disabled: status == 'pending'
    }
  ]
]
</script>

<style scoped></style>