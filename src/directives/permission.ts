import {Directive} from "vue";
import {usePermissionStore} from "@/store";

type Permission={
    type:'route'|'api',
    value:string[]
}
export const vPermission:Directive<HTMLElement,string|string[]|Permission>={
    mounted(el,binding){
        if(typeof binding.value==='string'){
            binding.value=[binding.value]
        }
        if(Array.isArray(binding.value)){
            binding.value={
                type:'api',
                value:binding.value
            }
        }
        if(typeof binding.value.value==='string') binding.value.value=[binding.value.value]
        const permissionStore=usePermissionStore()
        const permissions=binding.value.type==='api'?permissionStore.permissions
            .map(menu=>menu.apis?.map(api=>api.url))
            .filter(Boolean)
            .flat(1) as string[]:permissionStore.permissions.map(menu=>menu.path)
        let hasAuth:boolean=binding.value.value.every((v)=>{
            return permissions.includes(v)
        })
        if(el && !hasAuth){
            el.parentNode?.removeChild(el)
        }
    }
}
