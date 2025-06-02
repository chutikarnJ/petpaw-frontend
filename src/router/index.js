import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/pages/home.vue";
import SignUpView from "@/pages/auth/signup.vue";
import SignInView from "@/pages/auth/signin.vue";
import AdminSignIn from "@/pages/admin/adminSignin.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import ShopView from "@/pages/shop/shop.vue";
import ProductView from "@/pages/shop/productDetail.vue";
import CartView from "@/pages/shop/cart.vue";
import CheckoutView from "@/pages/shop/checkout.vue";
import OrderView from "@/pages/shop/order.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/signup", name: "SignUp", component: SignUpView },
  { path: "/signin", name: "SignIn", component: SignInView },
  { path: "/shop", name: "Shop", component: ShopView },
  {
    path: "/shop/:id",
    name: "ProductDetail",
    component: ProductView,
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartView,
  },
  {
    path: "/cart/checkout",
    name: "CartCheckout",
    component: CheckoutView,
  },
  { path: "/order", name: "Order", component: OrderView },

  // Admin-only routes
  { path: "/admin/signin", name: "AdminSignIn", component: AdminSignIn },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: "dashboard", component: () => import("@/pages/admin/dashboard.vue") },
      { path: "users", component: () => import("@/pages/admin/users.vue") },
      { path: "products", component: () => import("@/pages/admin/products.vue") },
      { path: "orders", component: () => import("@/pages/admin/orders.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import { useAuthStore } from "@/stores/auth";

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  // If no user loaded but token exists (cookie), fetch profile
  if (!auth.user) {
    try {
      await auth.fetchProfile();
    } catch (err) {}
  }
  if (to.meta.requiresAdmin) {
    if (!auth.user || auth.user.role !== "ADMIN") {
      return next("/admin/signin");
    }
  }
  next();
});

export default router;
