<template>
  <div class="p-article-manage">
    <div class="control-bar">
      <el-button type="success" plain @click="addArticle()">新增</el-button>
    </div>
    <el-table :data="dataList" row-key="id">
      <el-table-column prop="id" label="ID"/>
      <el-table-column show-overflow-tooltip="" prop="name" label="标签名称"/>
      <el-table-column align="center" label="操作" fixed="right">
        <template #default="{row}">
          <el-button type="primary" link @click="editArticle(row)">编辑</el-button>
          <el-popconfirm :title="`确认删除标签${row.name}?`" @confirm="deleteArticle(row)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #append>
        <CPagination ref="paginationDom" @change="getArticleList"/>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {vPermission} from "@/directives/permission";
import CPagination from "@/components/pagination/index.vue";
import {onMounted,ref} from "vue";
import {Article} from '@/types'
import {useArticleStore} from '@/store'
import {ElMessage, ElMessageBox} from "element-plus";
import {request} from "@/utils";
const dataList=ref<Article[]>([])
const articleStore=useArticleStore()
const paginationDom=ref()
const addArticle=()=>{
  ElMessageBox.prompt('请输入标签名',{
    inputPlaceholder:'标签名'
  }).then((input)=>{
    if(input.value && input.action==='confirm'){
      request.post('/article/add',{title:input.value}).then(res=>{
        if(res.code===200){
          ElMessage.success('添加成功')
          getArticleList()
        }
      })
    }
  })
}
const editArticle=(row)=>{
  ElMessageBox.prompt('请输入标签名',{
    inputPlaceholder:'标签名',
    inputValue:row.name
  }).then((input)=>{
    if(input.value && input.action==='confirm'){
      request.post('/article/update',{title:input.value},{params:{id:row.id}}).then(res=>{
        if(res.code===200){
          ElMessage.success('编辑成功')
          getArticleList()
        }
      })
    }
  })
}
const deleteArticle=(row)=>{
  request.delete('/article/delete',{id:row.id}).then(res=>{
    if(res.code===200){
      ElMessage.success('删除成功')
      getArticleList()
    }
  })
}
const getArticleList=async (pageNum=1,pageSize=10)=>{
  const {data,code} = await articleStore.getArticleList({pageSize,pageNum})
  if(code!==200) return
  const {total,list}=data
  paginationDom.value.setTotal(total)
  console.log(list)
  dataList.value=list
}
onMounted(()=>{
  getArticleList()
})
</script>

<style lang="scss">
.p-article-manage{
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