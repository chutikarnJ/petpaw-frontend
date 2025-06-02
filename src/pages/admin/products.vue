<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Product Management</h2>
      <button
        @click="showModal = true"
        class="bg-brand-teal text-white px-4 py-2 rounded-lg hover:bg-teal-700"
      >
        + Add Product
      </button>
    </div>

    <!-- Product Table -->
    <table class="w-full table-auto border border-gray-300 rounded-lg">
      <thead class="bg-brand-dark text-white">
        <tr>
          <th class="p-2 text-left">Image</th>
          <th class="p-2 text-left">Name</th>
          <th class="p-2">Category</th>
          <th class="p-2">Brand</th>
          <th class="p-2">Type</th>
          <th class="p-2">Price</th>
          <th class="p-2">Stock</th>
          <th class="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
          class="border-b border-gray-200 hover:bg-gray-200"
        >
          <td class="p-2">
            <img
              :src="product.imageUrl ? `${apiUrl}/public/uploads/${product.imageUrl}` : noImageIcon"
              alt="Product"
              class="h-16 w-16 object-cover rounded"
            />
          </td>
          <td class="p-2">{{ product.name }}</td>
          <td class="p-2 text-center">{{ product.category }}</td>
          <td class="p-2 text-center">{{ product.brand }}</td>
          <td class="p-2 text-center">{{ product.petTypes.join(", ") }}</td>
          <td class="p-2 text-center">{{ product.price }} ฿</td>
          <td class="p-2 text-center">{{ product.stock }}</td>
          <td class="p-2 text-center space-x-2">
            <button @click="editProduct(product)" class="text-blue-500 hover:underline">
              Edit
            </button>
            <button @click="deleteProduct(product.id)" class="text-red-500 hover:underline">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-6">
      <p class="text-sm text-gray-600">
        Showing page {{ currentPage }} of {{ totalPages }} — Total {{ totalProducts }} products
      </p>
      <div class="space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-brand-light rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto space-y-4">
        <h3 class="text-xl font-semibold">
          {{ editingProduct ? "Edit Product" : "Add New Product" }}
        </h3>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-brand-dark mb-1">Product Name</label>
          <input v-model="form.name" type="text" placeholder="Enter product name" class="input" />
        </div>

        <!-- Brand -->
        <div>
          <label class="block text-sm font-medium text-brand-dark mb-1">Product Brand</label>
          <input v-model="form.brand" type="text" placeholder="Enter product brand" class="input" />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-brand-dark mb-1">Description</label>
          <textarea
            v-model="form.description"
            type="text"
            placeholder="Enter product description"
            class="input"
          />
        </div>

        <!-- Price -->
        <div>
          <label class="block text-sm font-medium text-brand-dark mb-1">Price (฿)</label>
          <input v-model="form.price" type="number" placeholder="Enter price" class="input" />
        </div>

        <!-- Stock -->
        <div>
          <label class="block text-sm font-medium text-brand-dark mb-1">Stock Quantity</label>
          <input
            v-model="form.stock"
            type="number"
            placeholder="Enter stock quantity"
            class="input"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-brand-dark mb-1">Category</label>
          <select v-model="form.category" class="input">
            <option value="" disabled>Select category</option>
            <option value="FOOD">FOOD</option>
            <option value="TOYS">TOYS</option>
            <option value="GROOMING">GROOMING</option>
            <option value="HEALTH">HEALTH</option>
            <option value="ACCESSORIES">ACCESSORIES</option>
          </select>
        </div>

        <!-- Pet Type -->
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">Pet Type</label>
          <Multiselect
            v-model="form.petTypes"
            placeholder="Select pet types"
            :options="petTypes"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
            class="border border-gray-300 rounded-md text-sm"
            :class="{
              'focus:ring-brand-teal focus:border-brand-teal': true,
            }"
          />
        </div>

        <!-- Image URL -->
        <div>
          <label class="block text-sm font-medium text-brand-dark mb-1">Image URL</label>
          <input type="file" @change="handleImageUpload" class="input" />
        </div>
        <div v-if="form.imageUrl" class="mt-2">
          <img
            :src="`${apiUrl}/public/uploads/${form.imageUrl}`"
            class="w-[150px] rounded-xl shadow-md"
          />
        </div>

        <div class="flex justify-end space-x-3 mt-4">
          <button @click="saveProduct" class="bg-brand-teal text-white px-4 py-1.5 rounded">
            Save
          </button>
          <button @click="resetForm" class="bg-gray-300 px-4 py-1.5 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import noImageIcon from "@/assets/images/no-image-icon.png";
import api from "@/libs/api";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import swal from "sweetalert2";

const petTypes = ["ALL", "DOG", "CAT", "BIRD", "RABBIT", "OTHER"];

const products = ref([]);
const totalPages = ref(0);
const totalProducts = ref(0);
const currentPage = ref(1);

const showModal = ref(false);
const editingProduct = ref(null);

const form = ref({
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: "",
  petTypes: [],
  imageUrl: null,
  brand: "",
});

const handleImageUpload = (e) => {
  form.imageUrl = e.target.files[0];
  console.log("Image file selected:", form.imageUrl);
};

const apiUrl = api.defaults.baseURL;

const changePage = async (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    await fetchProducts(currentPage.value);
  }
};

const resetForm = () => {
  showModal.value = false;
  editingProduct.value = null;
  form.value = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    imageUrl: null,
    petTypes: [],
    brand: "",
  };
};

const editProduct = (product) => {
  editingProduct.value = product;
  form.value = { ...product };
  showModal.value = true;
};

const saveProduct = async () => {
  try {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("price", form.value.price);
    formData.append("stock", form.value.stock);
    formData.append("category", form.value.category);
    formData.append("description", form.value.description || "");
    formData.append("brand", form.value.brand);
    formData.append("petTypes", JSON.stringify(form.value.petTypes || []));
    if (form.imageUrl) {
      formData.append("imageUrl", form.imageUrl);
    }

    if (editingProduct.value) {
      await api.put(`/product/update/${editingProduct.value.id}`, formData);
      swal.fire({
        title: "Success",
        text: "Edit product successfully",
        icon: "success",
        timer: 2000,
      });
    } else {
      await api.post("/product/create", formData);
      swal.fire({
        title: "Success",
        text: "Create product successfully",
        icon: "success",
        timer: 2000,
      });
    }
    await fetchProducts();
    resetForm();
  } catch (err) {
    console.error("Error saving product:", err);
    swal.fire({
      title: "Error",
      text: "Failed to save product",
      icon: "error",
      timer: 2000,
    });
  }
};

const deleteProduct = async (id) => {
  const result = await swal.fire({
    title: "Are you sure?",
    text: "This product will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
      cancelButton: "bg-gray-300 text-black px-4 py-2 mx-3 rounded hover:bg-gray-400",
    },
    buttonsStyling: false,
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/product/delete/${id}`);
      await fetchProducts();

      swal.fire({
        title: "Success",
        text: "Delete product successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      swal.fire({
        title: "Error",
        text: "Failed to delete product",
        icon: "error",
      });
      console.error(error);
    }
  }
};

const addTag = (newTag) => {
  if (!form.value.petTypes.includes(newTag)) {
    form.value.petTypes.push(newTag);
  }
};

const fetchProducts = async (page = 1) => {
  const res = await api.get("/product", {
    params: {
      page,
      limit: 10,
    },
  });
  products.value = res.data.data;
  totalPages.value = res.data.totalPages;
  totalProducts.value = res.data.count;
};

onMounted(async () => {
  try {
    await fetchProducts();
  } catch (err) {
    console.error("Error fetching products:", err);
  }
});
</script>

<style scoped>
.input {
  @apply w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-brand-teal;
}

.multiselect {
  @apply w-full border border-gray-300 rounded-md text-sm shadow-sm;
}

.multiselect__tags {
  @apply flex flex-wrap gap-2 px-2 py-1 min-h-[2.5rem] items-center rounded-md;
}

.multiselect__tag {
  @apply bg-brand-teal text-white text-xs px-2 py-1 rounded;
}

.multiselect__placeholder {
  @apply text-gray-400;
}

.multiselect__input {
  @apply text-sm focus:outline-none px-2;
}

.multiselect__option {
  @apply px-3 py-2 cursor-pointer hover:bg-brand-light;
}

.multiselect__option--highlight {
  @apply bg-brand-teal text-white;
}

/* Ensure dropdown is visible */
.multiselect__content-wrapper {
  @apply absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1;
}
</style>
