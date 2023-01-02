import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {Menu} from "@/types";

const defineRouter = (routes) => createRouter({
    history: createWebHistory(),
    routes
})
export const constantRouters = [
    {
        path: '/login',
        name: '登录',
        component: () => import('@/pages/login.vue'),
    }
]

const files = import.meta.glob('@/pages/**/*.vue')
export function menusToRoutes(menus: Menu[],pid:number|null=null): RouteRecordRaw[] {
    const routes:RouteRecordRaw[]=[];
    menus.filter((menu)=>menu.pId===pid)
        .forEach(({path,component,id,...meta}) => {
        const realPath = `/src/${component}.vue`
        if (files[realPath]) {
            routes.push({
                path,
                meta:{
                    id,
                    ...meta,
                },
                component: files[realPath],
                children:menusToRoutes(menus.filter(menu=>menu.id!==pid),id)
            })
        }
    })
    routes.push({
        path: '/:catchAll(.*)*',
        name: '页面不存在',
        component: () => import('@/pages/404.vue')
    })
    return routes
}

let router = defineRouter([...constantRouters])

export function resetRouter(routes = constantRouters) {
    router = defineRouter(routes)
}

export default router