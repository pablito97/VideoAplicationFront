import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'

const app = createApp(App)

app.use(
    router,
    Vuelidate
)

app.mount('#app')
