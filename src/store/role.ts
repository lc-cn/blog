import {defineStore} from "pinia";
import {Pagination, Role} from "@/types";
import {request} from "@/utils";

export const useRoleStore=defineStore('role', {
    actions: {
        async getRoleList(pagination:Partial<Pick<Pagination<Role>, 'pageNum'|'pageSize'>>):Promise<Pagination<Role[]>>{
            const res=await request.get('/role/list',pagination)
            if(res.code===200){
                return res.data
            }
            return {
                ...pagination,
                total:0,
                list:[]
            } as Pagination<Role[]>
        },
        async getRoleInfo(params:{id:number}){
           return request.get('/role/info',params).then(res=>res.data)
        }
    }
})