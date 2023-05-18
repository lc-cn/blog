<template>
  <div class="p-user-config">
    角色配置
    <el-form v-if="userForm" label-position="top">
      <el-form-item prop="userIds" label="绑定角色">
        <select-role  v-model="userForm.roleIds" multiple></select-role>
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
import SelectRole from '@/components/select/selectRole.vue'
import {User} from "@/types";
import {useUserStore} from "@/store";
import {request} from "@/utils";
import {ElMessage} from "element-plus";
import router from "@/router";
interface UserForm extends Partial<User>{
  roleIds:number[]
}
const userForm=ref<UserForm>({
  id:undefined,
  username:undefined,
  roleIds:[],
})
const submit=()=>{
  request.post('/user/bind',userForm.value,{params:{id:userForm.value.id}}).then(res=>{
    if(res.code===200){
      ElMessage.success('配置成功')
      router.back()
    }
  })
}
onMounted(()=>{
  useUserStore().getUserInfo({id:Number(useRoute().query.id)}).then((res)=>{
    userForm.value={
      id:res.id,
      username:res.username,
      roleIds:res.roles.map(role=>role.id)
    }
  })
})
</script>
