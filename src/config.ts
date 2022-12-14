import {GlobalConfig} from "@/types";

declare global {
    var runtimeConfig:Partial<GlobalConfig>
}
const config:GlobalConfig={
    tokenKey: "LC-BLOG",
    baseURL:'/api',
}
if(window.runtimeConfig){
    Object.assign(config,window.runtimeConfig)
}
export default config