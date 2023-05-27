<template>
  <el-table ref="apiTable" :data="apiList" v-bind="tableProps">
    <el-table-column type="selection" v-if="multiple"/>
    <el-table-column prop="name" label="接口名称"/>
    <el-table-column prop="group" label="接口分组"/>
    <el-table-column prop="tags" label="标签"/>
    <el-table-column prop="url" label="请求地址"/>
    <el-table-column prop="methods" label="请求方式"/>
    <template #append>
      <CPagination ref="pagination" :page-size="10" @change="getApiList"/>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, toRefs, watch} from "vue";
import {useApiStore} from "@/store";
import CPagination from '@/components/pagination/index.vue'
import {Api} from "@/types";
const name = 'selectMenu'
const apiTable=ref()
const pagination=ref()
const props = defineProps({
  modelValue: {
    type:[String,Boolean,Number,Object,Array],
    default:(p)=>{
      return p.multiple?[]:undefined
    }
  },
  multiple: Boolean,
  valueKey: {
    type: String,
    default: 'id'
  }
})
const {modelValue,multiple,valueKey}=toRefs(props)
const emits = defineEmits<{
(e: 'update:modelValue', value:string | boolean | Record<string, any> | number | unknown[]): void
}>()
const model = ref(props.modelValue)
const apiList=ref<Api[]>([])
watch(modelValue, (value) => {
  model.value = value
  for(const api of apiList.value){
    if(multiple.value){
      apiTable.value?.toggleRowSelection(api,(value as any[]||[]).includes(api.id))
    }else{
      apiTable.value?.setCurrentRow(api)
    }
  }
})
watch(model,(value)=>{
  emits('update:modelValue',value)
})
const getApiList=(pageNum:number,pageSize:number)=>{
  useApiStore().getApiList({pageNum,pageSize}).then(({list,total})=>{
    apiList.value=list
    pagination.value?.setTotal(total)
    nextTick(()=>{
      for(const api of apiList.value){
        if(multiple.value){
          apiTable.value?.toggleRowSelection(api,(model.value as any[]||[]).includes(api.id))
        }else{
          apiTable.value?.setCurrentRow(api)
        }
      }
    })
  })
}
const tableProps=computed(()=>{
  if(multiple.value) return {
    onSelect:(rows,row)=>{
      const value=row[valueKey?.value]
      if(!Array.isArray(model.value)) model.value=[]
      if(!model.value.includes(value)) model.value.push(value)
      else model.value=model.value.filter((v:any)=>v!==value)
    },
    rowKey:valueKey.value
  }
  return {
    highlightCurrentRow:true,
    onCurrentChange:(row)=>{model.value=row[valueKey.value]}
  }
})
onMounted(()=>{
  getApiList(1,10)
})
</script>
