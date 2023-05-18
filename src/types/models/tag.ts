import {Article} from "@/types";

export interface Tag{
    id:number
    name:string
    articles?:Article[]
}