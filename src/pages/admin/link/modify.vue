<template>
  <div class="p-menu-modify">
    <p>{{ title }}</p>
    <el-form inline label-width="80" label-position="top" :model="linkForm">
      <el-row>
        <el-form-item prop="icon" label="图标">
          <el-input placeholder="请上传图标" v-model="linkForm.icon" :disabled="isReadonly">
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
        <el-form-item prop="name" label="名称">
          <el-input placeholder="请输入名称" v-model="linkForm.name" :disabled="isReadonly"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="desc" label="描述">
          <el-input placeholder="请输入描述" v-model="linkForm.desc" :disabled="isReadonly"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="url" label="地址">
          <el-input placeholder="请输入地址" v-model="linkForm.url" :disabled="isReadonly"/>
        </el-form-item>
      </el-row>
      <el-affix :offset="20" position="bottom">
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
import {useLinkStore} from "@/store";
import {Link} from "@/types";
import router from "@/router";
import {ElMessage} from "element-plus";

const id = computed(() => Number(useRoute().query.id))
const type = computed(() => useRoute().query.type)
const title = computed(() => type.value === 'info' ? '友链详情' : id.value ? '修改友链' : '添加友链')
const isReadonly = computed(() => type.value === 'info')
const linkForm = ref<Partial<Link>>({
})
const submit = () => {
  if (id.value) {
    useLinkStore().updateLink(linkForm.value).then(res => {
      if (res.code === 200) {
        ElMessage.success('修改成功')
        router.back()
      }
    })
  } else {
    useLinkStore().addLink(linkForm.value).then(res => {
      if (res.code === 200) {
        ElMessage.success('添加成功')
        router.back()
      }
    })
  }
}
onMounted(async () => {
  if (id.value) {
    const {data,code} = await useLinkStore().getLinkInfo({id: id.value})
    if(code!==200) return
    linkForm.value =  data
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
