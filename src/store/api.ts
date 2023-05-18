import {defineStore} from "pinia";
import {Pagination, Api} from "@/types";
import {request} from "@/utils";

export const useApiStore=defineStore('api', {
    actions: {
        async getApiList(pagination:Partial<Pick<Pagination<Api>, 'pageNum'|'pageSize'>>):Promise<Pagination<Api[]>>{
            const res=await request.post('/api/list',{},{params:pagination})
            if(res.code===200){
                return res.data
            }
            return {
                ...pagination,
                total:0,
                list:[]
            } as Pagination<Api[]>
        },
        async getApiInfo(params:{id:number}){
           return request.get('/api/info',params).then(res=>res.data)
        }
    }
})