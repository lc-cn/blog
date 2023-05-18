import {CategoryTree, Category, Pagination} from "@/types";

export interface CategoryApis{
    '/category/tree'(params:{pId:number|null}):CategoryTree
    '/category/list'(pagination:Partial<Pick<Pagination, 'pageNum'|'pageSize'>>):Pagination<Category[]>
    '/category/info'(params:Pick<Category, 'id'>):Category
    '/category/add'(params:Partial<Omit<Category, 'id'>>):boolean
    '/category/update'(params:Partial<Omit<Category, 'id'>>):boolean
    '/category/delete'(params:Pick<Category, 'id'>):boolean
}