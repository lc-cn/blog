import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementIcons from '@element-plus/icons-vue'
import {createPinia} from "pinia";
import App from './App.vue'
import router from './router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import './styles/index.scss'
const pinia = createPinia()
import './permission'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementIcons)) {
    app.component(key, component)
}
app.use(pinia)
    .use(router)
    .use(ElementPlus, {
        locale: zhCn,
    })
app.mount('#root')
