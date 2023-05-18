<template>
  <div class="p-menu-modify">
    <p>{{ title }}</p>
    <el-form inline label-width="80" label-position="top" :model="menuForm">
      <el-row>
        <el-form-item prop="name" label="菜单名称">
          <el-input placeholder="请输入菜单名称" v-model="menuForm.name" :disabled="isReadonly"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="icon" label="图标">
          <el-input placeholder="请输入图标名称" v-model="menuForm.icon" :disabled="isReadonly">
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
        <el-form-item prop="type" label="类型">
          <el-select placeholder="请选择菜单类型" v-model="menuForm.type" :disabled="isReadonly">
            <el-option label="目录" :value="0"></el-option>
            <el-option label="菜单" :value="1"></el-option>
            <el-option label="按钮" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="path" label="菜单路径">
          <el-input placeholder="请输入菜单路径" v-model="menuForm.path" :disabled="isReadonly"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="sort" label="排序">
          <el-input placeholder="排序" type="number" v-model="menuForm.sort" :disabled="isReadonly"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="component" label="组件路径">
          <el-input placeholder="请输入组件路径" v-model="menuForm.component" :disabled="isReadonly"></el-input>
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
import {useMenuStore} from "@/store";
import {Menu} from "@/types";
import router from "@/router";
import {ElMessage} from "element-plus";

const id = computed(() => Number(useRoute().query.id))
const type = computed(() => useRoute().query.type)
const title = computed(() => type.value === 'info' ? '菜单详情' : id.value ? '修改菜单' : '添加菜单')
const isReadonly = computed(() => type.value === 'info')
const menuForm = ref<Partial<Menu>>({
  pId:Number(useRoute().query.pId)||null,
  name: undefined,
  icon: undefined,
  type: undefined,
  path: undefined,
  sort: undefined,
  component: undefined,
})
const submit = () => {
  if (id.value) {
    useMenuStore().updateMenu(menuForm.value).then(res => {
      if (res.code === 200) {
        ElMessage.success('修改成功')
        router.back()
      }
    })
  } else {
    useMenuStore().addMenu(menuForm.value).then(res => {
      if (res.code === 200) {
        ElMessage.success('添加成功')
        router.back()
      }
    })
  }
}
onMounted(async () => {
  if (id.value) {
    const {code, data} = await useMenuStore().getMenuInfo({id: id.value})
    if (code !== 200) return
    menuForm.value = data
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