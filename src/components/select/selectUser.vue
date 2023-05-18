<template>
  <el-table ref="userTable" :data="userStore.users.list" v-bind="tableProps">
    <el-table-column type="selection" v-if="multiple"/>
    <el-table-column prop="username" label="用户名"/>
    <el-table-column prop="nickname" label="昵称"/>
    <el-table-column prop="email" label="邮箱"/>
    <template #append>
      <CPagination ref="pagination" @change="getUserList"/>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, toRefs, watch} from "vue";
import {useUserStore} from "@/store";
import CPagination from '@/components/pagination/index.vue'
const userStore=useUserStore()
const name = 'selectMenu'
const userTable=ref()
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
watch(modelValue, (value) => {
  model.value = value
  for(const user of userStore.users.list){
    if(multiple.value){
      userTable.value?.toggleRowSelection(user,(value as any[]||[]).includes(user.id))
    }else{
      userTable.value?.setCurrentRow(user)
    }
  }
})
watch(model,(value)=>{
  emits('update:modelValue',value)
})
const getUserList=(pageNum:number,pageSize:number)=>{
  useUserStore().getList(pageNum,pageSize,true)
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
  useUserStore().getList().then(({list})=>{
    nextTick(()=>{
      for(const user of list){
        if(multiple.value){
          userTable.value?.toggleRowSelection(user,(model.value as any[]||[]).includes(user.id))
        }else{
          userTable.value?.setCurrentRow(user)
        }
      }
    })
  })
})
</script>