<template>
  <el-cascader-panel
      v-model="model"
      :value-key="valueKey"
      :options="menus"
      :props="{label:'name',value:'id',multiple}"
      v-bind="$attrs">
  </el-cascader-panel>
</template>

<script lang="ts" setup>
import {onMounted, ref, toRefs, watch} from "vue";
import {useMenuStore} from "@/store";
const {menus}=useMenuStore()
const name = 'selectMenu'
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
const {modelValue}=toRefs(props)
const emits = defineEmits<{
  (e: 'update:modelValue', value:string | boolean | Record<string, any> | number | unknown[]): void
}>()
const model = ref(props.modelValue)
watch(modelValue, (value) => {
  model.value = value
})
watch(model,(value)=>{
  emits('update:modelValue',value)
})
onMounted(()=>{
  useMenuStore().init(null,true)
})
</script>
