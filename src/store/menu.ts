import {defineStore} from "pinia";
import config from '@/config'
import {Menu, MenuTree} from "@/types";
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
        async init(pId:number|null=2,force?:boolean){
            if(!force && this.menus.length){
                return Promise.resolve()
            }
            const res=await request.get('/menu/tree',{pId})
            if(res.code===200){
                this.menus=res.data
                localStorage.setItem(config.tokenKey+':menus',JSON.stringify(res.data))
            }
            return true
        },
        async addMenu(params:Partial<Omit<Menu, 'id'>>){
          return request.post('/menu/add',params)
        },
        async updateMenu({id,...params}:Partial<Menu>){
            return request.put('/menu/update',params,{params:{id}})
        },
        getMenuInfo(params:Pick<Menu, 'id'>){
            return request.get('/menu/info',params)
        },
        getMenuTree(params:{pId:number|null}){
            return request.get('/menu/tree',params)
        },
        getMenuList(pageInfo:Partial<{pageNum:number,pageSize:number}>){
            return request.post('/menu/list',{},{params:pageInfo})
        }
    }
})