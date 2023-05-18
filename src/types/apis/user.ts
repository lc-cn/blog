import {UserInfo, LoginParam, RoleInfo, Pagination, User} from "@/types";

export interface UserApis{
    '/user/login'(loginParam:LoginParam):string
    '/user/info'(params?:Pick<User, 'id'>):UserInfo & {roles: RoleInfo[] }
    '/user/logout'():boolean
    '/user/list'(pagination:{pageNum:number,pageSize:number}):Pagination<User[]>
}