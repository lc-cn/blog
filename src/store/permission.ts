import {defineStore} from "pinia";
import {RouteRecordRaw} from "vue-router";
import router, {menusToRoutes} from "@/router";
import {RoleInfo} from "@/types";
import {distinctList} from "@/utils";

export const usePermissionStore=defineStore('permission', {
    state(){
        return {
            routes: [],
            addRoutes: [],
        } as {
            routes:RouteRecordRaw[]
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
                const routes = menusToRoutes(distinctList(roles.map(role=>role.menus).flat(),'id'))
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