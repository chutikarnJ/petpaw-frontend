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
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

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
    meta: { requiresAuth: true },
  },
  {
    path: "/cart/checkout",
    name: "CartCheckout",
    component: CheckoutView,
    meta: { requiresAuth: true },
  },
  { path: "/order", name: "Order", component: OrderView, meta: { requiresAuth: true } },

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
  { path: "/:pathMatch(.*)*", name: "NotFound", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

//run everytime when router to new page
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const cart = useCartStore();

  // console.log(auth.isLoggedIn);

  if (auth.isLoggedIn) {
    await auth.fetchProfile();
    console.log("fetch profile index");
    await cart.fetchCartCount();
    console.log("fetch cart index");
  }

  if (to.meta.requiresAuth) {
    if (!auth.isLoggedIn) {
      return next("/signin");
    }
  }

  if (to.meta.requiresAdmin) {
    if (!auth.user || auth.user.role !== "ADMIN") {
      return next("/admin/signin");
    }
  }
  next();
});

export default router;
