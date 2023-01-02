import {User} from './user'
import {Tree} from '@/types'
export interface Category{
    id:number
    name:string
    pId:number|null
    creatorId:number|null
    creator:User|null
}
export type CategoryTree=Tree<Category>