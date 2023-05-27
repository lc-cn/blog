import {Article, Tree} from '@/types'
export interface Category{
    id:number
    pId?:number|null
    name:string
    articles?:Article[]
}
export type CategoryTree=Tree<Category>