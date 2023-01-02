/// <reference types="vite/client" />
import type {ElMessage} from "element-plus";
import {useSystemStore,useUserStore,usePermissionStore} from "@/store";
// 扩展全局属性类型
declare module 'vue' {
    import type { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
    interface ComponentCustomProperties {
        $message: ElMessage
    }
}