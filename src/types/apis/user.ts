import {UserInfo,LoginParam} from "@/types";

export interface UserApis{
    '/user/login'(loginParam:LoginParam):string
    '/user/info'():UserInfo
    '/user/logout'():boolean
}