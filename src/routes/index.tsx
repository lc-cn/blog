import {lazy, Suspense, ComponentType} from "react";
import {createBrowserRouter,RouteObject} from "react-router-dom";
import Loading from '@/components/Loading'
function generatePathConfig():Record<string, any>{
    const modules=import.meta.glob('/src/pages/**/*.tsx');
    const pathConfigObj:Record<string, any>={}
    Object.keys(modules).forEach(filePath=>{
        const [routePath,...otherPath] = filePath
            // 去除 src/pages 不相关的字符
            .replace('/src/pages/', '')
            // 去除文件名后缀
            .replace(/\.tsx/, '')
            // 转换动态路由 $[foo].tsx => :foo
            .replace(/\$\[([\w-]+)]/, ':$1')
            // 转换以 $ 开头的文件
            .replace(/\$([\w-]+)/, '$1')
            // 以目录分隔
            .split('/');
        const createObj:(paths:string[],obj:Record<string, any>)=>Record<string, any>=(pathDirs:string[],obj)=>{
            if(!pathDirs.length) return obj
            const path=pathDirs.shift()
            return {[path]:createObj(pathDirs,obj)}
        }
        if(otherPath.length){
            pathConfigObj[routePath]={
                ...(pathConfigObj[routePath]||{}),
                ...createObj(otherPath,modules[filePath])
            }
        }else{
            pathConfigObj[routePath]=modules[filePath]
        }
    })
    return pathConfigObj
}
function wrapSuspense(importer:()=>Promise<{default:ComponentType}>){
    if(!importer) return undefined
    if(typeof importer==='object' && importer && importer['index']) return wrapSuspense(importer['index'])
    const Component=lazy(importer)
    return <Suspense fallback={<Loading/>}>
        <Component/>
    </Suspense>
}
function mapPathConfigToRoute(cfg: Record<string, any>): RouteObject[] {
    // route 的子节点为数组
    return Object.entries(cfg).map(([routePath, child]) => {
        if (typeof child === 'function') {
            const isIndex = routePath === 'index';
            return {
                index: isIndex,
                path: isIndex ? undefined : routePath,
                // 转换为组件
                element: wrapSuspense(child),
            };
        }
        // 否则为目录，则查找下一层级
        const { $, ...rest } = child;
        return {
            path: routePath,
            // layout 处理
            element: wrapSuspense($),
            // 递归 children
            children: mapPathConfigToRoute(rest),
        };
    });
}
function generateRouteConfig(): RouteObject[] {
    const { $,...pathConfig } = generatePathConfig();
    // 提取根路由的 layout
    return [
        {
            path: '/',
            element: wrapSuspense($),
            children: mapPathConfigToRoute(pathConfig),
        }
    ].filter(Boolean)
}
export default generateRouteConfig()