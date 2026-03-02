import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'
import DemoPreview from './components/DemoPreview.vue'

const app = createApp(App)

app.use(router)

app.component('DemoPreview', DemoPreview)

app.mount('#app')
