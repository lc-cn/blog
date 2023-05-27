<template>
  <div class="p-link-manage">
    <div class="control-bar">
      <el-button type="success" plain @click="toModify({},'add')">新增</el-button>
    </div>
    <el-table :data="dataList">
      <el-table-column prop="id" label="ID"/>
      <el-table-column show-overflow-tooltip="" prop="icon" label="图标"/>
      <el-table-column show-overflow-tooltip="" prop="name" label="名称"/>
      <el-table-column show-overflow-tooltip="" prop="desc" label="描述"/>
      <el-table-column show-overflow-tooltip="" prop="url" label="地址"/>
      <el-table-column align="center" label="操作" fixed="right">
        <template #default="{row}">
          <el-button type="primary" link v-permission="{type:'menu',value:'/admin/link/modify'}" @click="toModify(row,'edit')">编辑</el-button>
          <el-popconfirm :title="`确认删除用户${row.name}?`" @confirm="deleteLink(row)">
            <template #reference>
              <el-button type="danger" link v-permission="'link/delete'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #append>
        <CPagination ref="paginationDom" @change="getLinkList"/>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted,ref} from "vue";
import {vPermission} from "@/directives/permission";
import {Link} from '@/types'
import {useLinkStore} from '@/store'
import CPagination from '@/components/pagination/index.vue'
import router from "@/router";
import {ElMessage} from "element-plus";
import {request} from "@/utils";
const paginationDom=ref()
const dataList=ref<Link[]>([])
const linkStore=useLinkStore()
const toModify=(row,type)=>{
  router.push({
    path: '/admin/link/modify',
    query: {
      id: row.id,
      type
    }
  })
}
const deleteLink=(row)=>{
  request.delete('/link/delete',{id:row.id}).then(res=>{
    if(res.code===200){
      ElMessage.success('删除成功')
      getLinkList()
    }
  })
}
const getLinkList=async (pageNum?:number,pageSize?:number)=>{
  const {data,code} = await linkStore.getLinkList({pageNum, pageSize})
  if(code!==200) return
  const {list=[],total=0}=data||{}
  dataList.value=list
  paginationDom.value?.setTotal(total)
}
onMounted(()=>{
  getLinkList()
})
</script>

<style lang="scss">
.p-link-manage{
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