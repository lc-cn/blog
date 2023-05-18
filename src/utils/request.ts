import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import globalConfig from '@/config'
import {RequestMap} from "@/types";
import {ElMessage} from "element-plus";
import {getToken} from "@/utils/auth";
import {useUserStore} from "@/store";
const instance = axios.create({
    // 基础路径
    baseURL: globalConfig.baseURL,
    // 请求超时时间
    timeout: 5000,
    // ....其他配置
})

type Response<T = any> = {
    // 描述
    code: number
    // 返回的数据
    data: T
    message?:string
}
const request=(<T> (config: AxiosRequestConfig) => {
    config.headers={
        'Authorization': 'Bearer ' + getToken(globalConfig.tokenKey),
        ...(config.headers||{})
    }
    return new Promise<Response<T>>((resolve, reject) => {
        instance.request<Response<T>>(config).then((response: AxiosResponse<Response<T>>) => {
            const {data:res}=response
            if(res.code===200){
                resolve(res)
            }else{
                if(res.code===401){
                    useUserStore().logout()
                }
                ElMessage.error(res.message)
                reject()
            }
        }).catch((error :AxiosError<Response>) => {
            const {response,message}=error
            if(response && response.data){
                const {code,message:msg}=response.data
                if(code===401){
                    useUserStore().logout()
                }
                ElMessage.error(msg)
                reject(response.data)
            }else{
                ElMessage.error(message)
                reject(error)
            }
        })
    })
}) as Request
export interface Request{
    <T>(config:AxiosRequestConfig):Promise<Response<T>>
    get<U extends keyof RequestMap>(url:U,params?:Parameters<RequestMap[U]>[0],config?:AxiosRequestConfig):ReturnType<typeof request<ReturnType<RequestMap[U]>>>
    get<S extends string,R=any>(url:S & Exclude<S, keyof RequestMap>,params?:any,config?:AxiosRequestConfig):ReturnType<typeof request<R>>
    put<U extends keyof RequestMap>(url:U,data?:Parameters<RequestMap[U]>[0],config?:AxiosRequestConfig<Parameters<RequestMap[U]>[0]>):ReturnType<typeof request<ReturnType<RequestMap[U]>>>
    put<S extends string,R=any>(url:S & Exclude<S, keyof RequestMap>,data?:any,config?:AxiosRequestConfig):ReturnType<typeof request<R>>
    post<U extends keyof RequestMap>(url:U,data?:Parameters<RequestMap[U]>[0],config?:AxiosRequestConfig<Parameters<RequestMap[U]>[0]>):ReturnType<typeof request<ReturnType<RequestMap[U]>>>
    post<S extends string,R=any>(url:S & Exclude<S, keyof RequestMap>,data?:any,config?:AxiosRequestConfig):ReturnType<typeof request<R>>
    delete<U extends keyof RequestMap>(url:U,params?:Parameters<RequestMap[U]>[0],config?:AxiosRequestConfig):ReturnType<typeof request<ReturnType<RequestMap[U]>>>
    delete<S extends string,R=any>(url:S & Exclude<S, keyof RequestMap>,params?:any,config?:AxiosRequestConfig):ReturnType<typeof request<R>>
}
request.get=(url,params,config)=>request({url,method:'GET',params,...(config||{})}) as any
request.post=(url,data,config)=>request({url,method:'POST',data,...(config||{})}) as any
request.put=(url,data,config)=>request({url,method:'PUT',data,...(config||{})}) as any
request.delete=(url,params,config)=>request({url,method:'DELETE',params,...(config||{})}) as any
export default request
