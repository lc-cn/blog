import {Tag, Pagination} from "@/types";

export interface TagApis{
    '/tag/list'(pagination:Partial<Pick<Pagination, 'pageNum'|'pageSize'>>):Pagination<Tag[]>
    '/tag/info'(params:Pick<Tag, 'id'>):Tag
    '/tag/add'(params:Partial<Omit<Tag, 'id'>>):boolean
    '/tag/update'(params:Partial<Omit<Tag, 'id'>>):boolean
    '/tag/delete'(params:Pick<Tag, 'id'>):boolean
}