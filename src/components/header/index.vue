<template>
  <div class="c-header">
    <span>{{ systemStore.config.name || '凉菜博客' }}</span>
    <el-dropdown @command="handleCommand">
      {{ userStore.info.nickname }}
      <el-avatar :size="50" :src="userStore.info.avatar"/>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="info">我的资料</el-dropdown-item>
          <el-dropdown-item command="password">修改密码</el-dropdown-item>
          <el-dropdown-item command="admin">后台管理</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import {useSystemStore, useUserStore} from "@/store";
import router from "@/router";
const name = 'Header'

const systemStore = useSystemStore()
const userStore = useUserStore()
const handleCommand=(command:string)=>{
  switch (command){
    case 'logout':
      return userStore.logout()
    case 'admin':
      return router.push('/admin')
  }
}
</script>

<style lang="less">
.c-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>