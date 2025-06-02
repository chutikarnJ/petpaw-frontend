<template>
    <div class="min-h-screen px-6 py-10 bg-brand-light">
        <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 class="text-2xl font-bold mb-6">Checkout</h1>

            <!-- Billing Information -->
            <!-- <section class="mb-8">
        <h2 class="text-lg font-semibold mb-4">Billing Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="billing.name" type="text" placeholder="Full Name" class="input" />
          <input v-model="billing.email" type="email" placeholder="Email" class="input" />
          <input v-model="billing.address" type="text" placeholder="Address" class="input" />
          <input v-model="billing.phone" type="text" placeholder="Phone" class="input" />
        </div>
      </section> -->

            <!-- Order Summary -->
            <section class="mb-8">
                <h2 class="text-lg font-seญibold mb-4">Order Summary</h2>
                <ul class="divide-y">
                    <li v-for="item in cartItems" :key="item.id" class="flex justify-between py-2 text-sm">
                        <span>{{ item.product.name }} × {{ item.quantity }}</span>
                        <span>฿{{ item.product.price * item.quantity }}</span>
                    </li>
                </ul>
                <div class="flex justify-between font-semibold mt-4">
                    <span>Total:</span>
                    <span>฿{{ totalPrice }}</span>
                </div>
            </section>

            <!-- Payment Button -->
            <router-link to="/order">
                <button @click="handleCheckout"
                    class="w-full bg-brand-orange text-white py-2 rounded hover:bg-orange-700 text-lg">
                    Confirm & Pay
                </button>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "@/stores/cart";
import api from "@/libs/api";
import swal from "sweetalert2";

const cart = useCartStore();
const cartItems = ref([]);
// const billing = ref({
//   name: "",
//   email: "",
//   address: "",
//   phone: "",
// });

const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
);

const fetchCart = async () => {
    try {
        const res = await api.get("/cart");
        cartItems.value = res.data;
    } catch (err) {
        console.error("Error fetching cart:", err);
    }
};

const handleCheckout = async () => {
    try {
        // if (!billing.value.name || !billing.value.email || !billing.value.address) {
        //   return swal.fire("Missing Info", "Please fill in all required fields.", "warning");
        // }

        await api.post("/order/create");

        cartItems.value = [];
        cart.reset();
        swal.fire("Success", "Your order has been placed!", "success");
    } catch (err) {
        console.error("Checkout failed:", err);
        swal.fire("Error", "Failed to complete checkout. Try again.", "error");
    }
};

onMounted(() => {
    fetchCart();
});
</script>

<style scoped>
.input {
    @apply border px-4 py-2 rounded w-full;
}
</style>
