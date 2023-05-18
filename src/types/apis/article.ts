import {Article, Pagination} from "@/types";

export interface ArticleApis{
    '/article/list'(pagination:Partial<Pick<Pagination, 'pageNum'|'pageSize'>>):Pagination<Article[]>
    '/article/info'(params:Pick<Article, 'id'>):Article
    '/article/add'(params:Partial<Omit<Article, 'id'>>):boolean
    '/article/update'(params:Partial<Omit<Article, 'id'>>):boolean
    '/article/delete'(params:Pick<Article, 'id'>):boolean
}