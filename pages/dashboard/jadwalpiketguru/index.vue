<!-- <template>
    <div class="flex justify-center  min-h-screen">
      <div class="bg-teal-800 shadow-lg rounded-lg w-full max-w-4xl">
 
        <div class="grid-row text-white text-center py-2 font-semibold text-lg">
          JADWAL PIKET GURU
        </div>
        <div class="  text-white px-4 py-2 flex justify-between items-center">
          <span>SEP 2024</span>
          <span class="text-xs">▼</span>
        </div>
        <div class="grid grid-cols-4 gap-4 text-white  p-4">
          <div class="border-r-2 border-teal-900 p-2">
            <div class="font-bold text-center">Senin</div>
            <div class="text-center text-lg mt-2">9</div>
            <div class="mt-4 text-center">Deni Maulana</div>           
          </div>
          <div class="border-r-2 border-teal-900 p-2">
            <div class="font-bold text-center">Selasa</div>
            <div class="text-center text-lg mt-2">10</div>
          </div>
          <div class="border-r-2 border-teal-900 p-2">
            <div class="font-bold text-center">Rabu</div>
            <div class="text-center text-lg mt-2">11</div>
          </div>
          <div class="p-2">
            <div class="font-bold text-center">Kamis</div>
            <div class="text-center text-lg mt-2">12</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>

  definePageMeta({
    layout: 'dashboard'

  })
  </script>
  
  <style scoped>


  </style>
   -->
   <template>
    <div class="flex justify-center min-h-screen">
      <div class="bg-teal-700 shadow-lg rounded-lg w-full max-w-4xl">
        <!-- Header Jadwal -->
        <div class="bg-teal-700 text-white text-center py-2 font-semibold text-lg">
          JADWAL PIKET GURU
        </div>
  
        <!-- Tanggal dan Bulan -->
        <div class="bg-teal-800 text-white px-4 py-2 flex justify-between items-center">
          <span>SEP 2024</span>
          <span class="text-xs">▼</span>
        </div>
  
        <!-- Table for the Schedule -->
        <table class="table-auto w-full text-white bg-teal-700">
          <thead>
            <tr class="bg-teal-800">
              <th class="py-2 px-4 border border-teal-900">Senin</th>
              <th class="py-2 px-4 border border-teal-900">Selasa</th>
              <th class="py-2 px-4 border border-teal-900">Rabu</th>
              <th class="py-2 px-4 border border-teal-900">Kamis</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center">
              <td class="py-4 border border-teal-900">
                <div>9</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
              </td>
              <td class="py-4 border border-teal-900">
                <div>10</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
              </td>
              <td class="py-4 border border-teal-900">
                <div>11</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
              </td>
              <td class="py-4 border border-teal-900">
                <div>12</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
                <div class="mt-2 font-bold">Deni Maulana</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  

  <script>

  definePageMeta({
    layout: 'dashboard'

  })
  </script>
  
  <style scoped>


  </style>
  