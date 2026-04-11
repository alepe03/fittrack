import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { configurarManejo401ClienteApi } from '@/nucleo/red/setup_api_auth'
import './style.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
configurarManejo401ClienteApi()
app.mount('#app')
