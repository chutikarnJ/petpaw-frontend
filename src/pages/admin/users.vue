<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Users Management</h2>
      <select v-model="selectedRole" @change="filterUsers" class="input">
        <option value="ALL">All</option>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>

    <!-- Product Table -->
    <table class="w-full table-auto border border-gray-300 rounded-lg">
      <thead class="bg-brand-dark text-white">
        <tr>
          <th class="p-2 text-left">Email</th>
          <th class="p-2 text-left">Username</th>
          <th class="p-2">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in filteredUsers"
          :key="user.id"
          class="border-b border-gray-200 hover:bg-gray-200"
        >
          <td class="p-2">{{ user.email }}</td>
          <td class="p-2">{{ user.username }}</td>
          <td class="p-2 text-center">{{ user.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/libs/api";
import swal from "sweetalert2";

const users = ref([]);
const filteredUsers = ref([]);
const selectedRole = ref("ALL");

const fetchUsers = async () => {
  const res = await api.get("/user/list");
  users.value = res.data;
};

const filterUsers = () => {
  if (!selectedRole.value || selectedRole.value === "ALL") {
    filteredUsers.value = users.value;
  } else {
    filteredUsers.value = users.value.filter((user) => user.role === selectedRole.value);
  }
};

onMounted(async () => {
  try {
    await fetchUsers();
    filterUsers();
  } catch (error) {
    swal.fire({
      title: "Error",
      text: "Failed to fetch users",
      icon: "error",
      timer: 2000,
    });
  }
});
</script>
<style scoped>
.input {
  @apply border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-brand-teal;
}
</style>
