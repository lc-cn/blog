<template>
  <div class="p-user-manage">
    <div class="control-bar">
      <el-button type="success" plain @click="toModify({},'add')">新增</el-button>
    </div>
    <el-table :data="dataList">
      <el-table-column prop="id" label="ID"/>
      <el-table-column show-overflow-tooltip="" prop="username" label="用户名"/>
      <el-table-column show-overflow-tooltip="" prop="nickname" label="昵称"/>
      <el-table-column show-overflow-tooltip="" prop="age" label="年龄"/>
      <el-table-column show-overflow-tooltip="" prop="email" label="邮箱"/>
      <el-table-column align="center" label="操作" fixed="right">
        <template #default="{row}">
          <el-button type="success" link v-permission="{type:'menu',value:'/admin/user/config'}" @click="toConfig(row)">配置</el-button>
          <el-button type="primary" link v-permission="{type:'menu',value:'/admin/user/modify'}" @click="toModify(row,'edit')">编辑</el-button>
          <el-popconfirm :title="`确认删除用户${row.name}?`" @confirm="deleteUser(row)">
            <template #reference>
              <el-button type="danger" link v-permission="'user/delete'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #append>
        <CPagination ref="paginationDom" @change="getUserList"/>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted,ref} from "vue";
import {vPermission} from "@/directives/permission";
import {User} from '@/types'
import {useUserStore} from '@/store'
import CPagination from '@/components/pagination/index.vue'
import router from "@/router";
import {ElMessage} from "element-plus";
import {request} from "@/utils";
const paginationDom=ref()
const dataList=ref<User[]>([])
const userStore=useUserStore()
const toConfig=async (row:User)=>{
  await router.push({
    path: '/admin/user/config',
    query: {
      id: row.id,
    }
  })
}
const toModify=(row,type)=>{
  router.push({
    path: '/admin/user/modify',
    query: {
      id: row.id,
      type
    }
  })
}
const deleteUser=(row)=>{
  request.delete('/user/delete',{id:row.id}).then(res=>{
    if(res.code===200){
      ElMessage.success('删除成功')
      getUserList()
    }
  })
}
const getUserList=async (pageNum?:number,pageSize?:number)=>{
  const {list,total} = await userStore.getList(pageNum,pageSize)
  dataList.value=list
  paginationDom.value?.setTotal(total)
}
onMounted(()=>{
  getUserList()
})
</script>

<style lang="scss">
.p-user-manage{
  display: flex;
  flex-direction: column;
  height: 100%;
  &>.el-table{
    flex:1;
    .cell{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
      .el-button{
        margin-left: 0;
      }
    }
  }
}
</style>