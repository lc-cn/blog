<template>
  <div class="p-login">
    <el-form
        :model="loginForm"
        label-position="top"
        ref="loginRef">
      <el-form-item label="用户名" prop="username" :rules="{required:true,message:'请输入用户名'}">
        <el-input v-model="loginForm.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password" :rules="{required:true,message:'请输入密码'}">
        <el-input v-model="loginForm.password"/>
      </el-form-item>
      <el-form-item prop="remember">
        <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {LoginParam} from '@/types'
import config from '@/config'
import {useUserStore} from "@/store";
import {ElMessage} from "element-plus";
import router from "@/router";

const loginRef=ref()
const loading=ref(false)
const userStore=useUserStore()
const loginForm=ref<LoginParam & {remember:boolean}>({
  username:sessionStorage.getItem(config.tokenKey+':username')||'',
  password:sessionStorage.getItem(config.tokenKey+':password')||'',
  remember:false
})
const submit=async ()=>{
  await loginRef.value?.validate()
  loading.value=true
  const success=await userStore.login(loginForm.value).catch(()=>loading.value=false)
  if(success) ElMessage.success('登录成功')
  loading.value=false
  if(loginForm.value.remember){
    sessionStorage.setItem(config.tokenKey+':username',loginForm.value.username)
    sessionStorage.setItem(config.tokenKey+':password',loginForm.value.password)
  }
  await router.push('/')
}
</script>

<style lang="scss">
  .p-login{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-form{
      padding:20px;
      border: 1px solid rgba(222,222,222,.3);
      border-radius: 8px;
    }
  }
</style>