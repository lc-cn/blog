import {Tree} from '@/types'
export interface Menu{
    id:number|null
    name:string
    path:string
    component:string
    type:1|2|3
    icon:string
    sort:number
    pId?:number
}
export type MenuTree=Tree<Menu>