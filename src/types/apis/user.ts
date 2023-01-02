import {UserInfo, LoginParam, RoleInfo} from "@/types";

export interface UserApis{
    '/user/login'(loginParam:LoginParam):string
    '/user/info'():UserInfo & {roles: RoleInfo[] }
    '/user/logout'():boolean
}