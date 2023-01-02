import {Menu} from "./menu";
import {User} from "@/types";

export interface Role{
    id:number
    name:string
}
export interface RoleInfo extends Role{
    menus?:Menu[]
}
export interface RoleWithUserAndMenu extends Role{
    menus:Pick<Menu, 'id'>[]
    users:Pick<User, 'id'|'username'>[]
}