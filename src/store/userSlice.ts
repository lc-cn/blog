import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import globalConfig from '@/config'
import {removeToken, request, setToken} from "@/utils";
import {UserInfo,LoginParam} from "@/types";

export interface UserState {
    isLogin: boolean
    userInfo?: UserInfo
}

const initialState: UserState = {
    isLogin: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<LoginParam>) {
            request.post('/user/login', action.payload).then((res) => {
                if (res.code === 200) {
                    state.isLogin = true
                    setToken(globalConfig.tokenKey,res.data)
                    this.getUserInfo(state)
                }
            })
        },
        getUserInfo(state){
            request.post('/user/info').then((res)=>{
                if(res.code===200){
                    state.userInfo=res.data
                }
            })
        },
        logout(state){
            request.post('/user/logout').then((res)=>{
                if(res.code===200){
                    state.isLogin=false
                    removeToken(globalConfig.tokenKey)
                    state.userInfo=undefined
                }
            })
        }
    }
})

// Action creators are generated for each case reducer function
const {login,logout} = userSlice.actions
export {login,logout}
export default userSlice.reducer