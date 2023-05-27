import {UserInfo, LoginParam, Role, Pagination, User} from "@/types";

export interface UserApis{
    '/user/login'(loginParam:LoginParam):string
    '/user/info'(params?:Pick<User, 'id'>):UserInfo & {roles: Role[] }
    '/user/logout'():boolean
    '/user/list'(pagination:{pageNum:number,pageSize:number}):Pagination<User[]>
}