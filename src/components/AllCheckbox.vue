<template>
  <span>
    <span @click="checkCancel">
      <el-checkbox v-model="allSelect" :indeterminate="checkedSome" :label="allLabel" style="margin-right: 30px"/>
    </span>
    <el-checkbox-group v-model="model">
    <el-checkbox v-for="option in options" :key="option[props.value]" :label="option[props.value]">
      {{ option[props.label] }}
    </el-checkbox>
    </el-checkbox-group>
  </span>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
const emit=defineEmits<{
  (e:'update:modelValue',value:string[]):void
}>()
const props=withDefaults(defineProps<{
  modelValue:string[],
  allLabel:string,
  props:{
    label:string,
    value:string
  },
  options:{
    label:string,
    value:string
  }[]
}>(),{
  modelValue(){
    return []
  },
  allLabel:'全选',
  props(){
    return {
      label:'name',
      value:'id'
    }
  },
  options(){
    return []
  }
})
const allSelect=ref(false)
const model=computed({
  get(){
    return props.modelValue
  },
  set(v){
    emit('update:modelValue',v)
  }
})
const checkedSome=computed(()=>{
  return props.options.length!==0 && model.value?.length!==0 && props.options.length!==model.value.length
})
const checkCancel=(e)=>{
  e.stopPropagation()
  if(allSelect.value){
    model.value=[]
  }else{
    model.value=props.options.map(item=>item[props.props.value])
  }
  allSelect.value=!allSelect.value
}
</script>
