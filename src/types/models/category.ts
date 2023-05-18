import {Api, Role, Tree} from '@/types'
export interface Category{
    id:number
    pId?:number|null
    name:string
    apis?:Api[]
    roles?:Role[]
}
export type CategoryTree=Tree<Category>