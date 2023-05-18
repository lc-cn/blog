import {Email, RoleInfo} from "@/types";
export interface User{
    id:number
    username:string
    nickname:string
    password?:string
    age:number
    avatar?:string
    email:Email
}
export interface UserInfo extends User{
    roles:RoleInfo[]
}
export type LoginParam={
    password:string
} & Pick<User, 'username'>