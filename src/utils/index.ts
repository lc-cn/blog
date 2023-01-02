import {Tree, WithChild} from "@/types";

export {default as request} from './request'
export * from './auth'
export function distinctList<T>(list:T[], ...keys:(keyof T)[]):T[]{
    if (!keys.length) {return new Array(...new Set([...list]));}
    return list.filter((item, i)=>{
        const idx=list.findIndex(ite=>keys.every(key=>item[key]===ite[key]));
        return idx===i;
    });
}
export function toTree<I,CK extends string,PK extends keyof I,K extends keyof I>(list:I[],config:{key:K,cKey:CK,pKey:PK},pId:I[PK]):Tree<I,CK>{
    return list.filter((item)=>{
        return item[config.pKey]===pId
    }).map((item)=>{
        // @ts-ignore
        return {...item, [config.cKey]:toTree(list.filter((o)=>o[config.pKey]===item[config.key]),config,item[config.key])
        } as WithChild<I,CK>
    })
}