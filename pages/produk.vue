<template>
  <div class="flex flex-col flex-grow gap-y-5">
    <div v-if="status == 'pending' || status == 'error'">
      <div v-if="status == 'pending'">
        Loading...
      </div>

      <div v-if="status == 'error'">
        {{ error.message }}
      </div>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-5">
      <div v-for="product in products" :key="product.id" class="flex">
        <UCard class="flex flex-col" :class="borderClass(product.kelompok.kelas.nama)" :ui="{ header: { base: 'flex-grow flex items-center' } }">
          <template #header>
            <NuxtImg v-if="product.fotoUrl" :src="product.fotoUrl" width="300" />
            <NuxtImg v-else src="img/img-placeholder.png" width="300" />
          </template>
          <div class="text-center font-bold text-lg">{{ product.nama }}</div>
          <div v-if="product.kelompok" class="text-center text-gray-500 text-sm">{{ product.kelompok.nama }} / {{
            product.kelompok.kelas.nama }}</div>
          <div class="text-sm">Jumlah Tersimpan: {{ product.banyak }}</div>
          <div class="text-sm">Harga: Rp.{{ rupiah(product.harga) }}</div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const borderClass = (kelas) => {
  return {
    'border border-green-500': (kelas.includes('PPLG')),
    'border border-blue-500': (kelas.includes('TJKT')),
    'border border-red-500': (kelas.includes('TSM')),
    'border border-orange-500': (kelas.includes('DKV')),
    'border border-gray-500': (kelas.includes('TOI'))
  }
}

const { data: products, status, error, refresh } = useLazyAsyncData('products', async () => {
  try {
    let { data, error } = await supabase.from('produk').select(`
      *,
      kelompok (
        id, nama,
        kelas (
          nama
        )
      )
    `).order('foto')
    if (error) throw error
    if (data) {
      data = data.map(data => {
        const { data: url } = supabase.storage.from('produk').getPublicUrl(data.foto)
        return {
          ...data,
          fotoUrl: data.foto ? url.publicUrl : null
        }
      })
    }
    return data
  } catch (error) {
    console.error(error)
    return
  }
})
</script>

<style scoped></style>