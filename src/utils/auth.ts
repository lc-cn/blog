import Cookies from "js-cookie";

export const getToken=(key:string)=>{
    return Cookies.get(key)
}
export const removeToken=(key:string)=>{
    return Cookies.remove(key)
}
export const setToken=(key:string,token:string)=>{
    return Cookies.set(key, token)
}