<template>
  <div class="p-category-manage">
    <div class="control-bar">
      <el-button type="success" plain @click="addCategory(null)">新增</el-button>
    </div>
    <el-table :data="dataList" row-key="id">
      <el-table-column prop="id" label="ID"/>
      <el-table-column show-overflow-tooltip="" prop="name" label="分类名称"/>
      <el-table-column align="center" label="操作" fixed="right">
        <template #default="{row}">
          <el-button type="success" link @click="addCategory(row.id)">新增</el-button>
          <el-button type="primary" link @click="editCategory(row)">编辑</el-button>
          <el-popconfirm :title="`确认删除分类${row.name}?`" @confirm="deleteCategory(row)">
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
import {onMounted,ref} from "vue";
import {Category} from '@/types'
import {useCategoryStore} from '@/store'
import {ElMessage, ElMessageBox} from "element-plus";
import {request} from "@/utils";
const dataList=ref<Category[]>([])
const categoryStore=useCategoryStore()
const addCategory=(pId)=>{
  ElMessageBox.prompt('请输入分类名',{
    inputPlaceholder:'分类名'
  }).then((input)=>{
    if(input.value && input.action==='confirm'){
      request.post('/category/add',{name:input.value,pId}).then(res=>{
        if(res.code===200){
          ElMessage.success('添加成功')
          getCategoryList()
        }
      })
    }
  })
}
const editCategory=(row)=>{
  ElMessageBox.prompt('请输入分类名',{
    inputPlaceholder:'分类名',
    inputValue:row.name
  }).then((input)=>{
    if(input.value && input.action==='confirm'){
      request.post('/category/update',{name:input.value},{params:{id:row.id}}).then(res=>{
        if(res.code===200){
          ElMessage.success('编辑成功')
          getCategoryList()
        }
      })
    }
  })
}
const deleteCategory=(row)=>{
  request.delete('/category/delete',{id:row.id}).then(res=>{
    if(res.code===200){
      ElMessage.success('删除成功')
      getCategoryList()
    }
  })
}
const getCategoryList=async ()=>{
  const {data,code} = await categoryStore.getCategoryTree({pId:null})
  if(code!==200) return
  dataList.value=data
}
onMounted(()=>{
  getCategoryList()
})
</script>

<style lang="scss">
.p-category-manage{
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