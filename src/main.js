import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

//引入store和router
import store from "@/store/state"
import router from "@/router/index"

//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//use
app.use( store )
app.use( router )
app.use( ElementPlus )






app.mount('#app')
