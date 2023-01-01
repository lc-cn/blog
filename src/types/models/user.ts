import {Email} from "@/types";

export type UserInfo={
    name:string
    nickName:string
    age:number
    email:Email
    token?:string
    address:string
}
export type LoginParam={
    password:string
} & Pick<UserInfo, 'name'>