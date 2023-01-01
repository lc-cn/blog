export type Dict<T extends any=any, K extends string|symbol=string>={
    [P in K]:T
}
export interface GlobalConfig{
    tokenKey:string
    baseURL:string
    layout:string
}
export type Email=`${number|string}@${string}.${string}`