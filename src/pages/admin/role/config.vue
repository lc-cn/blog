<template>
  <div class="p-role-config">
    角色配置
    <el-form v-if="roleForm" label-position="top">
      <el-form-item prop="menuIds" label="可访问菜单">
        <select-menu  v-model="roleForm.menuIds" multiple></select-menu>
      </el-form-item>
      <el-form-item prop="userIds" label="授予用户">
        <select-user  v-model="roleForm.userIds" multiple></select-user>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" link @click="submit">保存</el-button>
        <el-button link @click="router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {ref,onMounted} from "vue";
import {useRoute} from "vue-router";
import SelectMenu from '@/components/select/selectMenu.vue'
import SelectUser from '@/components/select/selectUser.vue'
import {Role} from "@/types";
import {useRoleStore} from "@/store";
import {request} from "@/utils";
import {ElMessage} from "element-plus";
import router from "@/router";
interface RoleForm extends Partial<Role>{
  menuIds:number[]
  userIds:number[]
}
const roleForm=ref<RoleForm>({
  id:undefined,
  name:undefined,
  menuIds:[],
  userIds:[]
})
const submit=()=>{
  request.post('/role/bind',roleForm.value,{params:{id:roleForm.value.id}}).then(res=>{
    if(res.code===200){
      ElMessage.success('配置成功')
      router.back()
    }
  })
}
onMounted(()=>{
  useRoleStore().getRoleInfo({id:Number(useRoute().query.id)}).then(res=>{
    roleForm.value={
      id:res.id,
      name:res.name,
      menuIds:res.menus.map(menu=>menu.id),
      userIds:res.users.map(user=>user.id)
    }
  })
})
</script>

<style scoped>

</style>