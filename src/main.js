import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(PrimeVue);

app.mount('#app')




