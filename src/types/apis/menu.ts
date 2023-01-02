import {MenuTree} from "@/types";

export interface MenuApis{
    '/menu/tree'(params:{pId:number|null}):MenuTree
}