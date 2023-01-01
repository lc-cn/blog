import React, {useState, createContext, useContext} from "react";
import {login, logout} from "@/store/userSlice";
import {Navigate} from 'react-router';
import {useAppSelector,useAppDispatch} from "@/store";

const AuthContext = createContext({
    authed: false,
    login(username:string,password:string) {
    },
    logout() {
    }
});

/**
 * 自定义hook，函数返回 Context 值，包括 authed状态、login、logout函数来修改authed状态
 */
function useAuth({isLogin,login,logout}) {
    const [authed, setAuthed] = useState(isLogin);
    return {
        authed,
        login(username:string,password:string) {
            return login(username,password).then(res=>{
                console.log(res)
                setAuthed(true)
            })
        },
        logout() {
            return logout().then(res=>{
                setAuthed(false)
            })
        }
    };
}

// 将context值传递给了Context Provider，并返回该组件用于广播context值
export function AuthProvider({children}) {
    const dispatch=useAppDispatch()
    const auth = useAuth({
        isLogin:useAppSelector(state=>state.user).isLogin,
        login:(username:string,password)=>{
            return dispatch(login({name:username,password}))
        },
        logout:()=>{
            return dispatch(logout())
        }
    });

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// 返回 Context 值
export default function AuthConsumer() {
    return useContext(AuthContext);
}

/**
 * @description
 * 封装拦截组件,如果已登录，返回包括的children组件；
 * 未登录，返回 <Navigate to="/user" /> 组件跳转到登录页面。
 *
 * @example
 * <RequireAuth>
 *   <ComponentNeedAuth />
 * </RequireAuth>
 */
export function RequireAuth({children}) {
    const {authed} = AuthConsumer();

    return authed === true ? (
        children
    ) : (
        <Navigate to="/login" replace/>
    );
}
