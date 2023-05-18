import {defineStore} from "pinia";
import {Tag} from "@/types";
import {request} from "@/utils";

export const useTagStore=defineStore('tag', {
    actions: {
        async addTag(params:Partial<Omit<Tag, 'id'>>){
            return request.post('/tag/add',params)
        },
        async updateTag({id,...params}:Partial<Tag>){
            return request.post('/tag/update',params,{params:{id}})
        },
        getTagInfo(params:Pick<Tag, 'id'>){
            return request.get('/tag/info',params)
        },
        getTagList(pageInfo:Partial<{pageNum:number,pageSize:number}>){
            return request.post('/tag/list',{},{params:pageInfo})
        }
    }
})