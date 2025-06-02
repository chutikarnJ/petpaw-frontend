<template>
    <div class="min-h-screen bg-brand-light p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div class="bg-white p-6 rounded-lg shadow text-center">
                <p class="text-gray-500">Total Orders</p>
                <h2 class="text-2xl font-bold text-brand-dark">{{ stats.orders }}</h2>
            </div>
            <div class="bg-white p-6 rounded-lg shadow text-center">
                <p class="text-gray-500">Revenue</p>
                <h2 class="text-2xl font-bold text-brand-teal">฿{{ stats.revenue.toLocaleString() }}</h2>
            </div>
            <div class="bg-white p-6 rounded-lg shadow text-center">
                <p class="text-gray-500">Users</p>
                <h2 class="text-2xl font-bold text-brand-orange">{{ stats.users }}</h2>
            </div>
            <div class="bg-white p-6 rounded-lg shadow text-center">
                <p class="text-gray-500">Products</p>
                <h2 class="text-2xl font-bold text-purple-600">{{ stats.products }}</h2>
            </div>
        </div>

        <!-- Chart Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

            <div class="flex flex-col gap-8">
                <div class="bg-white p-6 rounded-lg shadow h-[460px] flex flex-col">
                    <h2 class="text-lg font-bold mb-2">Orders by Status</h2>
                    <div class="flex-grow flex items-center justify-center">
                        <div class="w-[350px] h-[350px]">
                            <PieChart :data="statusChartData" :options="pieChartOptions" />
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-lg font-bold mb-4">Top 3 Best-Selling Products</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm text-left border">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-4 py-2 border-b">Product</th>
                                    <th class="px-4 py-2 border-b">Unit Sold</th>
                                    <th class="px-4 py-2 border-b">Total Revenue (฿)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in stats.topSellers" :key="item.product_id" class="hover:bg-gray-50">
                                    <td class="px-4 py-2 border-b">{{ item.product_name }}</td>
                                    <td class="px-4 py-2 border-b">{{ item.total_sold }}</td>
                                    <td class="px-4 py-2 border-b">฿{{ item.total_revenue.toLocaleString() }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-8">
                <div class="bg-white p-6 rounded-lg shadow h-[350px]">
                    <h2 class="text-lg font-bold mb-4">Monthly Revenue (฿)</h2>
                    <LineChart :data="monthlyRevenueChartData" />
                </div>
                <div class="bg-white p-6 rounded-lg shadow h-[350px]">
                    <h2 class="text-lg font-bold mb-4">Monthly Order Count</h2>
                    <LineChart :data="monthlyOrderChartData" />
                </div>

            </div>

        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/libs/api'
import PieChart from '@/components/PieChart.vue'
import LineChart from '@/components/LineChart.vue'

const stats = ref({
    orders: 0,
    revenue: 0,
    users: 0,
    products: 0,
    orderGroup: [],
    MonthRevenue: [],
    topSellers: []
})


onMounted(async () => {
    try {
        const resStats = await api.get('/admin/dashboard')
        stats.value = resStats.data
    } catch (err) {
        console.error('Error fetching dashboard data:', err)
    }
})

const monthlyLabels = computed(() =>
    stats.value.MonthRevenue.map(r => {
        const [year, month] = r.month.split('-')
        const date = new Date(`${year}-${month}-01`)
        return date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
    })
)

const statusChartData = computed(() => ({
    labels: stats.value.orderGroup.map(g => g.status),
    datasets: [
        {
            label: 'Orders by Status',
            data: stats.value.orderGroup.map(g => g.count),
            backgroundColor: ['#facc15', '#38bdf8', '#4ade80', '#a78bfa', '#f87171'],
        },
    ],
}))

// Line chart for monthly revenue and orders
const monthlyRevenueChartData = computed(() => ({
    labels: monthlyLabels.value,
    datasets: [
        {
            label: 'Revenue (฿)',
            data: stats.value.MonthRevenue.map(r => r.total_revenue),
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
        },
    ],
}))

const monthlyOrderChartData = computed(() => ({
    labels: monthlyLabels.value,
    datasets: [
        {
            label: 'Orders',
            data: stats.value.MonthRevenue.map(r => r.order_count),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
        }
    ]
}))
</script>
