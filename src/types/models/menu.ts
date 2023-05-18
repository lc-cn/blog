import {Api, Role, Tree} from '@/types'
export interface Menu{
    id:number
    name:string
    path:string
    component:string
    type:1|2|3
    icon:string
    sort:number
    pId?:number|null
    apis?:Api[]
    roles?:Role[]
}
export type MenuTree=Tree<Menu>