import {Article, Tree} from "@/types";

export interface Comment{
    id:number
    pId?:number|null
    content:string
    article?:Article
}
export type CommentTree=Tree<Comment>