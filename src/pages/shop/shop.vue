<template>
  <div class="min-h-screen bg-brand-light text-brand-dark p-6">
    <div class="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

      <!-- Sidebar Filter -->
      <aside class="bg-white rounded-lg p-10 shadow-md h-fit">
        <h2 class="text-xl font-bold mb-4">Filter</h2>

        <div class="mb-6">
          <h3 class="font-bold mb-2">Category</h3>
          <div v-for="cat in categories" :key="cat" class="flex items-center gap-2 mb-1">
            <input type="checkbox" :value="cat" v-model="selectedCategories" />
            <span>{{ cat }}</span>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-bold mb-2">Pet Type</h3>
          <div v-for="type in petTypes" :key="type" class="flex items-center gap-2 mb-1">
            <input type="checkbox" :value="type" v-model="selectedPetTypes" />
            <span>{{ type }}</span>
          </div>
        </div>

        <div>
          <h3 class="font-bold mb-2">Price (฿)</h3>
          <input type="range" v-model="maxPrice" :min="0" :max="1000" class="w-full" />
          <p class="text-sm mt-1">Up to ฿{{ maxPrice }}</p>
        </div>
      </aside>

      <!-- Product Grid -->
      <main class="md:col-span-3">
        <h2 class="text-2xl font-bold mb-6">All Products</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :productId="product.id"
            :title="product.name" :image="product.imageUrl" :brand="product.brand" :price="product.price"
            class="button" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/libs/api'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const products = ref([])

const shopCategory = ref(route.query.category || 'ALL')
const categories = ['FOOD', 'TOYS', 'GROOMING', 'HEALTH', 'ACCESSORIES']
const petTypes = ['DOG', 'CAT', 'BIRD', 'RABBIT', 'ALL', 'OTHER']

const selectedCategories = ref([])
const selectedPetTypes = ref([])
const maxPrice = ref(1000)

const fetchProducts = async () => {
  const res = await api.get('/product', {
    params: {
      page: 1,
      limit: 20,
    }
  })
  products.value = res.data.data
}

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const categoryMatch = selectedCategories.value.length === 0 || selectedCategories.value.includes(product.category)
    const petTypeMatch = selectedPetTypes.value.length === 0 || product.petTypes.some(type => selectedPetTypes.value.includes(type))
    const priceMatch = product.price <= maxPrice.value
    return categoryMatch && petTypeMatch && priceMatch
  })
})

onMounted(async () => {
  try {
    await fetchProducts()

    if (shopCategory.value && categories.includes(shopCategory.value.toUpperCase())) {
      selectedCategories.value = [shopCategory.value.toUpperCase()]
    }

  } catch (err) {
    console.error('Error fetching products:', err)
  }
})
</script>

<style scoped>
input[type="checkbox"] {
  accent-color: theme('colors.brand.orange');
}
</style>