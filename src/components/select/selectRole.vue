<template>
  <el-table ref="roleTable" :data="roleList" v-bind="tableProps">
    <el-table-column type="selection" v-if="multiple"/>
    <el-table-column prop="name" label="角色名"/>
    <template #append>
      <CPagination ref="pagination" :page-size="10" @change="getRoleList"/>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, toRefs, watch} from "vue";
import {useRoleStore} from "@/store";
import CPagination from '@/components/pagination/index.vue'
import {Role} from "@/types";
const name = 'selectRole'
const roleTable=ref()
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
const pagination=ref()
const {modelValue,multiple,valueKey}=toRefs(props)
const emits = defineEmits<{
(e: 'update:modelValue', value:string | boolean | Record<string, any> | number | unknown[]): void
}>()
const model = ref(props.modelValue)
const roleList=ref<Role[]>([])
watch(modelValue, (value) => {
  model.value = value
  for(const user of roleList.value){
    if(multiple.value){
      roleTable.value?.toggleRowSelection(user,(value as any[]||[]).includes(user.id))
    }else{
      roleTable.value?.setCurrentRow(user)
    }
  }
})
watch(model,(value)=>{
  emits('update:modelValue',value)
})
const getRoleList=(pageNum:number,pageSize:number)=>{
  useRoleStore().getRoleList({pageNum,pageSize}).then(({list,total})=>{
    roleList.value=list
    pagination.value?.setTotal(total)
    nextTick(()=>{
      for(const role of roleList.value){
        if(multiple.value){
          roleTable.value?.toggleRowSelection(role,(model.value as any[]||[]).includes(role.id))
        }else{
          roleTable.value?.setCurrentRow(role)
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
  getRoleList(1,10)
})
</script>