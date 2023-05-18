import {defineStore} from "pinia";
import {RouteRecordRaw} from "vue-router";
import router, {menusToRoutes} from "@/router";
import {Menu, RoleInfo} from "@/types";
import {distinctList} from "@/utils";

export const usePermissionStore=defineStore('permission', {
    state(){
        return {
            routes: [],
            permissions:[],
            addRoutes: [],
        } as {
            routes:RouteRecordRaw[]
            permissions:Menu[]
            addRoutes:RouteRecordRaw[]
        }
    },
    getters: {
        routerList: (state)=>{
            state.routes
        }
    },
    actions: {
        generateRoutes(roles:RoleInfo[]) {
            return new Promise(resolve => {
                const permissions=distinctList(roles.map(role=>role.menus||[]).flat(),'id')
                this.permissions=permissions
                const routes = menusToRoutes(permissions)
                routes.push({
                    path: '/:catchAll(.*)*',
                    name: '页面不存在',
                    component: () => import('@/pages/404.vue')
                })
                this.routes=routes
                router.options.routes = router.options.routes.concat(routes);
                routes.map(route=>{
                    try {
                        router.addRoute(route)
                    } catch (e) {
                        console.log(e)
                    }
                })
                resolve(routes)
            })
        }
    }
})