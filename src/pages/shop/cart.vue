<template>
  <div class="min-h-screen p-10 px-24">
    <h1 class="text-3xl font-bold mb-8">Your Cart</h1>

    <div v-if="cartItems.length > 0" class="overflow-x-auto">
      <table class="w-full border text-sm text-left">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="p-3">Product</th>
            <th class="p-3">Price</th>
            <th class="p-3 text-center">Quantity</th>
            <th class="p-3 px-10 text-center">Subtotal</th>
            <th class="p-3 px-6"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id" class="border-b hover:bg-gray-100">
            <td class="p-3 flex items-center gap-4">
              <img :src="`${api.defaults.baseURL}/public/uploads/${item.product.imageUrl}`"
                class="w-16 h-16 object-contain rounded" />
              <div>
                <p class="font-medium">{{ item.product.name }}</p>
                <p class="text-gray-500 text-sm">{{ item.product.brand }}</p>
              </div>
            </td>
            <td class="p-3">฿{{ item.product.price }}</td>
            <td class="p-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <button @click="changeQuantity(item, -1)" class="px-2 py-1 border rounded hover:bg-gray-200"
                  :disabled="item.quantity <= 1">
                  <i class="pi pi-minus" style=""></i>
                </button>

                <div class="w-10 h-8 border rounded flex items-center justify-center text-center bg-white text-lg">
                  {{ item.quantity }}
                </div>

                <button @click="changeQuantity(item, 1)" class="px-2 py-1 border rounded hover:bg-gray-200">
                  <i class="pi pi-plus"></i>
                </button>
              </div>
            </td>
            <td class="p-3 text-center font-semibold">฿{{ item.product.price * item.quantity }}</td>
            <td class="p-3 text-center">
              <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700 text-lg">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex flex-col lg:flex-row justify-between mt-8 gap-6">
        <!-- Left Buttons -->
        <div class="flex flex-col gap-4">
          <!-- <div class="flex gap-2">
            <input
              type="text"
              placeholder="Coupon Code"
              class="border rounded px-4 py-2 w-48"
              v-model="coupon"
            />
            <button class="bg-brand-orange text-white px-5 py-2 rounded hover:bg-orange-700">
              Apply Coupon
            </button>
          </div> -->
        </div>

        <!-- Right Summary -->
        <div class="border rounded-lg p-6 w-full lg:w-80 bg-white shadow">
          <h2 class="text-lg font-bold mb-4">Cart Total</h2>
          <div class="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>฿{{ totalPrice }}</span>
          </div>
          <div class="flex justify-between mb-4">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div class="flex justify-between font-bold text-lg mb-6">
            <span>Total:</span>
            <span>฿{{ totalPrice }}</span>
          </div>
          <router-link to="/cart/checkout">
            <button class="w-full bg-brand-orange text-white px-4 py-2 rounded hover:bg-orange-700">
              Proceed to Checkout
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center text-gray-500 py-20">Your cart is empty.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/libs/api";
import { useCartStore } from "@/stores/cart";
import swal from "sweetalert2";

const cartItems = ref([]);
const loading = ref(true);
const cart = useCartStore();

const updateQuantity = async (cardId, quantity) => {
  try {
    await api.put(`/cart/${cardId}`, { quantity });
    const index = cartItems.value.findIndex(i => i.id === cardId);
    if (index !== -1) {
      cartItems.value[index].quantity = quantity;
    }
    cart.fetchCartCount();
  } catch (err) {
    console.error("Failed to add item to cart", err);
    swal.fire({
      title: "Error",
      text: "Failed to add item to cart. Please try again.",
      icon: "error",
      timer: 2000,
    });
  }
};

const changeQuantity = (item, amount) => {
  const newQty = item.quantity + amount;
  if (newQty >= 1) {
    item.quantity = newQty;
    updateQuantity(item.id, item.quantity);
  }
};

const removeItem = async (itemId) => {
  try {
    await api.delete(`/cart/${itemId}`);
    cartItems.value = cartItems.value.filter((item) => item.id !== itemId);
    cart.fetchCartCount();
    swal.fire({
      title: "Item Removed",
      text: "The item has been removed from your cart.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Failed to remove item from cart", err);
    swal.fire({
      title: "Error",
      text: "Failed to remove item from cart. Please try again.",
      icon: "error",
      timer: 2000,
    });
  }
};

const fetchCart = async () => {
  try {
    const res = await api.get(`/cart`);
    cartItems.value = res.data;
  } catch (err) {
    console.error("Failed to fetch cart", err);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  fetchCart();
});

const totalPrice = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
);
</script>
