import {CommentTree, Comment, Pagination} from "@/types";

export interface CommentApis{
    '/comment/tree'(params:{pId:number|null}):CommentTree
    '/comment/list'(pagination:Partial<Pick<Pagination, 'pageNum'|'pageSize'>>):Pagination<Comment[]>
    '/comment/info'(params:Pick<Comment, 'id'>):Comment
    '/comment/add'(params:Partial<Omit<Comment, 'id'>>):boolean
    '/comment/update'(params:Partial<Omit<Comment, 'id'>>):boolean
    '/comment/delete'(params:Pick<Comment, 'id'>):boolean
}