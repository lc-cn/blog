import {Tag} from "./tag";
import {CommentTree} from "@/types";

export interface Article{
    id:number
    title:string
    content:string
    comments?:CommentTree[]
    tags?:Tag[]
}