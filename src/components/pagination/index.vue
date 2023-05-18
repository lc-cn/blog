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

<script lang="ts" setup>
import {usePagination} from "./composition";
const props=withDefaults(defineProps<{
  total?:number
  pageSize?:number
  pageNum?:number
}>(),{
  total:0,
  pageSize:20,
  pageNum:1
})
const emit=defineEmits<{
  (e:'change', pageNum:number, pageSize:number):void
}>()
const {pagination,setPageSize,setPageNum,setTotal} = usePagination({
  total:props.total,
  pageSize:props.pageSize,
  pageNum:props.pageNum,
  onPageChange:(pageNum)=>{
    emit('change',pageNum,pagination.value.pageSize)
  }
})
defineExpose({
  setTotal,
  setPageNum,
  setPageSize
})
</script>

<style scoped>

</style>