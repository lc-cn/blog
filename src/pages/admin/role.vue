<template>
  <div class="p-role-manage">
    <div class="control-bar">
      <el-button type="success" plain>新增</el-button>
    </div>
    <el-table :data="dataList">
      <el-table-column prop="id" label="角色ID"/>
      <el-table-column prop="name" label="角色名称"/>
      <el-table-column type="action" label="操作" width="220" fixed="right">
        <template #default="{row}">
          <el-button type="success" @click="getRoleInfo(row)" link>绑定用户/菜单</el-button>
          <el-button type="primary" link>编辑</el-button>
          <el-button type="danger" link>删除</el-button>
        </template>
      </el-table-column>
      <template #append>
        <cPagination ref="paginationDom" @change="getRoleList"/>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted,ref} from "vue";
import {Role} from '@/types'
import {useRoleStore} from '@/store'
import cPagination from '@/components/pagination/index.vue'
const paginationDom=ref()
const dataList=ref<Role[]>([])
const roleStore=useRoleStore()
const getRoleInfo=async (row:Role)=>{
  const roleInfo=await roleStore.getRoleInfo({id:row.id})
  console.log(roleInfo)
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
  }
}
</style>