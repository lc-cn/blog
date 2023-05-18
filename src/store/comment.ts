import {defineStore} from "pinia";
import {Comment} from "@/types";
import {request} from "@/utils";

export const useCommentStore=defineStore('comment', {
    actions: {
        async addComment(params:Partial<Omit<Comment, 'id'>>){
            return request.post('/comment/add',params)
        },
        async updateComment({id,...params}:Partial<Comment>){
            return request.post('/comment/update',params,{params:{id}})
        },
        getCommentInfo(params:Pick<Comment, 'id'>){
            return request.get('/comment/info',params)
        },
        getCommentList(pageInfo:Partial<{pageNum:number,pageSize:number}>){
            return request.post('/comment/list',{},{params:pageInfo})
        }
    }
})