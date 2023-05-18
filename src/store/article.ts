import {defineStore} from "pinia";
import {Article} from "@/types";
import {request} from "@/utils";

export const useArticleStore=defineStore('article', {
    actions: {
        async addArticle(params:Partial<Omit<Article, 'id'>>){
            return request.post('/article/add',params)
        },
        async updateArticle({id,...params}:Partial<Article>){
            return request.post('/article/update',params,{params:{id}})
        },
        getArticleInfo(params:Pick<Article, 'id'>){
            return request.get('/article/info',params)
        },
        getArticleList(pageInfo:Partial<{pageNum:number,pageSize:number}>){
            return request.post('/article/list',{},{params:pageInfo})
        }
    }
})