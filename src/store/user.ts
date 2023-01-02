import {defineStore} from "pinia";
import {getToken, removeToken, setToken} from "@/utils/auth";
import router, {resetRouter} from "@/router";
import config from '@/config'
import {usePermissionStore} from "@/store/permission";
import {ElMessage} from "element-plus";
import {request} from "@/utils";
import {LoginParam, RoleInfo, User, UserInfo} from "@/types";
import {useSystemStore} from "@/store/system";
export const useUserStore =defineStore('user', {
    state(){
        return {
            token: getToken(config.tokenKey),
            info:undefined,
            roles: [],
        } as {
            token:string,
            info?:User,
            roles:RoleInfo[]
        }
    },
    actions: {
        login(loginParam:LoginParam) {
            return new Promise<boolean>((resolve, reject) => {
                request.post('/user/login',loginParam).then(async res => {
                        if (res && res.code===200) {
                            this.token=res.data
                            setToken(config.tokenKey,res.data)
                            await this.getInfo(true)
                            resolve(true)
                        } else {
                            ElMessage.error(res.message)
                            reject(false)
                        }
                    }
                ).catch(err => {
                    reject(err)
                })
            })
        },
        async setInfo({roles,...data}:UserInfo){
            this.info=data
            this.roles=roles
            localStorage.setItem(config.tokenKey+':userInfo', JSON.stringify(data))
            localStorage.setItem(config.tokenKey+':roles', JSON.stringify(roles))
            const permissionStore=usePermissionStore()
            await permissionStore.generateRoutes(roles)

        },
        // get user info
        getInfo(force?:boolean) {
            const info=JSON.parse(localStorage.getItem(config.tokenKey+':userInfo')||'null')
            const roles= JSON.parse(localStorage.getItem(config.tokenKey+':roles')||'[]')
            if (!force && roles && roles.length && info) {
                this.roles=roles
                this.info=info
                return true
            }
            return new Promise((resolve, reject) => {
                request.get('/user/info').then(async (res)=>{
                    if (res && res.code == 200) {
                        await this.setInfo(res.data)
                        resolve(true)
                    } else {
                        this.cleanInfo()
                        resolve(false)
                    }
                }).catch(err=>{
                    this.cleanInfo()
                    reject(err)
                })
            })
        },
        cleanInfo(){
            localStorage.removeItem(config.tokenKey+':userInfo')
            localStorage.removeItem(config.tokenKey+':roles')
            localStorage.removeItem(config.tokenKey+':configList')
            localStorage.removeItem(config.tokenKey+':categories')
            this.token=''
            this.roles=[]
            removeToken(config.tokenKey)
            resetRouter()
        },
        // user logout
        logout() {
            return new Promise<void>((resolve, reject) => {
                this.cleanInfo()
                const path=router.currentRoute.value.path
                router.push({
                    path: '/login',
                    query: {
                        redirect: path
                    }
                })
                resolve()
            })
        },
        resetToken() {
            return new Promise<void>(resolve => {
                this.roles=[]
                removeToken(config.tokenKey)
                resolve()
            })
        },

    }
})