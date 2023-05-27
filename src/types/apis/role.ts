import {Role, Pagination} from "@/types";

export interface RoleApis{
    '/role/list'(pagination:Partial<Pick<Pagination, 'pageNum'|'pageSize'>>):Pagination<Role[]>
    '/role/info'(condition:{id:number}):Role
}