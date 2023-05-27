<template>
  <div class="p-menu-auth">
    菜单配置
    <el-form v-if="menuForm" label-position="top">
      <el-form-item prop="apiIds" label="可访问API">
        <select-api  v-model="menuForm.apiIds" multiple></select-api>
      </el-form-item>
      <el-form-item prop="roleIds" label="授予角色">
        <select-role  v-model="menuForm.roleIds" multiple></select-role>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" link @click="submit">保存</el-button>
        <el-button link @click="router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, computed} from "vue";
import {useRoute} from "vue-router";
import SelectApi from '@/components/select/selectApi.vue'
import SelectRole from '@/components/select/selectRole.vue'
import {Menu} from "@/types";
import {useMenuStore} from "@/store";
import {request} from "@/utils";
import {ElMessage} from "element-plus";
import router from "@/router";
interface MenuForm extends Partial<Menu>{
  apiIds:number[]
  roleIds:number[]
}
const menuForm=ref<MenuForm>({
  id:undefined,
  name:undefined,
  apiIds:[],
  roleIds:[]
})
const id=computed(()=>Number(useRoute().query.id))
const submit=()=>{
  request.post('/menu/bind',menuForm.value,{params:{id:menuForm.value.id}}).then(res=>{
    if(res.code===200){
      ElMessage.success('配置成功')
      router.back()
    }
  })
}
onMounted(()=>{
  if(!id.value) return
  useMenuStore().getMenuInfo({id:id.value}).then(res=>{
    menuForm.value={
      id:res.data.id,
      name:res.data.name,
      apiIds:res.data.apis?.map(api=>api.id)||[],
      roleIds:res.data.roles?.map(role=>role.id)||[]
    }
  })
})
</script>

<style scoped>

</style>