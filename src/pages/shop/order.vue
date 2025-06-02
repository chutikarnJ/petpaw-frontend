<template>
    <div class="min-h-screen px-6 py-10 bg-brand-light">
        <div class="max-w-5xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Order History</h1>

            <div v-if="orders.length === 0" class="text-gray-500 text-center py-20">
                You have no past orders.
            </div>

            <div v-else class="space-y-6">
                <div v-for="order in orders" :key="order.id" class="bg-white p-6 rounded-lg shadow">
                    <div class="flex justify-between mb-5">
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500">Order Code: <span class="font-semibold">#ORD{{
                                order.id.slice(0, 6).toUpperCase() }}</span></p>
                            <!-- <p class="text-sm text-gray-500">
                                Order ID: <span class="font-semibold">{{ order.id }}</span>
                            </p> -->
                            <p class="text-sm text-gray-500">
                                Date: <span>{{ formatDate(order.createdAt) }}</span>
                            </p>
                            <p class="text-sm text-gray-500">
                                Status:
                                <span :class="statusClass(order.status)" >
                                    {{ order.status }}
                                </span>
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-lg text-brand-orange">฿{{ order.total_price }}</p>
                        </div>
                    </div>

                    <table class="w-full table-fixed text-sm text-left border-t pt-4">
                        <colgroup>
                            <col class="w-3/5" />
                            <col class="w-1/5" /> 
                            <col class="w-1/5" /> 
                        </colgroup>
                        <thead class="text-gray-600 bg-gray-100">
                            <tr>
                                <th class="p-2">Product</th>
                                <th class="p-2 text-center">Quantity</th>
                                <th class="p-2 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in order.OrderItems" :key="item.id" class="border-t hover:bg-gray-50">
                                <td class="p-2">{{ item.product.name }}</td>
                                <td class="p-2 text-center">{{ item.quantity }}</td>
                                <td class="p-2 text-right">฿{{ item.product.price * item.quantity }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/libs/api";

const orders = ref([]);

const fetchOrders = async () => {
    try {
        const res = await api.get("/order");
        orders.value = res.data;
    } catch (err) {
        console.error("Failed to fetch orders:", err);
    }
};

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
};

const statusClass = (status) => {
    switch (status) {
        case "PENDING":
            return "text-brand-yellow font-medium text-bold";
        case "PAID":
            return "text-brand-teal font-medium text-bold";
        case "SHIPPED":
            return "text-brand-orange font-medium text-bold";
        case "COMPLETE":
            return "text-green-600 font-medium text-bold";
        case "CANCELLED":
            return "text-red-600 font-medium text-bold";
        default:
            return "text-gray-600";
    }
};

onMounted(() => {
    fetchOrders();
});
</script>
