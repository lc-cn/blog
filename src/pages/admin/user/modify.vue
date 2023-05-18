<template>
  <div class="p-menu-modify">
    <p>{{ title }}</p>
    <el-form inline label-width="80" label-position="top" :model="menuForm">
      <el-row>
        <el-form-item prop="name" label="用户名">
          <el-input placeholder="请输入用户名称" v-model="menuForm.username" :disabled="isReadonly"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="icon" label="昵称">
          <el-form-item prop="name" label="用户名">
            <el-input placeholder="请输入用户名称" v-model="menuForm.username" :disabled="isReadonly"></el-input>
          </el-form-item>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="type" label="头像">
          <el-input placeholder="请上传头像" v-model="menuForm.avatar" :disabled="isReadonly">
            <template #append>
              <el-upload :show-file-list="false">
                <template #trigger>
                  <el-button>上传</el-button>
                </template>
              </el-upload>
            </template>
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="path" label="邮箱">
          <el-input placeholder="请输入邮箱" type="email" v-model="menuForm.email" :disabled="isReadonly"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="sort" label="排序">
          <el-input placeholder="请输入年龄" type="number" v-model="menuForm.age" :disabled="isReadonly"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="component" label="密码">
          <el-input placeholder="请输入组件路径" v-model="menuForm.password" :disabled="isReadonly"></el-input>
        </el-form-item>
      </el-row>
      <el-affix offset="20" position="bottom">
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="router.back()">返回</el-button>
        </el-form-item>
      </el-affix>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, computed} from "vue";
import {useRoute} from "vue-router";
import {useUserStore} from "@/store";
import {User} from "@/types";
import router from "@/router";
import {ElMessage} from "element-plus";

const id = computed(() => Number(useRoute().query.id))
const type = computed(() => useRoute().query.type)
const title = computed(() => type.value === 'info' ? '用户详情' : id.value ? '修改用户资料' : '添加用户')
const isReadonly = computed(() => type.value === 'info')
const menuForm = ref<Partial<User>>({
})
const submit = () => {
  if (id.value) {
    useUserStore().updateUser(menuForm.value).then(res => {
      if (res.code === 200) {
        ElMessage.success('修改成功')
        router.back()
      }
    })
  } else {
    useUserStore().addUser(menuForm.value).then(res => {
      if (res.code === 200) {
        ElMessage.success('添加成功')
        router.back()
      }
    })
  }
}
onMounted(async () => {
  if (id.value) {
    menuForm.value = await useUserStore().getUserInfo({id: id.value})
  }
})
</script>

<style scoped lang="scss">
.p-menu-modify {
  padding: 20px;
  margin: 0 0 0 0;
  .el-row {
    width: 100%;
  }

}
</style>