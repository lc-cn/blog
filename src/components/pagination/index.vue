<template>
  <el-pagination
      :page-size="pagination.pageSize"
      :current-page="pagination.pageNum"
      :total="pagination.total"
      hide-on-single-page
      @size-change="setPageSize"
      @current-change="setPageNum"
      layout="prev,pager,next"
  ></el-pagination>
</template>

<script>
import {usePagination} from "./composition";

export default {
  emits:['change'],
  setup(_,{emit,expose}){
    const {pagination,setPageSize,setPageNum,setTotal} = usePagination({
      onPageChange:(pageNum)=>{
        emit('change',pageNum,pagination.pageSize)
      }
    })
    expose({pagination,setPageNum,setPageSize,setTotal})
    return {
      pagination,
      setPageNum,
      setPageSize,
      setTotal
    }
  }
}
</script>

<style scoped>

</style>