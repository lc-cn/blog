<template>
  <div class="p-role-manage">
    <div class="control-bar">
      <el-button type="success" plain @click="addRole">新增</el-button>
    </div>
    <el-table :data="dataList">
      <el-table-column prop="id" label="ID"/>
      <el-table-column show-overflow-tooltip="" prop="name" label="角色名称"/>
      <el-table-column align="center" label="操作" fixed="right">
        <template #default="{row}">
          <el-button type="success" v-permission="{type:'menu',value:'/admin/role/config'}" @click="toConfig(row)" link>配置</el-button>
          <el-button type="primary" link @click="editRole(row)">编辑</el-button>
          <el-popconfirm :title="`确认删除角色${row.name}?`" @confirm="deleteRole(row)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #append>
        <CPagination ref="paginationDom" @change="getRoleList"/>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {vPermission} from "@/directives/permission";
import {onMounted,ref} from "vue";
import {Role} from '@/types'
import {useRoleStore} from '@/store'
import CPagination from '@/components/pagination/index.vue'
import router from "@/router";
import {ElMessage, ElMessageBox} from "element-plus";
import {request} from "@/utils";
const paginationDom=ref()
const dataList=ref<Role[]>([])
const roleStore=useRoleStore()
const toConfig=async (row:Role)=>{
  await router.push({
    path: '/admin/role/config',
    query: {
      id: row.id,
    }
  })
}
const addRole=()=>{
  ElMessageBox.prompt('请输入角色名',{
    inputPlaceholder:'角色名'
  }).then((input)=>{
    if(input.value && input.action==='confirm'){
      request.post('/role/add',{name:input.value}).then(res=>{
        if(res.code===200){
          ElMessage.success('添加成功')
          getRoleList()
        }
      })
    }
  })
}
const editRole=(row)=>{
  ElMessageBox.prompt('请输入角色名',{
    inputPlaceholder:'角色名',
    inputValue:row.name
  }).then((input)=>{
    if(input.value && input.action==='confirm'){
      request.post('/role/update',{name:input.value},{params:{id:row.id}}).then(res=>{
        if(res.code===200){
          ElMessage.success('编辑成功')
          getRoleList()
        }
      })
    }
  })
}
const deleteRole=(row)=>{
  request.delete('/role/delete',{id:row.id}).then(res=>{
    if(res.code===200){
      ElMessage.success('删除成功')
      getRoleList()
    }
  })
}
const getRoleList=async (pageNum?:number,pageSize?:number)=>{
  const {list,total} = await roleStore.getRoleList({pageNum,pageSize})
  dataList.value=list
  paginationDom.value?.setTotal(total)
}
onMounted(()=>{
  getRoleList()
})
</script>

<style lang="scss">
.p-role-manage{
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