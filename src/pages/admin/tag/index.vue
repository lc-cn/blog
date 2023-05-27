<template>
  <div class="p-tag-manage">
    <div class="control-bar">
      <el-button type="success" plain @click="addTag()">新增</el-button>
    </div>
    <el-table :data="dataList" row-key="id">
      <el-table-column prop="id" label="ID"/>
      <el-table-column show-overflow-tooltip="" prop="name" label="标签名称"/>
      <el-table-column align="center" label="操作" fixed="right">
        <template #default="{row}">
          <el-button type="primary" link @click="editTag(row)">编辑</el-button>
          <el-popconfirm :title="`确认删除标签${row.name}?`" @confirm="deleteTag(row)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #append>
        <CPagination ref="paginationDom" @change="getTagList"/>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {vPermission} from "@/directives/permission";
import CPagination from "@/components/pagination/index.vue";
import {onMounted,ref} from "vue";
import {Tag} from '@/types'
import {useTagStore} from '@/store'
import {ElMessage, ElMessageBox} from "element-plus";
import {request} from "@/utils";
const dataList=ref<Tag[]>([])
const tagStore=useTagStore()
const paginationDom=ref()
const addTag=()=>{
  ElMessageBox.prompt('请输入文章名',{
    inputPlaceholder:'文章名'
  }).then((input)=>{
    if(input.value && input.action==='confirm'){
      request.post('/tag/add',{name:input.value}).then(res=>{
        if(res.code===200){
          ElMessage.success('添加成功')
          getTagList()
        }
      })
    }
  })
}
const editTag=(row)=>{
  ElMessageBox.prompt('请输入文章名',{
    inputPlaceholder:'文章名',
    inputValue:row.name
  }).then((input)=>{
    if(input.value && input.action==='confirm'){
      request.post('/tag/update',{name:input.value},{params:{id:row.id}}).then(res=>{
        if(res.code===200){
          ElMessage.success('编辑成功')
          getTagList()
        }
      })
    }
  })
}
const deleteTag=(row)=>{
  request.delete('/tag/delete',{id:row.id}).then(res=>{
    if(res.code===200){
      ElMessage.success('删除成功')
      getTagList()
    }
  })
}
const getTagList=async (pageNum=1,pageSize=10)=>{
  const {data,code} = await tagStore.getTagList({pageSize,pageNum})
  if(code!==200) return
  const {total,list}=data
  paginationDom.value.setTotal(total)
  console.log(list)
  dataList.value=list
}
onMounted(()=>{
  getTagList()
})
</script>

<style lang="scss">
.p-tag-manage{
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