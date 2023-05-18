import {Rules} from 'async-validator'
type Method='GET'|'POST'|'PUT'|'DELETE'
export interface Api{
    id:number
    url:string
    method:Method[]
    query:Rules|null
    body:Rules|null
}