export interface Config{
    id:number
    // '配置标签'
    name:string
    // 配置描述
    desc?:string
    // 配置键名
    key:string
    // 配置值类型:1string,2:number,3:boolean,4:array,5:object
    type:1|2|3|4|5
    // 配置值
    value:any
    // 配置默认值
    defaultValue:any
}