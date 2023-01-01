import {Outlet} from "react-router-dom";
import {Layout} from "antd";
import {AuthProvider} from "@/permission";
export default ()=>{
    return (
        <AuthProvider>
            <Layout className='default-layout'>
                <Outlet></Outlet>
            </Layout>
        </AuthProvider>
    )
}