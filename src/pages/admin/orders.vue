<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h1>

        <div class="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <table class="w-full table-auto text-left">
                <thead class="bg-gray-100 text-gray-600 uppercase">
                    <tr>
                        <th class="p-3">Order Code</th>
                        <th class="p-3">Customer</th>
                        <th class="p-3">Total (฿)</th>
                        <th class="p-3">Date</th>
                        <th class="p-3">Status</th>
                        <th class="p-3"></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="order in orders" :key="order.id">
                        <tr class="border-t hover:bg-gray-100 transition">
                            <td class="p-3 font-mono text-medium">
                                #ORD{{ order.id.slice(0, 6).toUpperCase() }}
                            </td>
                            <td class="p-3">{{ order.user?.username || 'Guest' }}</td>
                            <td class="p-3">฿{{ order.total_price.toLocaleString() }}</td>
                            <td class="p-3">{{ formatDate(order.createdAt) }}</td>
                            <td class="p-3">
                                <span :class="statusClass(order.status)">
                                    {{ order.status }}
                                </span>
                            </td>
                            <td class="p-3 space-x-2">
                                <button @click="toggleExpand(order.id)" class="transition-transform">
                                    <i class="pi pi-chevron-down text-brand-dark" :class="{
                                        'rotate-180': expandedId === order.id,
                                        'rotate-0': expandedId !== order.id,
                                    }"></i>
                                </button>
                            </td>
                        </tr>
                        <!-- Expandable Details Row -->
                        <tr v-if="expandedId === order.id">
                            <td colspan="6" class="pt-0">
                                <div class="ml-6 mt-2 mb-4 mr-6 border rounded-lg bg-gray-50 p-4 shadow-sm">
                                    <h4 class="font-semibold text-gray-700 mb-2">Order Items</h4>
                                    <table class="text-sm w-full table-auto">
                                        <thead class="bg-gray-200 text-brand-dark rounded">
                                            <tr>
                                                <th class="p-2">Product</th>
                                                <th class="p-2">Brand</th>
                                                <th class="p-2 text-center">Qty</th>
                                                <th class="p-2 text-right">Unit Price</th>
                                                <th class="p-2 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in order.OrderItems" :key="item.id" class="border-t">
                                                <td class="p-2">{{ item.product.name }}</td>
                                                <td class="p-2">{{ item.product.brand }}</td>
                                                <td class="p-2 text-center">{{ item.quantity }}</td>
                                                <td class="p-2 text-right">฿{{ item.product.price }}</td>
                                                <td class="p-2 text-right">
                                                    ฿{{ item.quantity * item.product.price }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

            <div v-if="orders.length === 0" class="text-center text-gray-500 py-12">
                No orders found.
            </div>

            <!-- Pagination Controls -->
            <div class="flex justify-between items-center mt-6">
                <p class="text-sm text-gray-600">
                    Showing page {{ currentPage }} of {{ totalPages }} — Total {{ totalOrders }} orders
                </p>
                <div class="space-x-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
                        Prev
                    </button>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/libs/api'

const orders = ref([])
const expandedId = ref(null)
const totalPages = ref(0);
const totalOrders = ref(0);
const currentPage = ref(1);

const fetchOrders = async () => {
    try {
        const res = await api.get('/admin/order')
        orders.value = res.data.data
        totalPages.value = res.data.totalPages
        totalOrders.value = res.data.count
        
    } catch (err) {
        console.error('Failed to fetch orders:', err)
    }
}

const toggleExpand = (id) => {
    expandedId.value = expandedId.value === id ? null : id
}

const formatDate = (str) => {
    const d = new Date(str)
    return d.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const statusClass = (status) => {
    switch (status) {
        case 'PENDING':
            return 'text-brand-yellow font-medium'
        case 'PAID':
            return 'text-brand-teal font-medium'
        case 'SHIPPED':
            return 'text-brand-orange font-medium'
        case 'COMPLETE':
            return 'text-green-600 font-medium'
        case 'CANCELLED':
            return 'text-red-500 font-medium'
        default:
            return 'text-gray-500'
    }
}

onMounted(() => {
    fetchOrders()
})
</script>
