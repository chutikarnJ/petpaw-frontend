<!-- src/components/CategoryCard.vue -->
<template>
  <div class="cursor-pointer p-4 text-center transition" @click="$emit('select', title)">
    <div
      class="inline-block rounded-full bg-white shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
      <img :src="image" :alt="title" class="w-32 h-32 object-cover rounded-full mx-auto" />
    </div>
    <h3 class="mt-2 font-semibold text-lg text-brand-dark">{{ title }}</h3>
  </div>

</template>

<script setup>
defineProps({
  title: String,
  image: String,
})
</script>
