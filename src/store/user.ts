import {defineStore} from "pinia";
import {getToken, removeToken, setToken} from "@/utils/auth";
import router, {resetRouter} from "@/router";
import config from '@/config'
import {usePermissionStore} from "@/store/permission";
import {ElMessage} from "element-plus";
import {request} from "@/utils";
import {LoginParam, Role, User, UserInfo} from "@/types";
export const useUserStore =defineStore('user', {
    state(){
        return {
            token: getToken(config.tokenKey),
            info:undefined,
            users:{
                list:[],
                pageNum:1,
                total:0
            },
            roles: [],
        } as {
            token:string,
            info?:User,
            users:{
                list:User[],
                pageNum:number
                total:number
            }
            roles:Role[]
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
        getUserInfo({id}:Pick<User, 'id'>){
          return new Promise<UserInfo&{roles:Role[]}>((resolve)=>{
              request.get('/user/info',{id}).then(res=>{
                  if(res.code===200){
                      resolve(res.data)
                  }
              })
          })
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
            localStorage.removeItem(config.tokenKey+':menus')
            localStorage.removeItem(config.tokenKey+':configList')
            localStorage.removeItem(config.tokenKey+':categories')
            this.token=''
            this.roles=[]
            removeToken(config.tokenKey)
            resetRouter()
        },
        // user logout
        logout() {
            return new Promise<void>((resolve) => {
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
        async getList(pageNum=1,pageSize=10,force?:boolean){
            if(!force && this.users.list.length){
                return Promise.resolve(this.users)
            }
            const res=await request.get('/user/list',{pageNum,pageSize})
            if(res.code===200){
                this.users={
                    list:res.data.list,
                    pageNum:res.data.pageNum,
                    total:res.data.total
                }
                localStorage.setItem(config.tokenKey+':users',JSON.stringify(res.data))
            }
            return this.users
        },
        async addUser(params:Partial<Omit<User, 'id'>>){
            return request.post('/user/add',params)
        },
        async updateUser({id,...params}:Partial<User>){
            return request.post('/user/update',params,{params:{id}})
        },
    }
})