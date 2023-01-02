export type Dict<T extends any=any, K extends string|symbol=string>={
    [P in K]:T
}
export interface GlobalConfig{
    tokenKey:string
    baseURL:string
}
export type Pagination<I=any>={
    list:I,
    pageNum:number
    pageSize:number
    total:number
}
export type Tree<O={},K extends string='children'>= WithChild<O,K>[]
export type WithChild<O ={},K extends string='children'>=O & {[P in K]?:Tree<O,K>}
export type Email=`${number|string}@${string}.${string}`