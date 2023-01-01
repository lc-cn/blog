import {Layout} from "antd";
import {Outlet} from "react-router-dom";
import {RequireAuth} from "@/permission";

const {Sider,Header,Content,Footer} = Layout
export default ()=>{
    return (
        <Layout className="manage-layout">
            <Sider>sidebar</Sider>
            <Layout>
                <Header>header</Header>
                <Content>
                    <RequireAuth>{<Outlet></Outlet>}</RequireAuth>
                </Content>
                <Footer>footer</Footer>
            </Layout>
        </Layout>
    )
}