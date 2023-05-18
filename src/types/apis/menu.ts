import {MenuTree, Menu, Pagination} from "@/types";

export interface MenuApis{
    '/menu/tree'(params:{pId:number|null}):MenuTree
    '/menu/list'(pagination:Partial<Pick<Pagination, 'pageNum'|'pageSize'>>):Pagination<Menu[]>
    '/menu/info'(params:Pick<Menu, 'id'>):Menu
    '/menu/add'(params:Partial<Omit<Menu, 'id'>>):boolean
    '/menu/update'(params:Partial<Omit<Menu, 'id'>>):boolean
    '/menu/delete'(params:Pick<Menu, 'id'>):boolean
}