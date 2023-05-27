import {Menu} from "./menu";
import {User} from "@/types";

export interface Role{
    id:number
    name:string
    menus?:Menu[]
    users?:Pick<User, 'id'|'username'>[]
}