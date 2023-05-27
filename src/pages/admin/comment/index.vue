<template>
  <div class="p-comment-manage">
    <el-table :data="dataList" row-key="id">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="content" label="评论内容"/>
      <el-table-column label="关联文章">
        <template #default="{row}">
          <el-link :underline="false" :href="`/article/${row.articleId}`">查看</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template #default="{row}">
          <el-button type="primary" link @click="editComment(row)">编辑</el-button>
          <el-popconfirm :title="`确认删除评论${row.name}?`" @confirm="deleteComment(row)">
            <template #reference>
              <el-button type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #append>
        <CPagination ref="pagination" :page-size="10" @change="getCommentList"/>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {vPermission} from "@/directives/permission";
import CPagination from "@/components/pagination/index.vue";
import {onMounted,ref} from "vue";
import {Comment} from '@/types'
import {useCommentStore} from '@/store'
import {ElMessage, ElMessageBox} from "element-plus";
import {request} from "@/utils";
const dataList=ref<Comment[]>([])
const commentStore=useCommentStore()
const pagination=ref()
const editComment=async (row:Partial<Comment>)=>{

  ElMessageBox.prompt('请输入评论内容',{
    inputPlaceholder:'评论内容',
    inputValue:row.content
  }).then((input)=>{
    if(input.value && input.action==='confirm'){
      request.post('/comment/update',{content:input.value},{params:{id:row.id}}).then(res=>{
        if(res.code===200){
          ElMessage.success('编辑成功')
          getCommentList()
        }
      })
    }
  })
}
const deleteComment=(row)=>{
  request.delete('/comment/delete',{id:row.id}).then(res=>{
    if(res.code===200){
      ElMessage.success('删除成功')
      getCommentList()
    }
  })
}
const getCommentList=async (pageNum?:number,pageSize?:number)=>{
  const {data,code} = await commentStore.getCommentList({pageNum,pageSize})
  if(code!==200) return
  const {list,total}=data
  pagination.value.setTotal(total)
  dataList.value=list
}
onMounted(()=>{
  getCommentList()
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