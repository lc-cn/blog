<template>
  <div class="p-menu-manage">
    <div class="control-bar">
      <el-button type="success" plain @click="toModify({},'add')">新增</el-button>
    </div>
    <el-table :data="dataList" row-key="id">
      <el-table-column prop="id" label="ID"/>
      <el-table-column show-overflow-tooltip="" prop="name" label="菜单名称"/>
      <el-table-column show-overflow-tooltip="" prop="path" label="访问路径"/>
      <el-table-column show-overflow-tooltip="" prop="component" label="组件路径"/>
      <el-table-column show-overflow-tooltip="" prop="type" label="类型">
        <template #default="{row}">
          {{row.type===1?'目录':row.type===2?'菜单':'按钮'}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template #default="{row}">
          <el-button type="success" v-permission="{type:'menu',value:'/admin/menu/auth'}" @click="toAuth(row)" link>配置</el-button>
          <el-button type="success" link @click="toModify({pId:row.id},'add')">新增</el-button>
          <el-button type="primary" link @click="toModify(row,'edit')">编辑</el-button>
          <el-popconfirm :title="`确认删除菜单${row.name}?`" @confirm="deleteMenu(row)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {vPermission} from "@/directives/permission";
import {onMounted,ref} from "vue";
import {Menu, Role} from '@/types'
import {useMenuStore} from '@/store'
import router from "@/router";
import {ElMessage} from "element-plus";
import {request} from "@/utils";
const dataList=ref<Menu[]>([])
const menuStore=useMenuStore()
const toModify=async (row:Partial<Menu>,type)=>{
  await router.push({
    path: '/admin/menu/modify',
    query: {
      id: row?.id,
      pId:row.pId,
      type
    }
  })
}
const toAuth=async (row:Role)=>{
  await router.push({
    path: '/admin/menu/auth',
    query: {
      id: row.id,
    }
  })
}
const deleteMenu=(row)=>{
  request.delete('/menu/delete',{id:row.id}).then(res=>{
    if(res.code===200){
      ElMessage.success('删除成功')
      getMenuList()
    }
  })
}
const getMenuList=async ()=>{
  const {data,code} = await menuStore.getMenuTree({pId:null})
  if(code!==200) return
  dataList.value=data
}
onMounted(()=>{
  getMenuList()
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