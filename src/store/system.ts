import {defineStore} from "pinia";
import globalConfig from '@/config'
import {Config} from "@/types";
import {request} from "@/utils";
import {CategoryTree} from "@/types/models/category";
const transformConfig=(list:Config[])=>{
    return Object.fromEntries(list.map((config)=>{
        return [config.key,config.value]
    }))
}
export const useSystemStore=defineStore('system',{
    state(){
        const configList=JSON.parse(localStorage.getItem(globalConfig.tokenKey+':configList')||'[]')
        return {
            config:transformConfig(configList),
            categories:JSON.parse(localStorage.getItem(globalConfig.tokenKey+':categories')||'[]'),
            configList,
        } as {
            config:Record<string, any>,
            categories:CategoryTree
            configList:Config[]
        }
    },
    actions:{
        async init(force?:boolean){
            if(!force && this.configList.length) return Promise.resolve()
            const res=await request.get('/config/all')
            if(res.code===200){
                this.configList=res.data
                this.config=transformConfig(res.data)
            }
        },
    }
})