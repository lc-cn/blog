import {Role, Pagination, RoleWithUserAndMenu} from "@/types";

export interface RoleApis{
    '/role/list'(pagination:Partial<Pick<Pagination, 'pageNum'|'pageSize'>>):Pagination<Role[]>
    '/role/info'(condition:{id:number}):RoleWithUserAndMenu
}