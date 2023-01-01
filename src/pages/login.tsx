import AuthConsumer from "@/permission";
import {useState} from "react";
import {Button, Form, Input} from "antd";

const Login=()=>{
    const [form]=Form.useForm()
    const {Item} = Form
    const {logout,login}=AuthConsumer()
    const validateMessages = {
        required: '请输入${label}!',
        types: {
            email: '${label}不是有效的邮箱地址!',
            number: '${label}不是数值!',
        },
        number: {
            range: '${label}必须在${min}到${max}之间',
        },
    };
    const [loginParam,setLoginParam]=useState({
        username:'',
        password:''
    })
    return (
        <div>
            <Form form={form}
                  onFinish={(values)=>login(values.username,values.password)}
                  labelCol={{span:8}}
                  validateMessages={validateMessages}
                  wrapperCol={{span:16}}
            >
                <Item name='username' label='用户名' rules={[{required:true}]}>
                    <Input placeholder='请输入用户名'/>
                </Item>
                <Item name='password' label='密码' rules={[{required:true}]}>
                    <Input type='password' placeholder='请输入密码'/>
                </Item>
                <Item>
                    <Button type={"primary"} htmlType={"submit"}>提交</Button>
                </Item>
            </Form>
        </div>
    )
}
export default Login