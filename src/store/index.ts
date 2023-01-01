import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook,useDispatch,useSelector} from "react-redux";
import userSlice from "@/store/userSlice";
const store=configureStore({
    reducer:{
        user:userSlice
    }
})
export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch;
export const useAppDispatch=()=>useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store