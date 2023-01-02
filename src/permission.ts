import router from './router'
import config from '@/config'
import {usePermissionStore,useUserStore} from './store'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'


NProgress.configure({ showSpinner: false })


const whiteList = [
    '/',
    /\/(category|tag|article)\/(\d+)/,
    '/about',
    '/link',
    '/login',
    '/register',
]
const isWhiteRoute=(routePath:string)=>{
    return whiteList.some((whitePath)=>{
        if(typeof whitePath==='string') return whitePath===routePath
        return whitePath.test(routePath)
    })
}
router.beforeEach(async (to, from, next) => {
    const userStore=useUserStore()
    const permissionStore=usePermissionStore()
    NProgress.start()
    const hasToken = getToken(config.tokenKey)
    const generateRoutes=async ()=>{
        const hasRoles = userStore.roles && userStore.roles.length > 0;
        if (hasRoles) {
            next()
        } else {
            try {
                await userStore.getInfo()
                await permissionStore.generateRoutes(userStore.roles);
                next({ ...to, replace: true })
            } catch (error:any) {
                ElMessage.error({message:error.message || 'Has Error'})
                NProgress.done()
            }
        }
    }
    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            await generateRoutes()
        }
    } else {
        if (isWhiteRoute(to.path)) {
            await generateRoutes()
        } else {
            next(`/login?redirect=${to.path}`);
        }
        NProgress.done();
    }
})

router.afterEach(() => {
    NProgress.done()
})
