import {defineStore} from "pinia";
import config from '@/config'
import {MenuTree} from "@/types";
import {request} from "@/utils";

export const useMenuStore=defineStore('menu', {
    state(){
        return {
            menus:JSON.parse(localStorage.getItem(config.tokenKey+':menus')||'[]')
        } as {
            menus:MenuTree
        }
    },
    actions: {
        async init(force?:boolean){
            if(!force && this.menus.length){
                return Promise.resolve()
            }
            const res=await request.get('/menu/tree',{pId:2})
            if(res.code===200){
                this.menus=res.data
                localStorage.setItem(config.tokenKey+':menus',JSON.stringify(res.data))
            }
            return true
        }
    }
})