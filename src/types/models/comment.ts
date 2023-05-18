import {Article, Tree} from "@/types";

export interface Comment{
    id:number
    content:string
    article?:Article
}
export type CommentTree=Tree<Comment>